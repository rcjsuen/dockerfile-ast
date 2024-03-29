/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Instruction } from '../instruction';

export class Workdir extends Instruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    /**
     * Returns the path that has been defined. Note that this path may
     * be absolute or relative depending on what was written in the
     * instruction.
     * 
     * @return the working directory's path, or null if this
     *         instruction has no arguments
     */
    public getPath(): string | null {
        return this.getArgumentsContent();
    }

    /**
     * Returns the absolute path that this instruction resolves to. The
     * function will inspect prior WORKDIR instructions in the current
     * image or another build stage in the Dockerfile to try to
     * determine this.
     * 
     * @return the absolute path of the working directory, or null if
     *         this instruction has no arguments, or undefined if it
     *         cannot be determined because only relative paths could be
     *         found
     */
    public getAbsolutePath(): string | null | undefined {
        const path = this.getPath();
        if (path === null || path.startsWith("/")) {
            return path;
        }

        const startLine = this.getRange().start.line;
        const hierarchy = this.dockerfile.getStageHierarchy(startLine);
        for (let i = hierarchy.length - 1; i >= 0; i--) {
            const workdirs = hierarchy[i].getWORKDIRs();
            for (let j = workdirs.length - 1; j >= 0; j--) {
                if (workdirs[j].getRange().start.line < startLine) {
                    const parent = workdirs[j].getAbsolutePath();
                    if (parent === undefined || parent === null) {
                        return undefined;
                    }
                    return parent.endsWith("/") ? parent + path : parent + "/" + path;
                }
            }
        }
        return undefined;
    }
}
