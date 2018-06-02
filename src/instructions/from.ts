/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Instruction } from '../instruction';
import { Util } from '../util';

export class From extends Instruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    public getImage(): string | null {
        return this.getRangeContent(this.getImageRange());
    }

    /**
     * Returns the name of the image that will be used as the base image.
     * 
     * @return the base image's name, or null if unspecified
     */
    public getImageName(): string | null {
        return this.getRangeContent(this.getImageNameRange());
    }

    /**
     * Returns the range that covers the name of the image used by
     * this instruction.
     * 
     * @return the range of the name of this instruction's argument,
     *         or null if no image has been specified
     */
    public getImageNameRange(): Range | null {
        let range = this.getImageRange();
        if (range) {
            let tagRange = this.getImageTagRange();
            let digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);    
                }
            } else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
            }
            let content = this.getRangeContent(range);
            let portIndex = content.lastIndexOf(':');
            let startingSlashIndex = content.indexOf('/');
            // check if two slashes have been detected or if there is a port defined
            if (startingSlashIndex !== content.lastIndexOf('/') || portIndex !== -1) {
                // start the range after the registry's URI then
                let rangeStart = this.document.offsetAt(range.start);
                return Range.create(
                    this.document.positionAt(rangeStart + startingSlashIndex + 1),
                    range.end
                );
            }
            return range;
        }
        return null;
    }

    /**
     * Returns the range that covers the image argument of this
     * instruction. This includes the tag or digest of the image if
     * it has been specified by the instruction.
     * 
     * @return the range of the image argument, or null if no image
     *         has been specified
     */
    private getImageRange(): Range | null {
        let args = this.getArguments();
        return args.length !== 0 ? args[0].getRange() : null;
    }

    /**
     * Returns the range in the document that the tag of the base
     * image encompasses.
     * 
     * @return the base image's tag's range in the document, or null
     *         if no tag has been specified
     */
    public getImageTagRange(): Range | null {
        const range = this.getImageRange();
        if (range) {
            let content = this.getRangeContent(range);
            if (content.indexOf('@') === -1) {
                let index = content.lastIndexOf(':');
                let variables = this.getVariables();
                for (let i = 0; i < variables.length; i++) {
                    let position = this.document.positionAt(this.document.offsetAt(range.start) + index);
                    if (Util.isInsideRange(position, variables[i].getRange())) {
                        index = content.substring(0, index).lastIndexOf(':');
                        if (index === -1) {
                            return null;
                        }
                        i = -1;
                        continue;
                    }
                }
                // the colon might be for a private registry's port and not a tag
                if (index > content.indexOf('/')) {
                    return Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
                }
            }
        }
        return null;
    }

    /**
     * Returns the range in the document that the digest of the base
     * image encompasses.
     * 
     * @return the base image's digest's range in the document, or null
     *         if no digest has been specified
     */
    public getImageDigestRange(): Range | null {
        let range = this.getImageRange();
        if (range) {
            let content = this.getRangeContent(range);
            let index = content.lastIndexOf('@');
            if (index !== -1) {
                return Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
            }
        }
        return null;
    }

    public getBuildStage(): string | null {
        let range = this.getBuildStageRange();
        return range === null ? null : this.getRangeContent(range);
    }

    public getBuildStageRange(): Range | null {
        let args = this.getArguments();
        if (args.length === 3 && args[1].getValue().toUpperCase() === "AS") {
            return args[2].getRange();
        }
        return null;
    }
}
