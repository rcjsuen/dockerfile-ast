/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { Range } from 'vscode-languageserver-types';

export function assertRange(range: Range | null, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
    assert.notStrictEqual(range, null, "range should not be null");
    assert.deepStrictEqual(range, { start: { line: startLine, character: startCharacter }, end: { line: endLine, character: endCharacter }});
}
