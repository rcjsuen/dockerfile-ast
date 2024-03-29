/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range } from 'vscode-languageserver-types';
import { Dockerfile } from './dockerfile';
import { Argument } from './argument';
import { JSONArgument } from './jsonArgument';
import { ModifiableInstruction } from './modifiableInstruction';

export class JSONInstruction extends ModifiableInstruction {

    private readonly openingBracket: Argument | null = null;
    private readonly closingBracket: Argument | null = null;
    private readonly jsonStrings: JSONArgument[] = [];

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);

        const argsContent = this.getRawArgumentsContent();
        if (argsContent === null) {
            return;
        }

        const args = this.getArguments();
        if (args.length === 1 && args[0].getValue() === "[]") {
            let argRange = args[0].getRange();
            this.openingBracket = new Argument("[", Range.create(argRange.start.line, argRange.start.character, argRange.start.line, argRange.start.character + 1));
            this.closingBracket = new Argument("]", Range.create(argRange.start.line, argRange.start.character + 1, argRange.end.line, argRange.end.character));
            return;
        } else if (args.length === 2 && args[0].getValue() === '[' && args[1].getValue() === ']') {
            this.openingBracket = args[0];
            this.closingBracket = args[1];
            return;
        }

        const argsOffset = document.offsetAt(this.getArgumentsRange().start);
        let start = -1;
        let last = "";
        let quoted = false;
        let escapedArg = "";
        argsCheck: for (let i = 0; i < argsContent.length; i++) {
            let char = argsContent.charAt(i);
            switch (char) {
                case '[':
                    if (last === "") {
                        this.openingBracket = new Argument(
                            "[", Range.create(document.positionAt(argsOffset + i), document.positionAt(argsOffset + i + 1))
                        );
                        last = '[';
                    } else if (quoted) {
                        escapedArg = escapedArg + char;
                    } else {
                        break argsCheck;
                    }
                    break;
                case '"':
                    if (last === '[' || last === ',') {
                        start = i;
                        quoted = true;
                        last = '"';
                        escapedArg = escapedArg + char;
                        continue;
                    } else if (last === '"') {
                        if (quoted) {
                            escapedArg = escapedArg + char;
                            // quoted string done
                            quoted = false;
                            this.jsonStrings.push(new JSONArgument(
                                escapedArg,
                                Range.create(document.positionAt(argsOffset + start), document.positionAt(argsOffset + i + 1)),
                                Range.create(document.positionAt(argsOffset + start + 1), document.positionAt(argsOffset + i))
                            ));
                            escapedArg = "";
                        } else {
                            // should be a , or a ]
                            break argsCheck;
                        }
                    } else {
                        break argsCheck;
                    }
                    break;
                case ',':
                    if (quoted) {
                        escapedArg = escapedArg + char;
                    } else {
                        if (last === '"') {
                            last = ','
                        } else {
                            break argsCheck;
                        }
                    }
                    break;
                case ']':
                    if (quoted) {
                        escapedArg = escapedArg + char;
                    } else if (last !== "") {
                        this.closingBracket = new Argument(
                            "]", Range.create(document.positionAt(argsOffset + i), document.positionAt(argsOffset + i + 1))
                        );
                        break argsCheck;
                    }
                    break;
                case ' ':
                case '\t':
                    break;
                case '\\':
                    if (quoted) {
                        switch (argsContent.charAt(i + 1)) {
                            case '"':
                            case '\\':
                                escapedArg = escapedArg + argsContent.charAt(i + 1);
                                i++;
                                continue;
                            case ' ':
                            case '\t':
                                escapeCheck: for (let j = i + 2; j < argsContent.length; j++) {
                                    switch (argsContent.charAt(j)) {
                                        case '\r':
                                            // offset one more for \r\n
                                            j++;
                                        case '\n':
                                            i = j;
                                            continue argsCheck;
                                        case ' ':
                                        case '\t':
                                            break;
                                        default:
                                            break escapeCheck;
                                    }
                                }
                                break;
                            case '\r':
                                // offset one more for \r\n
                                i++;
                            default:
                                i++;
                                continue;
                        }
                    } else {
                        escapeCheck: for (let j = i + 1; j < argsContent.length; j++) {
                            switch (argsContent.charAt(j)) {
                                case '\r':
                                    // offset one more for \r\n
                                    j++;
                                case '\n':
                                    i = j;
                                    continue argsCheck;
                                case ' ':
                                case '\t':
                                    break;
                                default:
                                    break escapeCheck;
                            }
                        }
                    }
                    break argsCheck;
                default:
                    if (!quoted) {
                        break argsCheck;
                    }
                    escapedArg = escapedArg + char;
                    break;
            }
        }
    }

    protected stopSearchingForFlags(_value: string): boolean {
        return true;
    }

    public getOpeningBracket(): Argument | null {
        return this.openingBracket;
    }

    public getJSONStrings(): JSONArgument[] {
        return this.jsonStrings;
    }

    public getClosingBracket(): Argument | null {
        return this.closingBracket;
    }
}
