/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range } from 'vscode-languageserver-types';
import { Argument } from './argument';

export class JSONArgument extends Argument {

    private readonly jsonRange: Range;

    constructor(value: string, range: Range, jsonRange: Range) {
        super(value, range);
        this.jsonRange = jsonRange;
    }

    public getJSONRange(): Range {
        return this.jsonRange;
    }

    public getJSONValue(): string {
        let value = super.getValue();
        value = value.substring(1, value.length - 1);
        return value;
    }
}
