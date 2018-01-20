/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range } from 'vscode-languageserver-types';

export class Variable {

    private readonly name: string;
    private readonly nameRange: Range;
    private readonly range: Range;
    private readonly defined: boolean;

    constructor(name: string, nameRange: Range, range: Range, defined: boolean) {
        this.name = name;
        this.nameRange = nameRange;
        this.range = range;
        this.defined = defined;
    }

    public getName(): string {
        return this.name;
    }

    public getNameRange(): Range {
        return this.nameRange;
    }

    /**
     * Returns the range of the entire variable. This includes the symbols for
     * the declaration of the variable such as the $, {, and } symbols.
     * 
     * @return the range in the document that this variable encompasses in its
     *         entirety
     */
    public getRange(): Range {
        return this.range;
    }

    /**
     * Returns whether this variable has been defined or not.
     * 
     * @return true if this variable has been defined, false otherwise
     */
    public isDefined(): boolean {
        return this.defined;
    }
}
