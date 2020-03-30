/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range, TextDocument } from 'vscode-languageserver-types';
import { FlagOption } from './flagOption';

export class Flag {

    private readonly range: Range;
    private readonly name: string;
    private readonly nameRange: Range;
    private readonly value: string;
    private readonly valueRange: Range;
    private readonly options: FlagOption[] = [];

    constructor(document: TextDocument, range: Range, name: string, nameRange: Range, value: string | null, valueRange: Range | null) {
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;

        if (this.value !== null) {
            let offset = document.offsetAt(valueRange.start);
            let nameStart = 0;
            let valueStart = -1;
            for (let i = 0; i < value.length; i++) {
                switch (value.charAt(i)) {
                    case '=':
                        if (valueStart === -1) {
                            valueStart = i + 1;
                            break;
                        }
                        break;
                    case ',':
                        this.options.push(
                            this.createFlagOption(
                                document, value, offset, nameStart, valueStart, i
                            )
                        );
                        nameStart = i + 1;
                        valueStart = -1;
                        break;
                }
            }

            if (valueStart !== -1) {
                this.options.push(
                    this.createFlagOption(
                        document, value, offset, nameStart, valueStart, value.length
                    )
                );
            }
        }
    }

    private createFlagOption(document: TextDocument, content: string, documentOffset: number, nameStart: number, valueStart: number, valueEnd: number): FlagOption {
        return new FlagOption(
            Range.create(document.positionAt(documentOffset + nameStart), document.positionAt(documentOffset + valueEnd)),
            content.substring(nameStart, valueStart - 1),
            Range.create(document.positionAt(documentOffset + nameStart), document.positionAt(documentOffset + valueStart - 1)),
            content.substring(valueStart, valueEnd),
            Range.create(document.positionAt(documentOffset + valueStart), document.positionAt(documentOffset + valueEnd))
        );
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

    public getOption(name: string): FlagOption | null {
        for (const option of this.options) {
            if (option.getName() === name) {
                return option;
            }
        }
        return null;
    }

    public getOptions(): FlagOption[] {
        return this.options;
    }

    public hasOptions(): boolean {
        return this.options.length > 0;
    }
}
