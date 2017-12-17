/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range, Position } from 'vscode-languageserver-types';
import { Dockerfile } from './dockerfile';
import { Argument } from './argument';
import { Flag } from './flag';
import { Instruction } from './instruction';

export abstract class ModifiableInstruction extends Instruction {

    private flags: Flag[];

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    protected abstract stopSearchingForFlags(value: string): boolean;

    public getFlags(): Flag[] {
        if (!this.flags) {
            this.flags = [];
            for (let arg of this.getArguments()) {
                let value = arg.getValue();
                if (this.stopSearchingForFlags(value)) {
                    return this.flags;
                } else if (value.indexOf("--") === 0) {
                    let rawValue = arg.getRawValue();
                    let range = arg.getRange();
                    let nameIndex = value.indexOf('=');
                    let index = rawValue.indexOf('=');

                    let firstMatch = false;
                    let secondMatch = false;
                    let startIndex = -1;
                    nameSearchLoop: for (let i = 0; i < rawValue.length; i++) {
                        switch (rawValue.charAt(i)) {
                            case '\\':
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                                break;
                            case '-':
                                if (firstMatch) {
                                    secondMatch = true;
                                } else {
                                    firstMatch = true;
                                }
                                break;
                            default:
                                startIndex = i;
                                break nameSearchLoop;
                        }
                    }

                    let nameStart = this.document.positionAt(this.document.offsetAt(range.start) + startIndex);
                    if (index === -1) {
                        this.flags.push(new Flag(
                            range,
                            value.substring(2),
                            Range.create(nameStart, range.end),
                            null,
                            null)
                        );
                    } else if (index === value.length - 1) {
                        let nameEnd = this.document.positionAt(this.document.offsetAt(range.start) + index);
                        this.flags.push(new Flag(
                            range,
                            value.substring(2, index),
                            Range.create(nameStart, nameEnd),
                            "",
                            Range.create(range.end, range.end))
                        );
                    } else {
                        let nameEnd = this.document.positionAt(this.document.offsetAt(range.start) + index);
                        this.flags.push(new Flag(
                            range,
                            value.substring(2, nameIndex),
                            Range.create(nameStart, nameEnd),
                            value.substring(nameIndex + 1),
                            Range.create(this.document.positionAt(this.document.offsetAt(range.start) + index + 1), range.end))
                        );
                    }
                }
            }
        }
        return this.flags;
    }

    public getArguments(): Argument[] {
        const args = super.getArguments();
        const flags = this.getFlags();
        if (flags.length === 0) {
            return args;
        }
        for (let i = 0; i < flags.length; i++) {
            args.shift();
        }
        return args;
    }
}
