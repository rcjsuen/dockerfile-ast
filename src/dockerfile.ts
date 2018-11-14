/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { TextDocument, Range, Position } from 'vscode-languageserver-types';
import * as ast from './main';
import { ParserDirective } from './parserDirective';
import { ImageTemplate } from './imageTemplate';
import { Instruction } from './instruction';
import { Arg } from './instructions/arg';
import { From } from './instructions/from';
import { Util } from './util';
import { Directive, Keyword } from './main';

export class Dockerfile extends ImageTemplate implements ast.Dockerfile {

    private readonly document: TextDocument;
    private readonly initialInstructions = new ImageTemplate();
    private readonly buildStages: ImageTemplate[] = [];
    private currentBuildStage: ImageTemplate;
    private directive: ParserDirective | null = null;

    /**
     * Whether a FROM instruction has been added to this Dockerfile or not.
     */
    private foundFrom = false;

    constructor(document: TextDocument) {
        super();
        this.document = document;
    }

    public getEscapeCharacter(): string {
        if (this.directive !== null && this.directive.getDirective() === Directive.escape) {
            let value = this.directive.getValue();
            if (value === '\\' || value === '`') {
                return value;
            }
        }
        return '\\';
    }

    public getInitialARGs(): Arg[] {
        return this.initialInstructions.getARGs();
    }

    public getContainingImage(position: Position): ImageTemplate | null {
        let range = Range.create(Position.create(0, 0), this.document.positionAt(this.document.getText().length));
        if (!Util.isInsideRange(position, range)) {
            // not inside the document, invalid position
            return null;
        }

        for (let buildStage of this.buildStages) {
            if (buildStage.contains(position)) {
                return buildStage;
            }
        }

        let instructions = this.initialInstructions.getInstructions();
        if (instructions.length > 0 && 
                (this.initialInstructions.contains(position) || instructions[instructions.length - 1].getRange().end.line >= position.line)) {
            return this.initialInstructions;
        }

        if (this.buildStages.length > 0) {
            if (this.buildStages[0].getInstructions()[0].getRange().start.line > position.line) {
                let instructions = this.initialInstructions.getInstructions();
                if (instructions.length > 0) {
                    return this.buildStages[0];
                }
            }

            let instructions = this.buildStages[this.buildStages.length - 1].getInstructions();
            if (instructions[instructions.length - 1].getRange().end.line < position.line) {
                return this;
            }

            for (let i = 0; i < this.buildStages.length - 1; i++) {
                let stageInstructions = this.buildStages[i].getInstructions();
                let stageInstructions2 = this.buildStages[i + 1].getInstructions();
                let between = Range.create(
                    stageInstructions[stageInstructions.length - 1].getRange().end,
                    stageInstructions2[0].getRange().start
                );

                if (Util.isInsideRange(position, between)) {
                    return this.buildStages[i + 1];
                }
            }
        }

        return this;
    }

    public addInstruction(instruction: Instruction): void {
        if (instruction.getKeyword() === Keyword.FROM) {
            this.currentBuildStage = new ImageTemplate();
            this.buildStages.push(this.currentBuildStage);
            this.foundFrom = true;
        } else if (!this.foundFrom) {
            this.initialInstructions.addInstruction(instruction);
        }

        if (this.foundFrom) {
            this.currentBuildStage.addInstruction(instruction);
        }
        super.addInstruction(instruction);
    }

    public setDirective(directive: ParserDirective): void {
        this.directive = directive;
    }

    public getDirective(): ParserDirective | null {
        return this.directive;
    }

    public resolveVariable(variable: string, line: number): string | null | undefined {
        for (let from of this.getFROMs()) {
            let range = from.getRange();
            if (range.start.line <= line && line <= range.end.line) {
                // resolve the FROM variable against the initial ARGs
                let initialARGs = new ImageTemplate();
                for (let instruction of this.initialInstructions.getARGs()) {
                    initialARGs.addInstruction(instruction);
                }
                return initialARGs.resolveVariable(variable, line);
            }
        }
        let image = this.getContainingImage(Position.create(line, 0));
        let resolvedVariable = image.resolveVariable(variable, line);
        if (resolvedVariable === null) {
            // refers to an uninitialized ARG variable,
            // try resolving it against the initial ARGs then
            let initialARGs = new ImageTemplate();
            for (let instruction of this.initialInstructions.getARGs()) {
                initialARGs.addInstruction(instruction);
            }
            return initialARGs.resolveVariable(variable, line);
        }
        return resolvedVariable;
    }

    public getAvailableVariables(currentLine: number): string[] {
        if (this.getInstructionAt(currentLine) instanceof From) {
            let variables = [];
            for (let arg of this.getInitialARGs()) {
                let property = arg.getProperty();
                if (property) {
                    variables.push(property.getName());
                }
            }
            return variables;
        }

        let image = this.getContainingImage(Position.create(currentLine, 0));
        return image ? image.getAvailableVariables(currentLine) : [];
    }

}
