/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Range } from 'vscode-languageserver-types';

/**
 * Heredoc represents a here-document that has been embedded in a
 * Dockerfile.
 * 
 * This API is experimental and subject to change.
 */
export class Heredoc {

    constructor(
        private readonly startRange: Range,
        private readonly name: string,
        private readonly nameRange: Range,
        private readonly contentRange: Range,
        private readonly endRange: Range) { }

    /**
     * Returns the name of the here-document.
     * 
     * This API is experimental and subject to change.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Returns the range of the start operator and the name. If the
     * here-document is initialized with <<EOT then the start range would
     * encompass all five characters.
     * 
     * This API is experimental and subject to change.
     */
    public getStartRange(): Range {
        return this.startRange;
    }

    /**
     * Returns the range of this here-document's name that is declared at
     * the beginning of the here-document with the operator. If the
     * here-document is initialized with <<EOT then the name range would
     * encompass the latter three "EOT" characters.
     * 
     * This API is experimental and subject to change.
     */
    public getNameRange(): Range {
        return this.nameRange;
    }

    /**
     * Returns the range of the content of this here-document. This may
     * be null if the here-document has no content because:
     * - the start range is the only thing that was declared
     * - the end range was declared immediately and there is no content
     * 
     * This API is experimental and subject to change.
     */
    public getContentRange(): Range | null {
        return this.contentRange;
    }

    /**
     * Returns the range of the here-document's name on a line that
     * represents the end of the here-document.
     * 
     * This API is experimental and subject to change.
     */
    public getDelimiterRange(): Range | null {
        return this.endRange;
    }
}
