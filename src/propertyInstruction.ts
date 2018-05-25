/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range } from 'vscode-languageserver-types';
import { Dockerfile } from './dockerfile';
import { Instruction } from './instruction';
import { Property } from './property';
import { Argument } from './argument';
import { Util } from './util';

export abstract class PropertyInstruction extends Instruction {

    private properties: Property[] | undefined = undefined;

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    public getProperties(): Property[] {
        if (this.properties === undefined) {
            let args = this.getPropertyArguments();
            if (args.length === 0) {
                this.properties = [];
            } else if (args.length === 1) {
                this.properties = [new Property(this.document, this.escapeChar, args[0])];
            } else if (args.length === 2) {
                if (args[0].getValue().indexOf('=') === -1) {
                    this.properties = [new Property(this.document, this.escapeChar, args[0], args[1])];
                } else {
                    this.properties = [
                        new Property(this.document, this.escapeChar, args[0]),
                        new Property(this.document, this.escapeChar, args[1])
                    ];
                }
            } else if (args[0].getValue().indexOf('=') === -1) {
                let text = this.document.getText();
                let start = args[1].getRange().start
                let end = args[args.length - 1].getRange().end;
                text = text.substring(this.document.offsetAt(start), this.document.offsetAt(end));
                this.properties = [new Property(this.document, this.escapeChar, args[0], new Argument(text, Range.create(args[1].getRange().start, args[args.length - 1].getRange().end)))];
            } else {
                this.properties = [];
                for (let i = 0; i < args.length; i++) {
                    this.properties.push(new Property(this.document, this.escapeChar, args[i]));
                }
            }
        }
        return this.properties;
    }

    /**
     * Goes from the back of the string and returns the first
     * non-whitespace character that is found. If an escape character
     * is found with newline characters, the escape character will
     * not be considered a non-whitespace character and its index in
     * the string will not be returned.
     * 
     * @param content the string to search through
     * @return the index in the string for the first non-whitespace
     *         character when searching from the end of the string
     */
    private findTrailingNonWhitespace(content: string): number {
        // loop back to find the first non-whitespace character
        let index = content.length;
        whitespaceCheck: for (let i = content.length - 1; i >= 0; i--) {
            switch (content.charAt(i)) {
                case ' ':
                case '\t':
                    continue;
                case '\n':
                    if (content.charAt(i - 1) === '\r') {
                        i = i - 1;
                    }
                case '\r':
                    newlineCheck: for (let j = i - 1; j >= 0; j--) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                            case this.escapeChar:
                                continue;
                            default:
                                index = j;
                                break newlineCheck;
                        }
                    }
                    break whitespaceCheck;
                default:
                    index = i;
                    break whitespaceCheck;
            }
        }
        return index;
    }

    public getPropertyArguments(): Argument[] {
        const args: Argument[] = [];
        let range = this.getInstructionRange();
        let instructionNameEndOffset = this.document.offsetAt(range.end);
        let extra = instructionNameEndOffset - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra);
        let start = Util.findLeadingNonWhitespace(fullArgs, this.escapeChar);

        if (start === -1) {
            // only whitespace found, no arguments
            return [];
        }

        // records whether the parser has just processed an escaped newline or not
        let escaped = false;
        // flag to track if the last character was an escape character
        let endingEscape = false;
        // position before the first escape character was hit
        let mark = -1;
        let end = this.findTrailingNonWhitespace(fullArgs);
        content = fullArgs.substring(start, end + 1);
        let argStart = 0;
        let spaced = false;
        argumentLoop: for (let i = 0; i < content.length; i++) {
            let char = content.charAt(i);
            switch (char) {
                case this.escapeChar:
                    if (i + 1 === content.length) {
                        endingEscape = true;
                        break argumentLoop;
                    }

                    if (!escaped) {
                        mark = i;
                    }

                    switch (content.charAt(i + 1)) {
                        case ' ':
                        case '\t':
                            if (!Util.isWhitespace(content.charAt(i + 2))) {
                                // space was escaped, continue as normal
                                i = i + 1;
                                continue argumentLoop;
                            }
                            // whitespace encountered, need to figure out if it extends to EOL
                            whitespaceCheck: for (let j = i + 2; j < content.length; j++) {
                                switch (content.charAt(j)) {
                                    case '\r':
                                        // offset one more for \r\n
                                        j++;
                                    case '\n':
                                        // whitespace only, safe to skip
                                        escaped = true;
                                        i = j;
                                        continue argumentLoop;
                                    case ' ':
                                    case '\t':
                                        // ignore whitespace
                                        break;
                                    default:
                                        // whitespace doesn't extend to EOL, create an argument
                                        args.push(new Argument(content.substring(argStart, i),
                                            Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + i + 2))
                                        ));
                                        argStart = j;
                                        break whitespaceCheck;
                                }
                            }
                            // go back and start processing the encountered non-whitespace character
                            i = argStart - 1;
                            continue argumentLoop;
                        case '\r':
                            // offset one more for \r\n
                            i++;
                        case '\n':
                            // immediately followed by a newline, skip the newline
                            escaped = true;
                            i = i + 1;
                            continue argumentLoop;
                        case this.escapeChar:
                            // double escape found, skip it and move on
                            if (argStart === -1) {
                                argStart = i;
                            }
                            i = i + 1;
                            continue argumentLoop;
                        default:
                            if (argStart === -1) {
                                argStart = i;
                            }
                            // non-whitespace encountered, skip the escape and process the
                            // character normally
                            continue argumentLoop;
                    }
                case '\'':
                case '"':
                    if (argStart === -1) {
                        argStart = i;
                    }
                    for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case char:
                                if (content.charAt(j + 1) !== ' ' && content.charAt(j + 1) !== '') {
                                    // there is more content after this quote,
                                    // continue so that it is all processed as
                                    // one single argument
                                    i = j;
                                    continue argumentLoop;
                                }
                                args.push(new Argument(content.substring(argStart, j + 1),
                                    Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + j + 1))
                                ));
                                i = j;
                                argStart = -1;
                                continue argumentLoop;
                            case this.escapeChar:
                                j++;
                                break;
                        }
                    }
                    break argumentLoop;
                case ' ':
                case '\t':
                    if (escaped) {
                        spaced = true;
                    } else if (argStart !== -1) {
                        args.push(new Argument(
                            content.substring(argStart, i),
                            Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart),
                                this.document.positionAt(instructionNameEndOffset + start + i))
                        ));
                        argStart = -1;
                    }
                    break;
                case '\r':
                    // offset one more for \r\n
                    i++;
                case '\n':
                    spaced = false;
                    break;
                case '#':
                    if (escaped) {
                        // a newline was escaped and now there's a comment
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    spaced = false;
                                    continue argumentLoop;
                            }
                        }
                        // went to the end without finding a newline,
                        // the comment was the last line in the instruction,
                        // just stop parsing
                        let value = content.substring(argStart, mark);
                        args.push(new Argument(
                            value,
                            Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart),
                                this.document.positionAt(instructionNameEndOffset + start + mark))
                        ));
                        argStart = -1;
                        break argumentLoop;
                    } else if (argStart === -1) {
                        argStart = i;
                    }
                    break;
                default:
                    if (spaced) {
                        if (argStart !== -1) {
                            args.push(new Argument(
                                content.substring(argStart, mark),
                                Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart),
                                    this.document.positionAt(instructionNameEndOffset + start + mark))
                            ));
                            argStart = -1;
                        }
                        spaced = false;
                    }
                    escaped = false;
                    if (argStart === -1) {
                        argStart = i;
                    }

                    // variable detected
                    if (char === '$' && content.charAt(i + 1) === '{') {
                        let singleQuotes = false;
                        let doubleQuotes = false;
                        let escaped = false;
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case this.escapeChar:
                                    escaped = true;
                                    break;
                                case '\r':
                                case '\n':
                                    break;
                                case '\'':
                                    singleQuotes = !singleQuotes;
                                    escaped = false;
                                    break;
                                case '"':
                                    doubleQuotes = !doubleQuotes;
                                    escaped = false;
                                    break;
                                case ' ':
                                case '\t':
                                    if (escaped || singleQuotes || doubleQuotes) {
                                        break;
                                    }
                                    i = j - 1;
                                    continue argumentLoop;
                                case '}':
                                    i = j;
                                    continue argumentLoop;
                                default:
                                    escaped = false;
                                    break;
                            }
                        }
                        break argumentLoop;
                    }
                    break;
            }
        }
        if (argStart !== -1 && argStart !== content.length) {
            let end = endingEscape ? content.length - 1 : content.length;
            let value = content.substring(argStart, end);
            args.push(new Argument(
                value,
                Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart),
                    this.document.positionAt(instructionNameEndOffset + start + end))
            ));
        }
        return args;
    }
}
