/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range, TextDocument } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { JSONInstruction } from '../jsonInstruction';

export class Run extends JSONInstruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    public stopSearchingForFlags(argument: string): boolean {
        return argument.indexOf("--") === -1;
    }
}
