/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { Range, Position } from 'vscode-languageserver-types';
import * as ast from './main';
import { Comment } from './comment';
import { Instruction } from './instruction';
import { Arg } from './instructions/arg';
import { Cmd } from './instructions/cmd';
import { Copy } from './instructions/copy';
import { Env } from './instructions/env';
import { Entrypoint } from './instructions/entrypoint';
import { From } from './instructions/from';
import { Healthcheck } from './instructions/healthcheck';
import { Onbuild } from './instructions/onbuild';
import { Util } from './util';

export class ImageTemplate implements ast.ImageTemplate {

    private readonly comments: Comment[] = [];
    private readonly instructions: Instruction[] = [];

    public addComment(comment: Comment): void {
        this.comments.push(comment);
    }

    public getComments(): Comment[] {
        return this.comments;
    }

    public addInstruction(instruction: Instruction): void {
        this.instructions.push(instruction);
    }

    public getInstructions(): Instruction[] {
        return this.instructions;
    }

    protected getInstructionAt(line: number): Instruction | null {
        for (let instruction of this.instructions) {
            if (Util.isInsideRange(Position.create(line, 0), instruction.getRange())) {
                return instruction;
            }
        }
        return null;
    }

    /**
     * Gets all the ARG instructions that are defined in this image.
     */
    public getARGs(): Arg[] {
        let args = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Arg) {
                args.push(instruction);
            }
        }
        return args;
    }

    /**
     * Gets all the CMD instructions that are defined in this image.
     */
    public getCMDs(): Cmd[] {
        let cmds = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Cmd) {
                cmds.push(instruction);
            }
        }
        return cmds;
    }

    /**
     * Gets all the COPY instructions that are defined in this image.
     */
    public getCOPYs(): Copy[] {
        let copies = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Copy) {
                copies.push(instruction);
            }
        }
        return copies;
    }

    /**
     * Gets all the ENTRYPOINT instructions that are defined in this image.
     */
    public getENTRYPOINTs(): Entrypoint[] {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Entrypoint) {
                froms.push(instruction);
            }
        }
        return froms;
    }

    /**
     * Gets all the ENV instructions that are defined in this image.
     */
    public getENVs(): Env[] {
        let args = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Env) {
                args.push(instruction);
            }
        }
        return args;
    }

    /**
     * Gets all the FROM instructions that are defined in this image.
     */
    public getFROMs(): From[] {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof From) {
                froms.push(instruction);
            }
        }
        return froms;
    }

    /**
     * Gets all the HEALTHCHECK instructions that are defined in this image.
     */
    public getHEALTHCHECKs(): Healthcheck[] {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Healthcheck) {
                froms.push(instruction);
            }
        }
        return froms;
    }

    public getOnbuildTriggers(): Instruction[] {
        let triggers = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof Onbuild) {
                let trigger = instruction.getTriggerInstruction();
                if (trigger) {
                    triggers.push(trigger);
                }
            }
        }
        return triggers;
    }

    public getAvailableVariables(currentLine: number): string[] {
        const variables = [];
        for (const arg of this.getARGs()) {
            if (arg.isBefore(currentLine)) {
                const property = arg.getProperty();
                if (property) {
                    const variable = property.getName();
                    if (variables.indexOf(variable) === -1) {
                        variables.push(variable);
                    }
                }
            }
        }

        for (const env of this.getENVs()) {
            if (env.isBefore(currentLine)) {
                for (const property of env.getProperties()) {
                    const variable = property.getName();
                    if (variables.indexOf(variable) === -1) {
                        variables.push(variable);
                    }
                }
            }
        }
        return variables;
    }

    /**
     * Resolves a variable with the given name at the specified line
     * to its value. If null is returned, then the variable has been
     * defined but no value was given. If undefined is returned, then
     * a variable with the given name has not been defined yet as of
     * the given line.
     * 
     * @param variable the name of the variable to resolve
     * @param line the line number that the variable is on, zero-based
     * @return the value of the variable as defined by an ARG or ENV
     *         instruction, or null if no value has been specified, or
     *         undefined if a variable with the given name has not
     *         been defined
     */
    public resolveVariable(variable: string, line: number): string | null | undefined {
        let envs = this.getENVs();
        for (let i = envs.length - 1; i >= 0; i--) {
            if (envs[i].isBefore(line)) {
                for (let property of envs[i].getProperties()) {
                    if (property.getName() === variable) {
                        return property.getValue();
                    }
                }
            }
        }

        let args = this.getARGs();
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].isBefore(line)) {
                let property = args[i].getProperty();
                if (property && property.getName() === variable) {
                    return property.getValue();
                }
            }
        }
        return undefined;
    }

    public getRange(): Range | null {
        const instructions = this.getInstructions();
        if (instructions.length === 0) {
            // all templates should have instructions, this only happens for
            // the initial set of instruction
            return Range.create(0, 0, 0, 0);
        }
        const instructionStart = instructions[0].getRange().start;
        const instructionEnd = instructions[instructions.length - 1].getRange().end;
        return Range.create(instructionStart, instructionEnd);
    }

    public contains(position: Position): boolean {
        const range = this.getRange();
        if (range === null) {
            return false;
        }
        return Util.isInsideRange(position, range);
    }

}
