/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Flag } from '../flag';
import { ModifiableInstruction } from '../modifiableInstruction';

export class From extends ModifiableInstruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    protected stopSearchingForFlags(argument: string): boolean {
        return argument.indexOf("--") === -1;
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
            let registryRange = this.getRegistryRange();
            if (registryRange) {
                range.start = this.document.positionAt(this.document.offsetAt(registryRange.end) + 1);
            }
            let tagRange = this.getImageTagRange();
            let digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);    
                }
            } else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
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
    public getImageRange(): Range | null {
        let args = this.getArguments();
        return args.length !== 0 ? args[0].getRange() : null;
    }

    public getImageTag(): string | null {
        return this.getRangeContent(this.getImageTagRange());
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
            const content = this.getRangeContent(range);
            const atIndex = this.indexOf(this.document.offsetAt(range.start), content, '@');
            const slashIndex = content.indexOf('/');
            if (atIndex === -1) {
                const colonIndex = this.lastIndexOf(this.document.offsetAt(range.start), content, ':');
                if (colonIndex > slashIndex) {
                    return Range.create(range.start.line, range.start.character + colonIndex + 1, range.end.line, range.end.character);
                }
            }

            const subcontent = content.substring(0, atIndex);
            const subcolonIndex = subcontent.indexOf(':');
            if (subcolonIndex !== -1 && slashIndex !== -1) {
                // both colon and slash found, check if it is a port
                if (subcolonIndex < slashIndex) {
                    if (subcontent.lastIndexOf(':') === subcolonIndex) {
                        // same index, only colon is a port so return null
                        return null;
                    }
                }
                return Range.create(this.document.positionAt(this.document.offsetAt(range.start) + subcolonIndex + 1), this.document.positionAt(this.document.offsetAt(range.start) + subcontent.length));
            }
        }
        return null;
    }

    public getImageDigest(): string | null {
        return this.getRangeContent(this.getImageDigestRange());
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
            let index = this.lastIndexOf(this.document.offsetAt(range.start), content, '@');
            if (index !== -1) {
                return Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
            }
        }
        return null;
    }

    private indexOf(documentOffset: number, content: string, searchString: string): number {
        let index = content.indexOf(searchString);
        const variables = this.getVariables();
        for (let i = 0; i < variables.length; i++) {
            const position = documentOffset + index;
            const variableRange = variables[i].getRange();
            if (this.document.offsetAt(variableRange.start) < position && position < this.document.offsetAt(variableRange.end)) {
                const offset = this.document.offsetAt(variableRange.end) - documentOffset;
                const substring = content.substring(offset);
                const subIndex = substring.indexOf(searchString);
                if (subIndex === -1) {
                    return -1;
                }
                index = subIndex + offset;
                i = -1;
                continue;
            }
        }
        return index;
    }

    private lastIndexOf(documentOffset: number, content: string, searchString: string): number {
        let index = content.lastIndexOf(searchString);
        const variables = this.getVariables();
        for (let i = 0; i < variables.length; i++) {
            const position = documentOffset + index;
            const variableRange = variables[i].getRange();
            if (this.document.offsetAt(variableRange.start) < position && position < this.document.offsetAt(variableRange.end)) {
                index = content.substring(0, index).lastIndexOf(searchString);
                if (index === -1) {
                    return -1;
                }
                i = -1;
                continue;
            }
        }
        return index;
    }

    public getRegistry(): string | null {
        return this.getRangeContent(this.getRegistryRange());
    }

    public getRegistryRange(): Range | null {
        const range = this.getImageRange();
        if (range) {
            const tagRange = this.getImageTagRange();
            const digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);    
                }
            } else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
            }
            const content = this.getRangeContent(range);
            const rangeStart = this.document.offsetAt(range.start);
            const portIndex = this.indexOf(rangeStart, content, ':');
            const dotIndex = this.indexOf(rangeStart, content, '.');
            const startingSlashIndex = this.indexOf(rangeStart, content, '/');
            // hostname detected
            if (portIndex !== -1 || dotIndex !== -1) {
                return Range.create(
                    range.start,
                    this.document.positionAt(rangeStart + startingSlashIndex),
                );
            }
            const registry = content.substring(0, startingSlashIndex);
            // localhost registry detected
            if (registry === 'localhost') {
                return Range.create(
                    range.start,
                    this.document.positionAt(rangeStart + startingSlashIndex),
                );
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
        if (args.length > 2 && args[1].getValue().toUpperCase() === "AS") {
            return args[2].getRange();
        }
        return null;
    }

    public getPlatformFlag(): Flag | null {
        let flags = super.getFlags();
        return flags.length === 1 && flags[0].getName() === "platform" ? flags[0] : null;
    }
}
