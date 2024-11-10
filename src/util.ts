/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { Range, Position } from 'vscode-languageserver-types';

export class Util {
    public static isUTF8BOM(char: string): boolean {
        const uintArray = Uint8Array.from(Buffer.from(char, "UTF-8"));
        return uintArray[0] === 0xEF && uintArray[1] == 0xBB && uintArray[2] == 0xBF;
    }

    public static isWhitespace(char: string): boolean {
        return char === ' ' || char === '\t' || Util.isNewline(char);
    }

    public static isNewline(char: string): boolean {
        return char === '\r' || char === '\n';
    }

    public static findLeadingNonWhitespace(content: string, escapeChar: string): number {
        whitespaceCheck: for (let i = 0; i < content.length; i++) {
            switch (content.charAt(i)) {
                case ' ':
                case '\t':
                    continue;
                case escapeChar:
                    escapeCheck: for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                // offset one more for \r\n
                                i = j + 1;
                                continue whitespaceCheck;
                            case '\n':
                                i = j;
                                continue whitespaceCheck;
                            default:
                                break escapeCheck;
                        }
                    }
                    // found an escape character and then reached EOF
                    return -1;
                default:
                    return i;
            }
        }
        // only possible if the content is the empty string
        return -1;
    }

    /**
     * Determines if the given position is contained within the given range.
     * 
     * @param position the position to check
     * @param range the range to see if the position is inside of
     */
    public static isInsideRange(position: Position, range: Range): boolean {
        if (range.start.line === range.end.line) {
            return range.start.line === position.line
                && range.start.character <= position.character
                && position.character <= range.end.character;
        } else if (range.start.line === position.line) {
            return range.start.character <= position.character;
        } else if (range.end.line === position.line) {
            return position.character <= range.end.character;
        }
        return range.start.line < position.line && position.line < range.end.line;
    }

    public static parseHeredocName(value: string): string | null {
        value = value.substring(2);
        if (value.charAt(0) === '-') {
            value = value.substring(1);
        }
        if (value.charAt(0) === '"' || value.charAt(0) === '\'') {
            value = value.substring(1, value.length - 1);
        }
        if (value.charAt(0) === "<") {
            return null;
        }
        return value;
    }
}
