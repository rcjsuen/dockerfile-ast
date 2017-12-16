/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range, Position } from 'vscode-languageserver-types';
import { Util } from './util';
import { Dockerfile } from './dockerfile';
import { Line } from './line';
import { Argument } from './argument';
import { Variable } from './variable';

export class Instruction extends Line {

    protected readonly dockerfile: Dockerfile;

    protected readonly escapeChar: string;

    private readonly instruction: string;

    private readonly instructionRange: Range;

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range);
        this.dockerfile = dockerfile;
        this.escapeChar = escapeChar;
        this.instruction = instruction;
        this.instructionRange = instructionRange;
    }

    protected getRangeContent(range: Range): string | null {
        if (range === null) {
            return null;
        }
        return this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
    }

    public getInstructionRange(): Range {
        return this.instructionRange;
    }

    public getInstruction(): string {
        return this.instruction;
    }

    public getKeyword(): string {
        return this.getInstruction().toUpperCase();
    }

    public getArgumentsRange(): Range | null {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        return Range.create(args[0].getRange().start, args[args.length - 1].getRange().end);
    }

    public getArgumentsRanges(): Range[] {
        let args = this.getArguments();
        if (args.length === 0) {
            return [];
        }

        if (args[0].getRange().start.line === args[args.length - 1].getRange().end.line) {
            return [Range.create(args[0].getRange().start, args[args.length - 1].getRange().end)];
        }

        let ranges = [];
        let end = -1;
        let startPosition = args[0].getRange().start;
        let range = this.getInstructionRange();
        let extra = this.document.offsetAt(range.end) - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra, this.document.offsetAt(args[args.length - 1].getRange().end) - this.document.offsetAt(range.start));
        let offset = this.document.offsetAt(range.start) + extra;
        let start = false;
        let comment = false;
        for (let i = 0; i < fullArgs.length; i++) {
            let char = fullArgs.charAt(i);
            if (char === this.escapeChar) {
                let next = fullArgs.charAt(i + 1);
                if (next === ' ' || next === '\t') {
                    whitespaceCheck: for (let j = i + 2; j < fullArgs.length; j++) {
                        switch (fullArgs.charAt(j)) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                j++;
                            case '\n':
                                ranges.push(Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                                startPosition = null;
                                start = true;
                                comment = false;
                                i = j;
                                break whitespaceCheck;
                            default:
                                break whitespaceCheck;
                        }
                    }
                } else if (next === '\r') {
                    ranges.push(Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                    startPosition = null;
                    start = true;
                    comment = false;
                    i += 2;
                } else if (next === '\n') {
                    ranges.push(Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                    startPosition = null;
                    start = true;
                    comment = false;
                    i++;
                } else {
                    i++;
                }
            } else if (Util.isNewline(char)) {
                if (comment) {
                    if (startPosition) {
                        ranges.push(Range.create(startPosition, this.document.positionAt(offset + end)));
                    }
                    startPosition = null;
                    start = true;
                    comment = false;
                }
            } else {
                if (!comment) {
                    if (startPosition === null) {
                        if (char === '#') {
                            comment = true;
                        }

                        let position = this.document.positionAt(offset + i);
                        if (position.character !== 0) {
                            startPosition = Position.create(position.line, 0);
                        }
                    }
                    end = i;
                }
            }
        }
        ranges.push(Range.create(startPosition, this.document.positionAt(offset + end + 1)));
        return ranges;
    }

    public getRawArgumentsContent(): string | null {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }

        return this.getRangeContent(Range.create(args[0].getRange().start, args[args.length - 1].getRange().end));
    }

    public getArgumentsContent(): string | null {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }

        let content = "";
        let ranges = this.getArgumentsRanges();
        let documentText = this.document.getText();
        for (let range of ranges) {
            content += documentText.substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
        }
        return content;
    }

    public getArguments(): Argument[] {
        let args = [];
        let range = this.getInstructionRange();
        let extra = this.document.offsetAt(range.end) - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra);
        let offset = this.document.offsetAt(range.start) + extra;
        let start = false;
        let comment = false;
        let found = -1;
        let escapeMarker = -1;
        let escapedArg = "";
        for (let i = 0; i < fullArgs.length; i++) {
            let char = fullArgs.charAt(i);
            if (Util.isWhitespace(char)) {
                if (Util.isNewline(char) && comment) {
                    comment = false;
                } else if (found !== -1) {
                    if (escapeMarker === -1) {
                        args.push(new Argument(escapedArg, fullArgs.substring(found, i), Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + i))));
                    } else {
                        args.push(new Argument(escapedArg, fullArgs.substring(found, escapeMarker), Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                    }
                    escapedArg = "";
                    found = -1;
                }
            } else if (char === this.escapeChar) {
                let next = fullArgs.charAt(i + 1);
                if (next === ' ' || next === '\t') {
                    whitespaceCheck: for (let j = i + 2; j < fullArgs.length; j++) {
                        let newlineCheck = fullArgs.charAt(j);
                        switch (newlineCheck) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                j++;
                            case '\n':
                                start = true;
                                escapeMarker = i;
                                i = j;
                                break whitespaceCheck;
                            default:
                                escapeMarker = i;
                                if (found === -1) {
                                    i = j - 1;
                                }
                                break whitespaceCheck;
                        }
                    }
                } else if (next === '\r') {
                    start = true;
                    escapeMarker = i;
                    i += 2;
                } else if (next === '\n') {
                    start = true;
                    escapeMarker = i;
                    i++;
                } else if (next === '$') {
                    escapedArg = escapedArg + char + next;
                    if (found === -1) {
                        found = i;
                    }
                    i++;
                } else {
                    escapedArg = escapedArg + next;
                    if (found === -1) {
                        found = i;
                    }
                    i++;
                }
            } else if (!comment) {
                if (start && char === '#') {
                    start = false;
                    comment = true;
                } else {
                    escapeMarker = -1;
                    escapedArg = escapedArg + char;
                    if (found === -1) {
                        found = i;
                    }
                }
            }
        }

        if (found !== -1) {
            args.push(new Argument(escapedArg, fullArgs.substring(found), Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + fullArgs.length))));
        }

        return args;
    }

    public getExpandedArguments(): Argument[] {
        let args = this.getArguments();
        for (let i = 0; i < args.length; i++) {
            const argRange = args[i].getRange();
            let offset = this.document.offsetAt(argRange.start);
            const variables = this.parseVariables(offset, args[i].getValue());
            const swaps = [];
            let requiresExpansion = false;
            for (let variable of variables) {
                const value = this.dockerfile.resolveVariable(variable.getName(), variable.getNameRange().start.line);
                swaps.push(value);
                requiresExpansion = requiresExpansion || value !== undefined;
            }

            if (requiresExpansion) {
                let expanded = "";
                for (let j = 0; j < swaps.length; j++) {
                    const variableRange = variables[j].getRange();
                    const start = this.document.offsetAt(variableRange.start);
                    const end = this.document.offsetAt(variableRange.end);
                    if (swaps[j]) {
                        // replace variable with its resolved value
                        expanded += this.document.getText().substring(offset, start);
                        expanded += swaps[j];
                        offset = end;
                    } else {
                        expanded += this.document.getText().substring(offset, end);
                        offset = end;
                    }
                }

                args[i] = new Argument(expanded, args[i].getRawValue(), argRange);
            }
        }
        return args;
    }

    public getVariables(): Variable[] {
        const variables = [];
        const args = this.getArguments();
        for (const arg of args) {
            const parsedVariables = this.parseVariables(this.document.offsetAt(arg.getRange().start), arg.getRawValue());
            for (const parsedVariable of parsedVariables) {
                variables.push(parsedVariable);
            }
        }
        return variables;
    }

    private parseVariables(offset: number, arg: string): Variable[] {
        let variables = [];
        variableLoop: for (let i = 0; i < arg.length; i++) {
            switch (arg.charAt(i)) {
                case this.escapeChar:
                    if (arg.charAt(i + 1) === '$') {
                        i++;
                    }
                    break;
                case '$':
                    if (arg.charAt(i + 1) === '{') {
                        let escapedName = "";
                        let nameEnd = -1;
                        nameLoop: for (let j = i + 2; j < arg.length; j++) {
                            let char = arg.charAt(j);
                            switch (char) {
                                case this.escapeChar:
                                    for (let k = j + 1; k < arg.length; k++) {
                                        switch (arg.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                            case '\r':
                                                // ignore whitespace
                                                continue;
                                            case '\n':
                                                // escape this newline
                                                j = k;
                                                continue nameLoop;
                                        }
                                    }
                                    break;
                                case '}':
                                    if (nameEnd === -1) {
                                        nameEnd = j;
                                    }
                                    variables.push(new Variable(
                                        escapedName,
                                        Range.create(this.document.positionAt(offset + i + 2), this.document.positionAt(offset + nameEnd)),
                                        Range.create(this.document.positionAt(offset + i), this.document.positionAt(offset + j + 1))
                                    ));
                                    i = j;
                                    continue variableLoop;
                                case ':':
                                    if (nameEnd === -1) {
                                        nameEnd = j;
                                    }
                                    break;
                                default:
                                    if (nameEnd === -1) {
                                        escapedName += char;
                                    }
                                    break;
                            }
                        }
                        // no } found, not a valid variable, stop processing
                        break variableLoop;
                    } else if (Util.isWhitespace(arg.charAt(i + 1)) || i === arg.length - 1) {
                        // $ followed by whitespace or EOF, ignore this variable
                        continue;
                    } else {
                        let escapedName = "";
                        nameLoop: for (let j = i + 1; j < arg.length; j++) {
                            let char = arg.charAt(j);
                            switch (char) {
                                case '$':
                                case '\'':
                                case '"':
                                case ' ':
                                case '\t':
                                    variables.push(new Variable(
                                        escapedName,
                                        Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)),
                                        Range.create(this.document.positionAt(offset + i), this.document.positionAt(offset + j))
                                    ));
                                    i = j - 1;
                                    continue variableLoop;
                                case this.escapeChar:
                                    for (let k = j + 1; k < arg.length; k++) {
                                        switch (arg.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                            case '\r':
                                                // ignore whitespace
                                                continue;
                                            case '\n':
                                                // escape this newline
                                                j = k;
                                                continue nameLoop;
                                        }
                                    }
                                    // reached EOF after an escape character
                                    variables.push(new Variable(
                                        escapedName,
                                        Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)),
                                        Range.create(this.document.positionAt(offset + i), this.document.positionAt(offset + j))
                                    ));
                                    break variableLoop;
                            }
                            escapedName += char;
                        }
                        variables.push(new Variable(
                            escapedName,
                            Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + arg.length)),
                            Range.create(this.document.positionAt(offset + i), this.document.positionAt(offset + arg.length))
                        ));
                    }
                    break variableLoop;
            }
        }
        return variables;
    }
}
