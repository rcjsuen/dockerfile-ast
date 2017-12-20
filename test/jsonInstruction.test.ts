/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";
import { Position, Range } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser, JSONInstruction, Argument } from '../src/main';

function assertArgument(argument: Argument, value: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
    assert.equal(argument.getValue(), value);
    assertRange(argument.getRange(), startLine, startCharacter, endLine, endCharacter);
}

describe("JSON Instruction", () => {
    it("SHELL", () => {
        let dockerfile = DockerfileParser.parse("SHELL");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        assert.equal(instruction.getOpeningBracket(), null);
        assert.equal(instruction.getJSONStrings().length, 0);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL []", () => {
        let dockerfile = DockerfileParser.parse("SHELL []");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        assert.equal(instruction.getJSONStrings().length, 0);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 7, 0, 8);
    });

    it("SHELL [ ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        assert.equal(instruction.getJSONStrings().length, 0);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 8, 0, 9);
    });

    it("SHELL [ \"abc\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abc\"", 0, 8, 0, 13);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 14, 0, 15);
    });

    it("SHELL [ \"a\", \"b\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"a\", \"b\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 2);
        assertArgument(strings[0], "\"a\"", 0, 8, 0, 11);
        assertArgument(strings[1], "\"b\"", 0, 13, 0, 16);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 17, 0, 18);
    });

    it("SHELL [ \"[\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"[\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"[\"", 0, 8, 0, 11);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 12, 0, 13);
    });

    it("SHELL [ [", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ [");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL [ \"a\", \"b\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"a\", \"b\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 17, 0, 18);
    });

    it("SHELL [ \"a\", \"b\" \\\\n ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"a\", \"b\" \\\n ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 1, 1, 1, 2);
    });

    it("SHELL [ \"a\", \"b\" \\\\ \\t\\r\\n ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"a\", \"b\" \\ \t\r\n ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 1, 1, 1, 2);
    });

    it("SHELL [ \"a,]\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"a,]\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"a,]\"", 0, 8, 0, 13);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 14, 0, 15);
    });

    it("SHELL [ \"\"\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"\"\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"\"", 0, 8, 0, 10);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL \"", () => {
        let dockerfile = DockerfileParser.parse("SHELL \"");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        assert.equal(instruction.getOpeningBracket(), null);
        assert.equal(instruction.getJSONStrings().length, 0);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL ,", () => {
        let dockerfile = DockerfileParser.parse("SHELL ,");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        assert.equal(instruction.getOpeningBracket(), null);
        assert.equal(instruction.getJSONStrings().length, 0);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        assert.equal(instruction.getOpeningBracket(), null);
        assert.equal(instruction.getJSONStrings().length, 0);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL [ \"\\\\\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"\\\\\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"\\\"", 0, 8, 0, 12);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 13, 0, 14);
    });

    it("SHELL [ \"\\\"\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"\\\"\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"\"\"", 0, 8, 0, 12);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 0, 13, 0, 14);
    });

    it("SHELL [ \"abc\\\\ndef\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\\\ndef\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abcdef\"", 0, 8, 1, 4);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 1, 5, 1, 6);
    });

    it("SHELL [ \"abc\\\\r\\ndef\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\\\r\ndef\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abcdef\"", 0, 8, 1, 4);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 1, 5, 1, 6);
    });

    it("SHELL [ \"abc\\\  \\r\\ndef\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\\  \r\ndef\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        let strings = instruction.getJSONStrings();
        assert.equal(strings.length, 1);
        assertArgument(strings[0], "\"abcdef\"", 0, 8, 1, 4);
        bracket = instruction.getClosingBracket();
        assertArgument(bracket, "]", 1, 5, 1, 6);
    });

    it("SHELL [ \"abc\\  def\" ]", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \"abc\\  dedf\" ]");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        assert.equal(instruction.getJSONStrings(), 0);
        assert.equal(instruction.getClosingBracket(), null);
    });

    it("SHELL [ \\a", () => {
        let dockerfile = DockerfileParser.parse("SHELL [ \\a");
        let instruction = dockerfile.getInstructions()[0] as JSONInstruction;
        let bracket = instruction.getOpeningBracket();
        assertArgument(bracket, "[", 0, 6, 0, 7);
        assert.equal(instruction.getJSONStrings(), 0);
        assert.equal(instruction.getClosingBracket(), null);
    });
});
