/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { TextDocument, Range, Position } from 'vscode-languageserver-types';
import { Comment } from './comment';
import { ParserDirective } from './parserDirective';
import { Instruction } from './instruction';
import { Add } from './instructions/add';
import { Arg } from './instructions/arg';
import { Cmd } from './instructions/cmd';
import { Copy } from './instructions/copy';
import { Env } from './instructions/env';
import { Entrypoint } from './instructions/entrypoint';
import { From } from './instructions/from';
import { Healthcheck } from './instructions/healthcheck';
import { Label } from './instructions/label';
import { Onbuild } from './instructions/onbuild';
import { Run } from './instructions/run';
import { Shell } from './instructions/shell';
import { Stopsignal } from './instructions/stopsignal';
import { Workdir } from './instructions/workdir';
import { User } from './instructions/user';
import { Volume } from './instructions/volume';
import { Dockerfile } from './dockerfile';
import { Keyword } from './main';

export class Parser {

    private escapeChar: string = null;

    public static createInstruction(document: TextDocument, dockerfile: Dockerfile, escapeChar: string, lineRange: Range, instruction: string, instructionRange: Range) {
        switch (instruction.toUpperCase()) {
            case "ADD":
                return new Add(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ARG":
                return new Arg(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "CMD":
                return new Cmd(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "COPY":
                return new Copy(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ENTRYPOINT":
                return new Entrypoint(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ENV":
                return new Env(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "FROM":
                return new From(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "HEALTHCHECK":
                return new Healthcheck(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "LABEL":
                return new Label(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ONBUILD":
                return new Onbuild(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "RUN":
                return new Run(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "SHELL":
                return new Shell(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "STOPSIGNAL":
                return new Stopsignal(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "WORKDIR":
                return new Workdir(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "USER":
                return new User(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "VOLUME":
                return new Volume(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
        }
        return new Instruction(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
    }

    private getParserDirectives(document: TextDocument, buffer: string): ParserDirective[] {
        // reset the escape directive in between runs
        const directives = [];
        this.escapeChar = '';
        directiveCheck: for (let i = 0; i < buffer.length; i++) {
            switch (buffer.charAt(i)) {
                case ' ':
                case '\t':
                    break;
                case '\r':
                case '\n':
                    // blank lines stop the parsing of directives immediately
                    break directiveCheck;
                case '#':
                    let commentStart = i;
                    let directiveStart = -1;
                    let directiveEnd = -1;
                    for (let j = i + 1; j < buffer.length; j++) {
                        let char = buffer.charAt(j);
                        switch (char) {
                            case ' ':
                            case '\t':
                                if (directiveStart !== -1 && directiveEnd === -1) {
                                    directiveEnd = j;
                                }
                                break;
                            case '\r':
                            case '\n':
                                break directiveCheck;
                            case '=':
                                let valueStart = -1;
                                let valueEnd = -1;
                                if (directiveEnd === -1) {
                                    directiveEnd = j;
                                }
                                // assume the line ends with the file
                                let lineEnd = buffer.length;
                                directiveValue: for (let k = j + 1; k < buffer.length; k++) {
                                    char = buffer.charAt(k);
                                    switch (char) {
                                        case '\r':
                                        case '\n':
                                            if (valueStart !== -1 && valueEnd === -1) {
                                                valueEnd = k;
                                            }
                                            // line break found, reset
                                            lineEnd = k;
                                            break directiveValue;
                                        case '\t':
                                        case ' ':
                                            if (valueStart !== -1 && valueEnd === -1) {
                                                valueEnd = k;
                                            }
                                            continue;
                                        default:
                                            if (valueStart === -1) {
                                                valueStart = k;
                                            }
                                            break;
                                    }
                                }

                                let lineRange = Range.create(document.positionAt(commentStart), document.positionAt(lineEnd));
                                if (directiveStart === -1) {
                                    // no directive, it's a regular comment
                                    break directiveCheck;
                                }

                                if (valueStart === -1) {
                                    // no non-whitespace characters found, highlight all the characters then
                                    valueStart = j + 1;
                                    valueEnd = lineEnd;
                                } else if (valueEnd === -1) {
                                    // reached EOF
                                    valueEnd = buffer.length;
                                }

                                let nameRange = Range.create(document.positionAt(directiveStart), document.positionAt(directiveEnd));
                                let valueRange = Range.create(document.positionAt(valueStart), document.positionAt(valueEnd));
                                directives.push(new ParserDirective(document, lineRange, nameRange, valueRange));
                                directiveStart = -1;
                                if (buffer.charAt(valueEnd) === '\r') {
                                    // skip over the \r
                                    i = valueEnd + 1;
                                } else {
                                    i = valueEnd;
                                }
                                continue directiveCheck;
                            default:
                                if (directiveStart === -1) {
                                    directiveStart = j;
                                }
                                break;
                        }
                    }
                    break;
                default:
                    break directiveCheck;
            }
        }
        return directives;
    }

    public parse(buffer: string): Dockerfile {
        let document = TextDocument.create("", "", 0, buffer);
        let dockerfile = new Dockerfile(document);
        let directives = this.getParserDirectives(document, buffer);
        let offset = 0;
        this.escapeChar = '\\';
        if (directives.length > 0) {
            dockerfile.setDirectives(directives);
            this.escapeChar = dockerfile.getEscapeCharacter();
            // start parsing after the directives
            offset = document.offsetAt(Position.create(directives.length, 0));
        }

        lineCheck: for (let i = offset; i < buffer.length; i++) {
            let char = buffer.charAt(i);
            switch (char) {
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    break;
                case '#':
                    for (let j = i + 1; j < buffer.length; j++) {
                        char = buffer.charAt(j);
                        switch (char) {
                            case '\r':
                                dockerfile.addComment(new Comment(document, Range.create(document.positionAt(i), document.positionAt(j))));
                                // offset one more for \r\n
                                i = j + 1;
                                continue lineCheck;
                            case '\n':
                                dockerfile.addComment(new Comment(document, Range.create(document.positionAt(i), document.positionAt(j))));
                                i = j;
                                continue lineCheck;
                        }
                    }
                    // reached EOF
                    let range = Range.create(document.positionAt(i), document.positionAt(buffer.length));
                    dockerfile.addComment(new Comment(document, range));
                    break lineCheck;
                default:
                    let instruction = char;
                    let instructionStart = i;
                    let instructionEnd = -1;
                    let lineRange: Range | null = null;
                    let instructionRange: Range | null = null;
                    let escapedInstruction = false;
                    instructionCheck: for (let j = i + 1; j < buffer.length; j++) {
                        char = buffer.charAt(j);
                        switch (char) {
                            case this.escapeChar:
                                escapedInstruction = true;
                                char = buffer.charAt(j + 1);
                                if (char === '\r') {
                                    // skip two for \r\n
                                    j += 2;
                                } else if (char === '\n') {
                                    j++;
                                } else if (char === ' ' || char === '\t') {
                                    for (let k = j + 2; k < buffer.length; k++) {
                                        switch (buffer.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                                break;
                                            case '\r':
                                                // skip another for \r\n
                                                j = k + 1;
                                                continue instructionCheck;
                                            case '\n':
                                                j = k;
                                                continue instructionCheck;
                                            default:
                                                instructionEnd = j + 1;
                                                instruction = instruction + this.escapeChar;
                                                j = k - 2;
                                                continue instructionCheck;
                                        }
                                    }
                                    instructionEnd = j + 1;
                                    instruction = instruction + this.escapeChar;
                                    break instructionCheck;
                                } else {
                                    instructionEnd = j + 1;
                                    instruction = instruction + this.escapeChar;
                                }
                                break;
                            case ' ':
                            case '\t':
                                if (escapedInstruction) {
                                    // on an escaped newline, need to search for non-whitespace
                                    escapeCheck: for (let k = j + 1; k < buffer.length; k++) {
                                        switch (buffer.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                                break;
                                            case '\r':
                                                // skip another for \r\n
                                                j = k + 1;
                                                continue instructionCheck;
                                            case '\n':
                                                j = k;
                                                continue instructionCheck;
                                            default:
                                                break escapeCheck;
                                        }
                                    }
                                    escapedInstruction = false;
                                }
                                if (instructionEnd === -1) {
                                    instructionEnd = j;
                                }

                                let escaped = false;
                                let checkHeredoc = true;
                                let heredoc = false;
                                let isOnbuild = instruction.toUpperCase() === Keyword.ONBUILD;
                                argumentsCheck: for (let k = j + 1; k < buffer.length; k++) {
                                    switch (buffer.charAt(k)) {
                                        case '\r':
                                        case '\n':
                                            if (escaped) {
                                                continue;
                                            }
                                            i = k;
                                            lineRange = Range.create(document.positionAt(instructionStart), document.positionAt(k));
                                            instructionRange = Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
                                            dockerfile.addInstruction(Parser.createInstruction(document, dockerfile, this.escapeChar, lineRange, instruction, instructionRange));
                                            continue lineCheck;
                                        case this.escapeChar:
                                            let next = buffer.charAt(k + 1);
                                            if (next === '\n') {
                                                escaped = true;
                                                k++;
                                            } else if (next === '\r') {
                                                escaped = true;
                                                // skip two chars for \r\n
                                                k = k + 2;
                                            } else if (next === ' ' || next === '\t') {
                                                escapeCheck: for (let l = k + 2; l < buffer.length; l++) {
                                                    switch (buffer.charAt(l)) {
                                                        case ' ':
                                                        case '\t':
                                                            break;
                                                        case '\r':
                                                            // skip another char for \r\n
                                                            escaped = true;
                                                            k = l + 1;
                                                            break escapeCheck;
                                                        case '\n':
                                                            escaped = true;
                                                            k = l;
                                                            break escapeCheck;
                                                        default:
                                                            k = l;
                                                            break escapeCheck;
                                                    }
                                                }
                                            }
                                            continue;
                                        case '#':
                                            if (escaped) {
                                                for (let l = k + 1; l < buffer.length; l++) {
                                                    switch (buffer.charAt(l)) {
                                                        case '\r':
                                                            dockerfile.addComment(new Comment(document, Range.create(document.positionAt(k), document.positionAt(l))));
                                                            // offset one more for \r\n
                                                            k = l + 1;
                                                            continue argumentsCheck;
                                                        case '\n':
                                                            let range = Range.create(document.positionAt(k), document.positionAt(l));
                                                            dockerfile.addComment(new Comment(document, range));
                                                            k = l;
                                                            continue argumentsCheck;
                                                    }
                                                }

                                                let range = Range.create(document.positionAt(k), document.positionAt(buffer.length));
                                                dockerfile.addComment(new Comment(document, range));
                                                break argumentsCheck;
                                            }
                                            break;
                                        case ' ':
                                        case '\t':
                                            if (!checkHeredoc && isOnbuild) {
                                                // do one more check if an ONBUILD instruction
                                                isOnbuild = false;
                                                checkHeredoc = true;
                                            }
                                            heredoc = false;
                                            break;
                                        case '<':
                                            if (!checkHeredoc) {
                                                break;
                                            } else if (heredoc) {
                                                let heredocNameStart = k + 1;
                                                switch (buffer.charAt(k + 1)) {
                                                    case '-':
                                                        heredocNameStart++;
                                                        break
                                                    case ' ':
                                                    case '\t':
                                                    case '\r':
                                                    case '\n':
                                                        continue argumentsCheck;
                                                }
                                                const heredocEnd = this.getHeredocEnd(buffer, heredocNameStart);
                                                if (heredocEnd === -1) {
                                                    // reached EOF, stop now and consider everything one instruction
                                                    break instructionCheck;
                                                }
                                                const position = this.parseHeredoc(document, buffer, dockerfile, heredocNameStart, heredocEnd, instruction, instructionStart, instructionEnd);
                                                if (position !== -1) {
                                                    i = position;
                                                    continue lineCheck;
                                                }
                                                // reached EOF, just consider everything one instruction
                                                break instructionCheck;
                                            } else {
                                                heredoc = true;
                                            }
                                            break;
                                        default:
                                            if (escaped) {
                                                escaped = false;
                                            }
                                            checkHeredoc = false;
                                            heredoc = false;
                                            break;
                                    }
                                }
                                // reached EOF
                                lineRange = Range.create(document.positionAt(instructionStart), document.positionAt(buffer.length));
                                dockerfile.addInstruction(this.createInstruction(document, dockerfile, instruction, instructionStart, instructionEnd, lineRange));
                                break lineCheck;
                            case '\r':
                                if (instructionEnd === -1) {
                                    instructionEnd = j;
                                }
                                // skip for \r\n
                                j++;
                            case '\n':
                                if (escapedInstruction) {
                                    continue;
                                }
                                if (instructionEnd === -1) {
                                    instructionEnd = j;
                                }
                                lineRange = Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
                                dockerfile.addInstruction(this.createInstruction(document, dockerfile, instruction, instructionStart, instructionEnd, lineRange));
                                i = j;
                                continue lineCheck;
                            default:
                                instructionEnd = j + 1;
                                instruction = instruction + char;
                                break;
                        }
                    }
                    // reached EOF
                    if (instructionEnd === -1) {
                        instructionEnd = buffer.length;
                    }
                    lineRange = Range.create(document.positionAt(instructionStart), document.positionAt(buffer.length));
                    dockerfile.addInstruction(this.createInstruction(document, dockerfile, instruction, instructionStart, instructionEnd, lineRange));
                    break lineCheck;
            }
        }

        dockerfile.organizeComments();

        return dockerfile;
    }

    private parseHeredoc(document: TextDocument, buffer: string, dockerfile: Dockerfile, heredocNameStart: number, heredocEnd: number, instruction: string, instructionStart: number, instructionEnd: number): number {
        const heredocName = document.getText({
            start: document.positionAt(heredocNameStart),
            end: document.positionAt(heredocEnd)
        });
        let startWord = -1;
        let lineStart = false;
        for (let i = heredocEnd; i < buffer.length; i++) {
            switch (buffer.charAt(i)) {
                case ' ':
                case '\t':
                    lineStart = false;
                    break;
                case '\r':
                    if (startWord !== -1) {
                        if (this.matchesHeredoc(document, dockerfile, heredocName, instruction, instructionStart, instructionEnd, startWord, i)) {
                            return i + 1;
                        }
                    }
                    startWord = -1;
                    lineStart = true;
                    break;
                case '\n':
                    if (startWord !== -1) {
                        if (this.matchesHeredoc(document, dockerfile, heredocName, instruction, instructionStart, instructionEnd, startWord, i)) {
                            return i;
                        }
                    }
                    startWord = -1;
                    lineStart = true;
                    break;
                default:
                    if (lineStart) {
                        startWord = i;
                    }
                    lineStart = false;
                    break;
            }
        }
        return -1;
    }

    private matchesHeredoc(document: TextDocument, dockerfile: Dockerfile, heredocName: string, instruction: string, instructionStart: number, instructionEnd: number, startWord: number, end: number): boolean {
        const endPosition = document.positionAt(end);
        const word = document.getText({
            start: document.positionAt(startWord),
            end: endPosition
        });
        if (word === heredocName) {
            const lineRange = Range.create(document.positionAt(instructionStart), endPosition);
            dockerfile.addInstruction(
                this.createInstruction(document, dockerfile, instruction, instructionStart, instructionEnd, lineRange)
            );
            return true;
        }
        return false;
    }

    private getHeredocEnd(buffer: string, heredocNameStart: number): number {
        for (let i = heredocNameStart; i < buffer.length; i++) {
            switch (buffer.charAt(i)) {
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    return i;
            }
        }
        return -1;
    }

    private createInstruction(document: TextDocument, dockerfile: Dockerfile, instruction: string, instructionStart: number, instructionEnd: number, lineRange: Range): Instruction {
        const instructionRange = Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
        return Parser.createInstruction(document, dockerfile, this.escapeChar, lineRange, instruction, instructionRange);
    }

}
