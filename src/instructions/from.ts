/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Instruction } from '../instruction';

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
            let content = this.getRangeContent(range);
            let trailingSlashIndex = content.lastIndexOf('/');
            let digestIndex = content.lastIndexOf('@');
            let colonIndex = content.lastIndexOf(':');
            if (trailingSlashIndex < colonIndex || trailingSlashIndex === -1) {
                let rangeStart = this.document.offsetAt(range.start);
                let start = rangeStart;
                if (colonIndex === -1 || (digestIndex !== -1 && digestIndex < colonIndex)) {
                    colonIndex = digestIndex;
                }
                // slash found
                if (trailingSlashIndex !== -1) {
                    let startingSlashIndex = content.indexOf('/');
                    // are there two slashes or a port, might be a private registry
                    if (startingSlashIndex !== trailingSlashIndex || content.substring(0, startingSlashIndex).indexOf(':') !== -1) {
                        // adjust the starting range if a private registry is specified
                        start = start + startingSlashIndex + 1;
                    }
                }
                if (colonIndex !== -1) {
                    return Range.create(
                        this.document.positionAt(start),
                        this.document.positionAt(rangeStart + colonIndex)
                    );
                }
                return range;
            }
            let rangeStart = this.document.offsetAt(range.start);
            // if digest found, use that as the end instead
            let rangeEnd = digestIndex === -1 ? range.end : this.document.positionAt(rangeStart + digestIndex);
            let startingSlashIndex = content.indexOf('/');
            // check if two slashes have been detected or if there is a port defined
            if (startingSlashIndex !== trailingSlashIndex || (colonIndex !== -1 && colonIndex < startingSlashIndex)) {
                return Range.create(
                    this.document.positionAt(rangeStart + startingSlashIndex + 1),
                    rangeEnd
                );
            }
            return Range.create(range.start, rangeEnd);
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
