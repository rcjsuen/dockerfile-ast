/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position, Range } from 'vscode-languageserver-types';
import { Argument } from '../argument';
import { Dockerfile } from '../dockerfile';
import { Heredoc } from '../heredoc';
import { JSONInstruction } from '../jsonInstruction';

export class Run extends JSONInstruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    public stopSearchingForFlags(argument: string): boolean {
        return argument.indexOf("--") === -1;
    }

    private createSingleLineHeredocs(args: Argument[]): Heredoc[] {
        const heredocs = [];
        // instruction only on one line, if heredocs exist they would be incomplete
        for (const arg of args) {
            const value = arg.getValue();
            if (value.startsWith("<<")) {
                const startRange = arg.getRange();
                const nameRange = this.getNameRange(startRange);
                const name = this.getName(nameRange);
                heredocs.push(new Heredoc(startRange, name, nameRange, null, null));
            }
        }
        return heredocs;
    }

    private getName(nameRange: Range): string {
        const content = this.document.getText(nameRange);
        let escaping = false;
        let name = "";
        nameLoop: for (let i = 0; i < content.length; i++) {
            const ch = content.charAt(i);
            switch (ch) {
                case this.escapeChar:
                    escaping = true;
                    for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                                break;
                            case '\r':
                                i = j + 1;
                                continue nameLoop;
                            case '\n':
                                i = j;
                                continue nameLoop;
                            default:
                                name += content.charAt(j);
                                i = j;
                                continue nameLoop;
                        }
                    }
                    break;
                case '#':
                    if (escaping) {
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case '\n':
                                    i = j;
                                    continue nameLoop;
                            }
                        }
                    }
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    if (escaping) {
                        break;
                    }
                default:
                    name += ch;
                    break;
            }
        }
        return name;
    }

    private getNameRange(startRange: Range): Range {
        const content = this.document.getText(startRange);
        let endFound = false;
        let searchHyphen = false;
        let start = -1;
        let end = -1;
        let escaping = false;
        let quote = null;
        contentLoop: for (let i = 0; i < content.length; i++) {
            const ch = content.charAt(i);
            switch (ch) {
                case '"':
                case '\'':
                    if (quote === ch) {
                        break contentLoop;
                    }
                    quote = ch;
                    continue;
                case this.escapeChar:
                    for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case '\n':
                                escaping = true;
                                j = i;
                                continue contentLoop;
                        }
                    }
                    break;
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    break;
                case '<':
                    if (endFound) {
                        searchHyphen = true;
                    } else {
                        endFound = true;
                    }
                    break;
                case '-':
                    if (searchHyphen) {
                        searchHyphen = false;
                        break;
                    }
                case '#':
                    if (escaping) {
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case '\n':
                                    i = j;
                                    continue contentLoop;
                            }
                        }
                    }
                default:
                    if (start === -1) {
                        start = i;
                    }
                    if (quote !== null) {
                        end = i + 1;
                        break;
                    }
                    break contentLoop;
            }
        }
        if (start === -1) {
            return Range.create(startRange.end, startRange.end);
        }
        const nameStart = this.document.positionAt(this.document.offsetAt(startRange.start) + start);
        const nameEnd = quote !== null ? this.document.positionAt(this.document.offsetAt(startRange.start) + end) : startRange.end;
        return Range.create(nameStart, nameEnd);
    }

    /**
     * Returns there here-documents that are defined in this RUN
     * instruction.
     * 
     * This API is experimental and subject to change.
     */
    public getHeredocs(): Heredoc[] {
        const args = this.getArguments();
        if (args.length === 0) {
            return [];
        }
        const heredocs = [];
        const range = this.getRange();
        if (range.start.line === range.end.line) {
            // instruction only on one line, if heredocs exist they would be incomplete
            return this.createSingleLineHeredocs(args);
        }
        const heredocDefinitions = [];
        let heredocsProcessed = false;
        let escaping = false;
        let contentStart = -1;
        let contentEnd = -1;
        let lineStart = -1;
        let currentHeredoc = 0;
        const startOffset = this.document.offsetAt(args[0].getRange().start);
        const content = this.getRangeContent(Range.create(args[0].getRange().start, this.getRange().end));
        contentLoop: for (let i = 0; i < content.length; i++) {
            switch (content.charAt(i)) {
                case this.escapeChar:
                    escaping = true;
                    for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                                break;
                            case '\r':
                                j++;
                            case '\n':
                                i = j;
                                continue contentLoop;
                            default:
                                i = j;
                                continue contentLoop;
                        }
                    }
                    break;
                case '\r':
                    break;
                case '\n':
                    if (escaping) {
                        break;
                    }
                    if (heredocsProcessed) {
                        contentEnd = i;
                        const arg = heredocDefinitions[currentHeredoc];
                        const startRange = arg.getRange();
                        const nameRange = this.getNameRange(startRange);
                        const name = this.getName(nameRange);
                        const delimiterRange = this.getDelimiterRange(arg, name, Range.create(this.document.positionAt(startOffset + lineStart), this.document.positionAt(startOffset + i)));
                        if (delimiterRange !== null) {
                            const contentRange = Range.create(this.document.positionAt(startOffset + contentStart), this.document.positionAt(startOffset + lineStart - 1));
                            heredocs.push(new Heredoc(startRange, name, nameRange, contentRange, delimiterRange));
                            contentStart = -1;
                            currentHeredoc++;
                        }
                        lineStart = -1;
                    } else {
                        // found a newline that hasn't been escaped,
                        // must be in a heredoc
                        const offsetLimit = startOffset + i;
                        for (const arg of args) {
                            // check if this argument is on the initial line of the instruction,
                            // note that it may not all be on the same line due to escaped newlines,
                            // because of that we need to use offset checks instead of line checks
                            // as an argument being on a different line in the document does not
                            // imply it is on a different line from the Dockerfile's point of view
                            if (this.document.offsetAt(arg.getRange().start) < offsetLimit) {
                                if (arg.getValue().startsWith("<<")) {
                                    heredocDefinitions.push(arg);
                                }
                            } else {
                                heredocsProcessed = true;
                                lineStart = -1;
                                continue contentLoop;
                            }
                        }
                    }
                    break;
                case ' ':
                case '\t':
                    if (escaping) {
                        break;
                    }
                case '#':
                    if (escaping) {
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case '\n':
                                    i = j;
                                    continue contentLoop;
                            }
                        }
                    }
                default:
                    if (escaping) {
                        escaping = false;
                    }
                    if (heredocsProcessed) {
                        if (contentStart === -1) {
                            contentStart = i;
                        }
                        if (lineStart === -1) {
                            lineStart = i;
                        }
                    }
                    break;
            }
        }

        if (heredocsProcessed) {
            const arg = heredocDefinitions[currentHeredoc];
            const startRange = arg.getRange();
            const nameRange = this.getNameRange(startRange);
            const name = this.getName(nameRange);
            let contentRange = null;
            // check if the last line of this instruction matches the name of the last heredoc
            const delimiterRange = this.getDelimiterRange(arg, name, Range.create(this.document.positionAt(startOffset + lineStart), range.end));
            if (delimiterRange === null) {
                contentRange = Range.create(this.document.positionAt(startOffset + lineStart), range.end);
            } else if (contentEnd !== -1) {
                contentRange = Range.create(this.document.positionAt(startOffset + contentStart), this.document.positionAt(startOffset + contentEnd));
            }
            heredocs.push(new Heredoc(startRange, name, nameRange, contentRange, delimiterRange));
            currentHeredoc++;
            for (let i = currentHeredoc; i < heredocDefinitions.length; i++) {
                const arg = heredocDefinitions[currentHeredoc];
                const startRange = arg.getRange();
                const nameRange = this.getNameRange(startRange);
                const name = this.getName(nameRange);
                heredocs.push(new Heredoc(startRange, name, nameRange, null, null));
                currentHeredoc++;
            }
        } else {
            // instruction only on one line, if heredocs exist they would be incomplete
            return this.createSingleLineHeredocs(args);
        }
        return heredocs;
    }

    private getDelimiterRange(startArg: Argument, name: string, candidateRange: Range): Range {
        const text = this.document.getText(candidateRange);
        if (startArg.getValue().startsWith("<<-")) {
            // remove tabs in the front
            let index = 0;
            while (text.charAt(index) === '\t') {
                index++;
            }
            if (text.substring(index) === name) {
                return Range.create(Position.create(candidateRange.start.line, index), candidateRange.end);
            }
            return null;
        }
        return text === name ? candidateRange : null;
    }
}
