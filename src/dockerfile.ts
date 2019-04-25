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
        if (this.initialInstructions.getComments().length > 0 || this.initialInstructions.getInstructions().length > 0) {
            if (Util.isInsideRange(position, this.initialInstructions.getRange())) {
                return this.initialInstructions;
            }
        }

        for (const buildStage of this.buildStages) {
            if (Util.isInsideRange(position, buildStage.getRange())) {
                return buildStage;
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
        if (image === null) {
            return undefined;
        }
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

    /**
     * Internally reorganize the comments in the Dockerfile and allocate
     * them to the relevant build stages that they belong to.
     */
    public organizeComments(): void {
        const comments = this.getComments();
        for (let i = 0; i < comments.length; i++) {
            if (Util.isInsideRange(comments[i].getRange().end, this.initialInstructions.getRange())) {
                this.initialInstructions.addComment(comments[i]);
            } else {
                for (const buildStage of this.buildStages) {
                    if (Util.isInsideRange(comments[i].getRange().start, buildStage.getRange())) {
                        buildStage.addComment(comments[i]);
                    }
                }
            }
        }
    }

    public getRange(): Range | null {
        const comments = this.getComments();
        const instructions = this.getInstructions();
        let range = null;
        if (comments.length === 0) {
            if (instructions.length > 0) {
                range = Range.create(instructions[0].getRange().start, instructions[instructions.length - 1].getRange().end);
            }
        } else if (instructions.length === 0) {
            range = Range.create(comments[0].getRange().start, comments[comments.length - 1].getRange().end);
        } else {
            const commentStart = comments[0].getRange().start;
            const commentEnd = comments[comments.length - 1].getRange().end;
            const instructionStart = instructions[0].getRange().start;
            const instructionEnd = instructions[instructions.length - 1].getRange().end;
    
            if (commentStart.line < instructionStart.line) {
                if (commentEnd.line < instructionEnd.line) {
                    range = Range.create(commentStart, instructionEnd);
                }
                range = Range.create(commentStart, commentEnd);
            } else if (commentEnd.line < instructionEnd.line) {
                range = Range.create(instructionStart, instructionEnd);
            } else {
                range = Range.create(instructionStart, commentEnd);
            }
        }

        if (range === null) {
            if (this.directive === null) {
                return null;
            }
            return this.directive.getRange();
        } else if (this.directive === null) {
            return range;
        }
        return Range.create(this.directive.getRange().start, range.end);
    }

}
