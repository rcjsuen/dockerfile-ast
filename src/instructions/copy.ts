/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Flag } from '../flag';
import { Heredoc } from '../heredoc';
import { JSONInstruction } from '../jsonInstruction';

export class Copy extends JSONInstruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    public stopSearchingForFlags(argument: string): boolean {
        return argument.indexOf("--") === -1;
    }

    public getFromFlag(): Flag | null {
        let flags = super.getFlags();
        return flags.length === 1 && flags[0].getName() === "from" ? flags[0] : null;
    }

    /**
     * Returns there here-documents that are defined in this RUN
     * instruction.
     * 
     * This API is experimental and subject to change.
     */
    public getHeredocs(): Heredoc[] {
        return super.getHeredocs();
    }
}
