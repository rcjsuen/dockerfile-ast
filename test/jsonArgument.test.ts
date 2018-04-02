/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";
import { Position, Range } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser, JSONInstruction, Argument, JSONArgument } from '../src/main';

function assertArgument(argument: Argument, value: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
    assert.equal(argument.getValue(), value);
    assertRange(argument.getRange(), startLine, startCharacter, endLine, endCharacter);
}

function assertJSONArgument(argument: JSONArgument, value: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
    assert.equal(argument.getJSONValue(), value);
    assertRange(argument.getJSONRange(), startLine, startCharacter, endLine, endCharacter);
}

describe("JSONArgument", () => {
    it("SHELL [ \"abc\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abc\"", 0, 8, 0, 13);
        assertJSONArgument(strings[0], "abc", 0, 9, 0, 12);
    });

    it("SHELL [ \"a\", \"b\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"a\", \"b\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 2);
        assertArgument(strings[0], "\"a\"", 0, 8, 0, 11);
        assertJSONArgument(strings[0], "a", 0, 9, 0, 10);
        assertArgument(strings[1], "\"b\"", 0, 13, 0, 16);
        assertJSONArgument(strings[1], "b", 0, 14, 0, 15);
    });

    it("SHELL [ \"\\\\\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"\\\\\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"\\\"", 0, 8, 0, 12);
        assertJSONArgument(strings[0], "\\", 0, 9, 0, 11);
    });

    it("SHELL [ \"\\\"\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"\\\"\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"\"\"", 0, 8, 0, 12);
        assertJSONArgument(strings[0], "\"", 0, 9, 0, 11);
    });

    it("SHELL [ \"abc\\\\ndef\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\\\ndef\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abcdef\"", 0, 8, 1, 4);
        assertJSONArgument(strings[0], "abcdef", 0, 9, 1, 3);
    });

    it("SHELL [ \"abc\\\\r\\ndef\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\\\r\ndef\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abcdef\"", 0, 8, 1, 4);
        assertJSONArgument(strings[0], "abcdef", 0, 9, 1, 3);
    });
});
