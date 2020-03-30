/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range } from 'vscode-languageserver-types';

export class FlagOption {

    private readonly range: Range;
    private readonly name: string;
    private readonly nameRange: Range;
    private readonly value: string | null;
    private readonly valueRange: Range | null;

    constructor(range: Range, name: string, nameRange: Range, value: string | null, valueRange: Range | null) {
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;
    }

    public toString(): string {
        if (this.valueRange !== null) {
            return this.name + "=" + this.value;
        }
        return this.name;
    }

    public getRange(): Range {
        return this.range;
    }

    public getName(): string {
        return this.name;
    }

    public getNameRange(): Range {
        return this.nameRange;
    }

    public getValue(): string | null {
        return this.value;
    }

    public getValueRange(): Range | null {
        return this.valueRange;
    }
}
