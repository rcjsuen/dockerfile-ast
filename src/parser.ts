/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range, Position } from 'vscode-languageserver-types';
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
import { Util } from './util';
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
        const offset = Util.isUTF8BOM(buffer.substring(0, 1)) ? 1 : 0;
        directiveCheck: for (let i = offset; i < buffer.length; i++) {
            switch (buffer.charAt(i)) {
                case ' ':
                case '\t':
                    break;
                case '\r':
                case '\n':
                    // blank lines stop the parsing of directives immediately
                    break directiveCheck;
                case '#':
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

                                const lineRange = Range.create(document.positionAt(i), document.positionAt(lineEnd));
                                const nameRange = Range.create(document.positionAt(directiveStart), document.positionAt(directiveEnd));
                                const valueRange = Range.create(document.positionAt(valueStart), document.positionAt(valueEnd));
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

    private document: TextDocument;
    private buffer: string;

    public parse(buffer: string): Dockerfile {
        this.document = TextDocument.create("", "", 0, buffer);
        this.buffer = buffer;
        let dockerfile = new Dockerfile(this.document);
        let directives = this.getParserDirectives(this.document, this.buffer);
        let offset = 0;
        this.escapeChar = '\\';
        if (directives.length > 0) {
            dockerfile.setDirectives(directives);
            this.escapeChar = dockerfile.getEscapeCharacter();
            // start parsing after the directives
            offset = this.document.offsetAt(Position.create(directives.length, 0));
        } else if (Util.isUTF8BOM(buffer.substring(0, 1))) {
            offset = 1;
        }

        for (let i = offset; i < this.buffer.length; i++) {
            const char = this.buffer.charAt(i);
            switch (char) {
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    break;
                case '#':
                    i = this.processComment(dockerfile, i);
                    break;
                default:
                    i = this.processInstruction(dockerfile, char, i);
                    break;
            }
        }

        dockerfile.organizeComments();

        return dockerfile;
    }

    private processInstruction(dockerfile: Dockerfile, char: string, start: number): number {
        let instruction = char;
        let instructionEnd = -1;
        let escapedInstruction = false;
        instructionCheck: for (let i = start + 1; i < this.buffer.length; i++) {
            char = this.buffer.charAt(i);
            switch (char) {
                case this.escapeChar:
                    escapedInstruction = true;
                    char = this.buffer.charAt(i + 1);
                    if (char === '\r' || char === '\n') {
                        if (instructionEnd === -1) {
                            instructionEnd = i;
                        }
                        i++;
                    } else if (char === ' ' || char === '\t') {
                        for (let j = i + 2; j < this.buffer.length; j++) {
                            switch (this.buffer.charAt(j)) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                case '\n':
                                    i = j;
                                    continue instructionCheck;
                                default:
                                    // found an argument, mark end of instruction
                                    instructionEnd = i + 1;
                                    instruction = instruction + this.escapeChar;
                                    i = j - 2;
                                    continue instructionCheck;
                            }
                        }
                        // reached EOF
                        instructionEnd = i + 1;
                        instruction = instruction + this.escapeChar;
                        break instructionCheck;
                    } else {
                        instructionEnd = i + 1;
                        instruction = instruction + this.escapeChar;
                        // reset and consider it as one contiguous word
                        escapedInstruction = false;
                    }
                    break;
                case ' ':
                case '\t':
                    if (escapedInstruction) {
                        // on an escaped newline, need to search for non-whitespace
                        escapeCheck: for (let j = i + 1; j < this.buffer.length; j++) {
                            switch (this.buffer.charAt(j)) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                case '\n':
                                    i = j;
                                    continue instructionCheck;
                                default:
                                    break escapeCheck;
                            }
                        }
                        escapedInstruction = false;
                    }
                    if (instructionEnd === -1) {
                        instructionEnd = i;
                    }
                    i = this.processArguments(dockerfile, instruction, instructionEnd, start, i);
                    dockerfile.addInstruction(
                        this.createInstruction(dockerfile, instruction, start, instructionEnd, i)
                    );
                    return i;
                case '\r':
                case '\n':
                    if (escapedInstruction) {
                        continue;
                    }
                    if (instructionEnd === -1) {
                        instructionEnd = i;
                    }
                    dockerfile.addInstruction(this.createInstruction(dockerfile, instruction, start, i, i));
                    return i;
                case '#':
                    if (escapedInstruction) {
                        continue;
                    }
                default:
                    instructionEnd = i + 1;
                    instruction = instruction + char;
                    escapedInstruction = false;
                    break;
            }
        }
        // reached EOF
        if (instructionEnd === -1) {
            instructionEnd = this.buffer.length;
        }
        dockerfile.addInstruction(this.createInstruction(dockerfile, instruction, start, instructionEnd, this.buffer.length));
        return this.buffer.length;
    }

    private parseHeredocName(value: string): string | null {
        value = value.substring(2);
        if (value.charAt(0) === '-') {
            value = value.substring(1);
        }
        if (value.charAt(0) === '"' || value.charAt(0) === '\'') {
            value = value.substring(1, value.length - 1);
        }
        if (value.charAt(0) === "<") {
            return null;
        }
        return value;
    }

    private processHeredocs(instruction: Instruction, offset: number): number {
        let keyword = instruction.getKeyword();
        if (keyword === Keyword.ONBUILD) {
            instruction = (instruction as Onbuild).getTriggerInstruction();
            if (instruction === null) {
                return offset;
            }
            keyword = instruction.getKeyword();
        }
        if (keyword !== Keyword.ADD && keyword !== Keyword.COPY && keyword !== Keyword.RUN) {
            return offset;
        }
        const heredocs = [];
        for (const arg of instruction.getArguments()) {
            const value = arg.getValue();
            if (value.startsWith("<<") && value.length > 2) {
                const name = this.parseHeredocName(value);
                if (name !== null) {
                    heredocs.push(name);
                }
            }
        }

        if (heredocs.length > 0) {
            for (const heredoc of heredocs) {
                offset = this.parseHeredoc(heredoc, offset);
            }
        }
        return offset;
    }

    private processArguments(dockerfile: Dockerfile, instruction: string, instructionEnd: number, start: number, offset: number): number {
        let escaped = false;
        argumentsCheck: for (let i = offset + 1; i < this.buffer.length; i++) {
            switch (this.buffer.charAt(i)) {
                case '\r':
                case '\n':
                    if (escaped) {
                        continue;
                    }
                    return this.processHeredocs(this.createInstruction(dockerfile, instruction, start, instructionEnd, i), i);
                case this.escapeChar:
                    const next = this.buffer.charAt(i + 1);
                    if (next === '\n' || next === '\r') {
                        escaped = true;
                        i++;
                    } else if (next === ' ' || next === '\t') {
                        for (let j = i + 2; j < this.buffer.length; j++) {
                            switch (this.buffer.charAt(j)) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                case '\n':
                                    escaped = true;
                                default:
                                    i = j;
                                    continue argumentsCheck;
                            }
                        }
                        // reached EOF
                        return this.buffer.length;
                    }
                    continue;
                case '#':
                    if (escaped) {
                        i = this.processComment(dockerfile, i);
                        continue argumentsCheck;
                    }
                    break;
                case ' ':
                case '\t':
                    break;
                default:
                    if (escaped) {
                        escaped = false;
                    }
                    break;
            }
        }
        return this.buffer.length;
    }

    private processComment(dockerfile: Dockerfile, start: number): number {
        let end = this.buffer.length;
        commentLoop: for (let i = start + 1; i < this.buffer.length; i++) {
            switch (this.buffer.charAt(i)) {
                case '\r':
                case '\n':
                    end = i;
                    break commentLoop;
            }
        }
        const range = Range.create(this.document.positionAt(start), this.document.positionAt(end));
        dockerfile.addComment(new Comment(this.document, range));
        return end;
    }

    private parseHeredoc(heredocName: string, offset: number): number {
        let startWord = -1;
        let lineStart = true;
        for (let i = offset; i < this.buffer.length; i++) {
            switch (this.buffer.charAt(i)) {
                case ' ':
                case '\t':
                    lineStart = false;
                    break;
                case '\r':
                case '\n':
                    if (startWord !== -1 && heredocName === this.buffer.substring(startWord, i)) {
                        return i;
                    }
                    startWord = -1;
                    lineStart = true;
                    break;
                default:
                    if (lineStart) {
                        startWord = i;
                        lineStart = false;
                    }
                    break;
            }
        }
        return this.buffer.length;
    }

    private createInstruction(dockerfile: Dockerfile, instruction: string, start: number, instructionEnd: number, end: number): Instruction {
        const startPosition = this.document.positionAt(start);
        const instructionRange = Range.create(startPosition, this.document.positionAt(instructionEnd));
        const lineRange = Range.create(startPosition, this.document.positionAt(end));
        return Parser.createInstruction(this.document, dockerfile, this.escapeChar, lineRange, instruction, instructionRange);
    }

}
