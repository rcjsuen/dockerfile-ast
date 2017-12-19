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

    public getContainingImage(position: Position): ImageTemplate {
        for (let buildStage of this.buildStages) {
            if (buildStage.contains(position)) {
                return buildStage;
            }
        }

        if (this.initialInstructions.contains(position)) {
            return this.initialInstructions;
        }

        let range = Range.create(Position.create(0, 0), this.document.positionAt(this.document.getText().length));
        return Util.isInsideRange(position, range) ? this : null;
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

}
