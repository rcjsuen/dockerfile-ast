/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range } from 'vscode-languageserver-types';

export class Variable {

    private readonly name: string;
    private readonly nameRange: Range;
    private readonly range: Range;
    private readonly modifier: string;
    private readonly substitutionValue: string;
    private readonly defined: boolean;
    private readonly buildVariable: boolean;
    private readonly stringValue: string;

    constructor(name: string, nameRange: Range, range: Range, modifier: string, substitutionValue: string, defined: boolean, buildVariable: boolean, stringValue: string) {
        this.name = name;
        this.nameRange = nameRange;
        this.range = range;
        this.modifier = modifier;
        this.substitutionValue = substitutionValue;
        this.defined = defined;
        this.buildVariable = buildVariable;
        this.stringValue = stringValue;
    }

    public toString(): string {
        return this.stringValue;
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
     * Returns the modifier character that has been set for
     * specifying how this variable should be expanded and resolved.
     * If this variable is ${variable:+value} then the modifier
     * character is '+'. Will be the empty string if the variable is
     * declared as ${variable:}. Otherwise, will be null if this
     * variable will not use variable substitution at all (such as
     * ${variable} or $variable).
     * 
     * @return this variable's modifier character, or the empty
     *         string if it does not have one, or null if this
     *         variable will not use variable substitution
     */
    public getModifier(): string {
        return this.modifier;
    }

    /**
     * Returns the value that will be used for substitution if this
     * variable uses modifiers to define how its value should be
     * resolved. If this variable is ${variable:+value} then the
     * substitution value will be 'value'. May be null if this
     * variable does not have a substition value defined (such as
     * ${variable} or $variable).
     * 
     * @return this variable's substitution value, or null if there
     *         is not one defined
     */
    public getSubstitutionValue(): string | null {
        return this.substitutionValue;
    }

    /**
     * Returns whether this variable has been defined or not.
     * 
     * @return true if this variable has been defined, false otherwise
     */
    public isDefined(): boolean {
        return this.buildVariable !== undefined;
    }

    public isBuildVariable(): boolean {
        return this.buildVariable === true;
    }

    public isEnvironmentVariable(): boolean {
        return this.buildVariable === false;
    }
}
