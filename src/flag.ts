/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range } from 'vscode-languageserver-types';

export class Flag {

    private readonly range: Range;
    private readonly name: string;
    private readonly nameRange: Range;
    private readonly value: string;
    private readonly valueRange: Range;

    constructor(range: Range, name: string, nameRange: Range, value: string, valueRange: Range) {
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;
    }

    public toString(): string {
        if (this.valueRange) {
            return "--" + this.name + "=" + this.value;
        }
        return "--" + this.name;
    }

    /**
     * Returns the range that encompasses this entire flag. This includes the
     * -- prefix in the beginning to the last character of the flag's value (if
     * it has been defined).
     * 
     * @return the entire range of this flag
     */
    public getRange(): Range {
        return this.range;
    }

    /**
     * Returns the name of this flag. The name does not include the -- prefix.
     * Thus, for HEALTHCHECK's --interval flag, interval is the flag's name and
     * not --interval.
     * 
     * @return this flag's name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Returns the range that encompasses the flag's name
     * 
     * @return the range containing the flag's name
     */
    public getNameRange(): Range {
        return this.nameRange;
    }

    /**
     * Returns the value that has been set to this flag. May be null if the
     * flag is invalid and has no value set like a --start-period. If the flag
     * is instead a --start-period= with an equals sign then the flag's value
     * is the empty string.
     * 
     * @return this flag's value if it has been defined, null otherwise
     */
    public getValue(): string | null {
        return this.value;
    }

    /**
     * Returns the range that encompasses this flag's value. If no value has
     * been set then null will be returned.
     * 
     * @return the range containing this flag's value, or null if the flag
     *         has no value defined
     */
    public getValueRange(): Range | null {
        return this.valueRange;
    }
}
