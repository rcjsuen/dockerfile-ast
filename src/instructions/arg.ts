/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Property } from '../property';
import { PropertyInstruction } from '../propertyInstruction';

export class Arg extends PropertyInstruction {

    private property: Property | null = null;

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        const args = this.getPropertyArguments();
        if (args.length === 1) {
            this.property = new Property(this.document, this.escapeChar, args[0]);
        } else {
            this.property = null;
        }
    }

    /**
     * Returns the variable defined by this ARG. This may be null if
     * this ARG instruction is malformed and has no variable
     * declaration.
     */
    public getProperty(): Property | null {
        return this.property;
    }
}
