/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { Range } from 'vscode-languageserver-types';

export function assertRange(range: Range, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
    assert.equal(range.start.line, startLine, "start line does not match");
    assert.equal(range.start.character, startCharacter, "start character does not match");
    assert.equal(range.end.line, endLine, "end line does not match");
    assert.equal(range.end.character, endCharacter, "end character does not match");
}
