/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range } from 'vscode-languageserver-types';
import { Directive } from './main';
import { Line } from './line';

export class ParserDirective extends Line {

    private readonly nameRange: Range;

    private readonly valueRange: Range;

    constructor(document: TextDocument, range: Range, nameRange: Range, valueRange: Range) {
        super(document, range);
        this.nameRange = nameRange;
        this.valueRange = valueRange;
    }

    public toString(): string {
        return "# " + this.getName() + '=' + this.getValue();
    }

    public getNameRange(): Range {
        return this.nameRange;
    }

    public getValueRange(): Range {
        return this.valueRange;
    }

    public getName(): string {
        return this.document.getText().substring(this.document.offsetAt(this.nameRange.start), this.document.offsetAt(this.nameRange.end));
    }

    public getValue(): string {
        return this.document.getText().substring(this.document.offsetAt(this.valueRange.start), this.document.offsetAt(this.valueRange.end));
    }

    public getDirective(): Directive | null {
        const directive = Directive[this.getName().toLowerCase()];
        return directive === undefined ? null : directive;
    }
}
