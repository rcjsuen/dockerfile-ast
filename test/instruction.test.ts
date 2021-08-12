/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Instruction", () => {
    it("froM", () => {
        let dockerfile = DockerfileParser.parse("froM");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "froM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 4);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM");
    });

    it("FROM\\n", () => {
        let dockerfile = DockerfileParser.parse("FROM\n");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 4);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM");
    });

    it("FROM\\r\\n", () => {
        let dockerfile = DockerfileParser.parse("FROM\r\n");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 4);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM");
    });

    it("FROM alpine", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 11);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 11);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 11);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it(" FROM alpine", () => {
        let dockerfile = DockerfileParser.parse(" FROM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 1, 0, 12);
        assertRange(instruction.getInstructionRange(), 0, 1, 0, 5);
        assertRange(instruction.getArgumentsRange(), 0, 6, 0, 12);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 6, 0, 12);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("F\\", () => {
        let dockerfile = DockerfileParser.parse("F\\");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F\\");
        assert.equal(instruction.getKeyword(), "F\\");
        assertRange(instruction.getRange(), 0, 0, 0, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 2);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F\\");
    });

    it("FR\\", () => {
        let dockerfile = DockerfileParser.parse("FR\\");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FR\\");
        assert.equal(instruction.getKeyword(), "FR\\");
        assertRange(instruction.getRange(), 0, 0, 0, 3);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FR\\");
    });

    it("F\\ ", () => {
        let dockerfile = DockerfileParser.parse("F\\ ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F\\");
        assert.equal(instruction.getKeyword(), "F\\");
        assertRange(instruction.getRange(), 0, 0, 0, 3);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 2);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F\\");
    });

    it("F\\\\n", () => {
        const dockerfile = DockerfileParser.parse("F\\\n");
        const instruction = dockerfile.getInstructions()[0];
        assert.strictEqual(instruction.getInstruction(), "F");
        assert.strictEqual(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 1, 0);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.strictEqual(instruction.getArgumentsRange(), null);
        assert.strictEqual(instruction.getArgumentsContent(), null);
        assert.strictEqual(instruction.getArgumentsRanges().length, 0);
        assert.strictEqual(instruction.getVariables().length, 0);
        assert.strictEqual(instruction.toString(), "F");
    });

    it("F\\\\n\\\\n", () => {
        const dockerfile = DockerfileParser.parse("F\\\nR\\\n");
        const instruction = dockerfile.getInstructions()[0];
        assert.strictEqual(instruction.getInstruction(), "FR");
        assert.strictEqual(instruction.getKeyword(), "FR");
        assertRange(instruction.getRange(), 0, 0, 2, 0);
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 1);
        assert.strictEqual(instruction.getArgumentsRange(), null);
        assert.strictEqual(instruction.getArgumentsContent(), null);
        assert.strictEqual(instruction.getArgumentsRanges().length, 0);
        assert.strictEqual(instruction.getVariables().length, 0);
        assert.strictEqual(instruction.toString(), "FR");
    });

    it("F\\\\n\\\\n", () => {
        const dockerfile = DockerfileParser.parse("F\\\n\\\n");
        const instruction = dockerfile.getInstructions()[0];
        assert.strictEqual(instruction.getInstruction(), "F");
        assert.strictEqual(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 2, 0);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.strictEqual(instruction.getArgumentsRange(), null);
        assert.strictEqual(instruction.getArgumentsContent(), null);
        assert.strictEqual(instruction.getArgumentsRanges().length, 0);
        assert.strictEqual(instruction.getVariables().length, 0);
        assert.strictEqual(instruction.toString(), "F");
    });

    it("F\\\\r", () => {
        const dockerfile = DockerfileParser.parse("F\\\r");
        const instruction = dockerfile.getInstructions()[0];
        assert.strictEqual(instruction.getInstruction(), "F");
        assert.strictEqual(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 1, 0);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.strictEqual(instruction.getArgumentsRange(), null);
        assert.strictEqual(instruction.getArgumentsContent(), null);
        assert.strictEqual(instruction.getArgumentsRanges().length, 0);
        assert.strictEqual(instruction.getVariables().length, 0);
        assert.strictEqual(instruction.toString(), "F");
    });

    it("F\\\\r\\n", () => {
        const dockerfile = DockerfileParser.parse("F\\\r\n");
        const instruction = dockerfile.getInstructions()[0];
        assert.strictEqual(instruction.getInstruction(), "F");
        assert.strictEqual(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 1, 0);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.strictEqual(instruction.getArgumentsRange(), null);
        assert.strictEqual(instruction.getArgumentsContent(), null);
        assert.strictEqual(instruction.getArgumentsRanges().length, 0);
        assert.strictEqual(instruction.getVariables().length, 0);
        assert.strictEqual(instruction.toString(), "F");
    });

    it("F\\  alpine", () => {
        const dockerfile = DockerfileParser.parse("F\\  alpine");
        const instruction = dockerfile.getInstructions()[0];
        assert.strictEqual(instruction.getInstruction(), "F\\");
        assert.strictEqual(instruction.getKeyword(), "F\\");
        assertRange(instruction.getRange(), 0, 0, 0, 10);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 2);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 10);
        assert.strictEqual(instruction.getArgumentsContent(), "alpine");
        const ranges = instruction.getArgumentsRanges();
        assert.strictEqual(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 10);
        assert.strictEqual(instruction.getVariables().length, 0);
        assert.strictEqual(instruction.toString(), "F\\ alpine");
    });

    it("#escape=`\\nF` ", () => {
        let dockerfile = DockerfileParser.parse("#escape=`\nF` ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F`");
        assert.equal(instruction.getKeyword(), "F`");
        assertRange(instruction.getRange(), 1, 0, 1, 3);
        assertRange(instruction.getInstructionRange(), 1, 0, 1, 2);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F`");
    });

    it("FR\\ ", () => {
        let dockerfile = DockerfileParser.parse("FR\\ ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FR\\");
        assert.equal(instruction.getKeyword(), "FR\\");
        assertRange(instruction.getRange(), 0, 0, 0, 4);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FR\\");
    });

    it("#escape=`\\nFR` ", () => {
        let dockerfile = DockerfileParser.parse("#escape=`\nFR` ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FR`");
        assert.equal(instruction.getKeyword(), "FR`");
        assertRange(instruction.getRange(), 1, 0, 1, 4);
        assertRange(instruction.getInstructionRange(), 1, 0, 1, 3);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FR`");
    });

    it("FROM\\ alpine", () => {
        let dockerfile = DockerfileParser.parse("FROM\\ alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM\\");
        assert.equal(instruction.getKeyword(), "FROM\\");
        assertRange(instruction.getRange(), 0, 0, 0, 12);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 5);
        assertRange(instruction.getArgumentsRange(), 0, 6, 0, 12);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 6, 0, 12);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM\\ alpine");
    });

    it("FR\\om alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\om alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal("FR\\om", instruction.getInstruction());
        assert.equal("FR\\OM", instruction.getKeyword());
        assertRange(instruction.getRange(), 0, 0, 0, 12);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 5);
        assertRange(instruction.getArgumentsRange(), 0, 6, 0, 12);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 6, 0, 12);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FR\\OM alpine");
    });

    it("F", () => {
        let dockerfile = DockerfileParser.parse("F");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");
        assert.equal(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 0, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F");
    });

    it("F ", () => {
        let dockerfile = DockerfileParser.parse("F ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");
        assert.equal(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 0, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F");
    });

    it("F\\n", () => {
        let dockerfile = DockerfileParser.parse("F\n");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");
        assert.equal(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 0, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F");
    });

    it("F\\r\\n", () => {
        let dockerfile = DockerfileParser.parse("F\r\n");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");
        assert.equal(instruction.getKeyword(), "F");
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F");
    });

    it("F alpine", () => {
        let dockerfile = DockerfileParser.parse("F alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");
        assert.equal(instruction.getKeyword(), "F");
        assertRange(instruction.getRange(), 0, 0, 0, 8);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);
        assertRange(instruction.getArgumentsRange(), 0, 2, 0, 8);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 2, 0, 8);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F alpine");
    });

    it("FR\\\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);
        assertRange(instruction.getArgumentsRange(), 1, 3, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 1, 3, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\n\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\n\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 2, 2);
        assertRange(instruction.getArgumentsRange(), 2, 3, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 3, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\n \\t\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\n \t\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 2, 2);
        assertRange(instruction.getArgumentsRange(), 2, 3, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 3, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\n\\t \\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\n\t \nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 2, 2);
        assertRange(instruction.getArgumentsRange(), 2, 3, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 3, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\r\\n\\r\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\r\n\r\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 2, 2);
        assertRange(instruction.getArgumentsRange(), 2, 3, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 3, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\r\\n \\t\\r\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\r\n \t\r\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 2, 2);
        assertRange(instruction.getArgumentsRange(), 2, 3, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 3, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\r\\n\\t \\r\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\r\n\t \r\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 2, 2);
        assertRange(instruction.getArgumentsRange(), 2, 3, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 3, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\r\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\r\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);
        assertRange(instruction.getArgumentsRange(), 1, 3, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 1, 3, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\t\\r\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\t\r\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);
        assertRange(instruction.getArgumentsRange(), 1, 3, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 1, 3, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\ \\t \\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\ \t \nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);
        assertRange(instruction.getArgumentsRange(), 1, 3, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 1, 3, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FROM alpine \\\\n # comment", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 10);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 11);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 11);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FROM alpine AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine AS stage");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 20);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 20);
        assert.equal(instruction.getArgumentsContent(), "alpine AS stage");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 20);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS stage");
    });

    it("RUN npm install && \\\\n npm test", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install && \\\n npm test");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN npm install && npm test");
    });

    it("RUN npm install && \\\\r\\n npm test", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install && \\\r\n npm test");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN npm install && npm test");
    });

    it("RUN npm install && \\ \\t \\t\\n npm test", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install && \\ \t \t\n npm test");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN npm install && npm test");
    });

    it("RUN npm install && \\ \\t \\t\\r\\n npm test", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install && \\ \t \t\r\n npm test");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN npm install && npm test");
    });

    it("EXPOSE 80\\ 81", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "EXPOSE");
        assert.equal(instruction.getKeyword(), "EXPOSE");
        assertRange(instruction.getRange(), 0, 0, 0, 13);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 6);
        assertRange(instruction.getArgumentsRange(), 0, 7, 0, 13);
        assert.equal(instruction.getArgumentsContent(), "80\\ 81");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 7, 0, 13);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "EXPOSE 80 81");
    });

    it("EXPOSE 80 \\\\n 81\\82", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE 80 \\\n 81\\82");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "EXPOSE");
        assert.equal(instruction.getKeyword(), "EXPOSE");
        assertRange(instruction.getRange(), 0, 0, 1, 6);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 6);
        assertRange(instruction.getArgumentsRange(), 0, 7, 1, 6);
        assert.equal(instruction.getArgumentsContent(), "80  81\\82");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 7, 0, 10);
        assertRange(ranges[1], 1, 0, 1, 6);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "EXPOSE 80 8182");
    });

    it("EXPOSE 80 \\\\n 81 \\ 82", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE 80 \\\n 81 \\ 82");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "EXPOSE");
        assert.equal(instruction.getKeyword(), "EXPOSE");
        assertRange(instruction.getRange(), 0, 0, 1, 8);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 6);
        assertRange(instruction.getArgumentsRange(), 0, 7, 1, 8);
        assert.equal(instruction.getArgumentsContent(), "80  81 \\ 82");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 7, 0, 10);
        assertRange(ranges[1], 1, 0, 1, 8);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "EXPOSE 80 81 82");
    });

    it("EXPOSE \\\\n \\n 8081", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE \\\n \n 8081");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "EXPOSE");
        assert.equal(instruction.getKeyword(), "EXPOSE");
        assertRange(instruction.getRange(), 0, 0, 2, 5);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 6);
        assertRange(instruction.getArgumentsRange(), 2, 1, 2, 5);
        assert.equal(instruction.getArgumentsContent(), "8081");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 2, 1, 2, 5);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "EXPOSE 8081");
    });

    it("FROM alpine AS \\\\n base\\\\n # comment", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine AS \\\n base\\\n # comment");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 10);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 1, 5);
        assert.equal(instruction.getArgumentsContent(), "alpine AS  base");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 15);
        assertRange(ranges[1], 1, 0, 1, 5);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS base");
    });

    it("FROM alpine AS \\\\r\\n base\\\\r\\n # comment", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine AS \\\r\n base\\\r\n # comment");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 10);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 1, 5);
        assert.equal(instruction.getArgumentsContent(), "alpine AS  base");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 15);
        assertRange(ranges[1], 1, 0, 1, 5);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS base");
    });

    it("FROM busybox\\nFROM alpine AS \\\\n base\\\\n # comment", () => {
        let dockerfile = DockerfileParser.parse("FROM busybox\nFROM alpine AS \\\n base\\\n # comment");
        let instruction = dockerfile.getInstructions()[1];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 1, 0, 3, 10);
        assertRange(instruction.getInstructionRange(), 1, 0, 1, 4);
        assertRange(instruction.getArgumentsRange(), 1, 5, 2, 5);
        assert.equal(instruction.getArgumentsContent(), "alpine AS  base");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 5, 1, 15);
        assertRange(ranges[1], 2, 0, 2, 5);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS base");
    });

    it("FROM busybox\\r\\nFROM alpine AS \\\\r\\n base\\\\r\\n # comment", () => {
        let dockerfile = DockerfileParser.parse("FROM busybox\r\nFROM alpine AS \\\r\n base\\\r\n # comment");
        let instruction = dockerfile.getInstructions()[1];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 1, 0, 3, 10);
        assertRange(instruction.getInstructionRange(), 1, 0, 1, 4);
        assertRange(instruction.getArgumentsRange(), 1, 5, 2, 5);
        assert.equal(instruction.getArgumentsContent(), "alpine AS  base");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 5, 1, 15);
        assertRange(ranges[1], 2, 0, 2, 5);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS base");
    });

    it("FROM alpine \\\\n # comment \\n AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment \n AS stage");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine  AS stage");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 2, 0, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS stage");
    });

    it("FROM alpine \\\\n# comment \\n AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine \\\n# comment \n AS stage");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine  AS stage");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 2, 0, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS stage");
    });

    it("FROM alpine \\\\n\\n AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine \\\n\n AS stage");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 2, 9);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine  AS stage");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 2, 0, 2, 9); ``
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS stage");
    });

    it("RUN echo 'abc#def'", () => {
        let dockerfile = DockerfileParser.parse("RUN echo 'abc#def'");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 18);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 18);
        assert.equal(instruction.getArgumentsContent(), "echo 'abc#def'");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 18);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN echo 'abc#def'");
    });

    it("FROM \\$var", () => {
        let dockerfile = DockerfileParser.parse("FROM \\$var");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 10);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 10);
        assert.equal(instruction.getArgumentsContent(), "\\$var");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 10);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM \\$var");
    });

    it("FROM $", () => {
        let dockerfile = DockerfileParser.parse("FROM $");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 6);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 6);
        assert.equal(instruction.getArgumentsContent(), "$");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 6);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM $");
    });

    it("FROM $image", () => {
        let dockerfile = DockerfileParser.parse("FROM $image");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 11);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 11);
        assert.equal(instruction.getArgumentsContent(), "$image");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 11);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "FROM $image");
    });

    it("FROM $image", () => {
        let dockerfile = DockerfileParser.parse("FROM $image$image2");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 18);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 18);
        assert.equal(instruction.getArgumentsContent(), "$image$image2");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 18);
        assert.equal(instruction.getVariables().length, 2);
        assert.equal(instruction.toString(), "FROM $image$image2");
    });

    it("EXPOSE $po\\\rt", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $po\\rt");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "EXPOSE");
        assert.equal(instruction.getKeyword(), "EXPOSE");
        assertRange(instruction.getRange(), 0, 0, 0, 13);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 6);
        assertRange(instruction.getArgumentsRange(), 0, 7, 0, 13);
        assert.equal(instruction.getArgumentsContent(), "$po\\rt");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 7, 0, 13);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "EXPOSE $port");
    });

    it("EXPOSE $po\\\rt", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $port\\$port");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "EXPOSE");
        assert.equal(instruction.getKeyword(), "EXPOSE");
        assertRange(instruction.getRange(), 0, 0, 0, 18);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 6);
        assertRange(instruction.getArgumentsRange(), 0, 7, 0, 18);
        assert.equal(instruction.getArgumentsContent(), "$port\\$port");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 7, 0, 18);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "EXPOSE $port\\$port");
    });

    it("FROM $ima\\\\nge", () => {
        let dockerfile = DockerfileParser.parse("FROM $ima\\\nge");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 1, 2);
        assert.equal(instruction.getArgumentsContent(), "$image");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 9);
        assertRange(ranges[1], 1, 0, 1, 2);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "FROM $image");
    });

    it("FROM $ima\\\\r\\nge", () => {
        let dockerfile = DockerfileParser.parse("FROM $ima\\\r\nge");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 1, 2);
        assert.equal(instruction.getArgumentsContent(), "$image");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 9);
        assertRange(ranges[1], 1, 0, 1, 2);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "FROM $image");
    });

    it("FROM $ima\\ \\t\\nge", () => {
        let dockerfile = DockerfileParser.parse("FROM $ima\\ \t\nge");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 1, 2);
        assert.equal(instruction.getArgumentsContent(), "$image");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 9);
        assertRange(ranges[1], 1, 0, 1, 2);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "FROM $image");
    });

    it("FROM $ima\\ \\t\\r\\nge", () => {
        let dockerfile = DockerfileParser.parse("FROM $ima\\ \t\r\nge");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 1, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 1, 2);
        assert.equal(instruction.getArgumentsContent(), "$image");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 9);
        assertRange(ranges[1], 1, 0, 1, 2);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "FROM $image");
    });

    it("FROM \\$image", () => {
        let dockerfile = DockerfileParser.parse("FROM \\$image");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 12);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 12);
        assert.equal(instruction.getArgumentsContent(), "\\$image");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 12);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM \\$image");
    });

    it("RUN echo $var $var2", () => {
        let dockerfile = DockerfileParser.parse("RUN echo $var $var2");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 19);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 19);
        assert.equal(instruction.getArgumentsContent(), "echo $var $var2");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 19);
        assert.equal(instruction.getVariables().length, 2);
        assert.equal(instruction.toString(), "RUN echo $var $var2");
    });

    it("RUN echo ${var} ${var2}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${var} ${var2}");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 23);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 23);
        assert.equal(instruction.getArgumentsContent(), "echo ${var} ${var2}");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 23);
        assert.equal(instruction.getVariables().length, 2);
        assert.equal(instruction.toString(), "RUN echo ${var} ${var2}");
    });

    it("RUN echo ${}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${}");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 12);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 12);
        assert.equal(instruction.getArgumentsContent(), "echo ${}");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 12);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "RUN echo ${}");
    });

    it("RUN echo ${:}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${:}");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 13);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 13);
        assert.equal(instruction.getArgumentsContent(), "echo ${:}");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 13);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "RUN echo ${:}");
    });

    it("RUN echo ${::}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${::}");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 14);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 14);
        assert.equal(instruction.getArgumentsContent(), "echo ${::}");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 14);
        assert.equal(instruction.getVariables().length, 1);
        assert.equal(instruction.toString(), "RUN echo ${::}");
    });

    it("RUN echo ${invalid", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${invalid");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 18);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 18);
        assert.equal(instruction.getArgumentsContent(), "echo ${invalid");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 18);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN echo ${invalid");
    });

    it("RUN echo ${invalid\\", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${invalid\\");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 0, 19);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 0, 19);
        assert.equal(instruction.getArgumentsContent(), "echo ${invalid\\");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 4, 0, 19);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN echo ${invalid");
    });

    it("FROM $ ", () => {
        let dockerfile = DockerfileParser.parse("FROM $ ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 7);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 6);
        assert.equal(instruction.getArgumentsContent(), "$");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 6);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM $");
    });

    it("FROM $\\t", () => {
        let dockerfile = DockerfileParser.parse("FROM $\t");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 7);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 6);
        assert.equal(instruction.getArgumentsContent(), "$");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 6);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM $");
    });

    it("FROM $\\n", () => {
        let dockerfile = DockerfileParser.parse("FROM $\n");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 6);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 6);
        assert.equal(instruction.getArgumentsContent(), "$");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 6);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM $");
    });

    it("FROM $\\r\\n", () => {
        let dockerfile = DockerfileParser.parse("FROM $\r\n");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
        assertRange(instruction.getRange(), 0, 0, 0, 6);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 6);
        assert.equal(instruction.getArgumentsContent(), "$");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 6);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM $");
    });

    it("RUN \\\" \\\\nx", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\" \\\nx");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 1);
        assert.equal(instruction.getArgumentsContent(), "\\\" x");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 7);
        assertRange(ranges[1], 1, 0, 1, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN \" x");
    });

    it("RUN \\\" \\\\r\\nx", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\" \\\r\nx");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 1);
        assert.equal(instruction.getArgumentsContent(), "\\\" x");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 7);
        assertRange(ranges[1], 1, 0, 1, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN \" x");
    });

    it("RUN x\\\\ny", () => {
        let dockerfile = DockerfileParser.parse("RUN x\\\ny");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 1);
        assert.equal(instruction.getArgumentsContent(), "xy");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 5);
        assertRange(ranges[1], 1, 0, 1, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN xy");
    });

    it("RUN x\\\\r\\ny", () => {
        let dockerfile = DockerfileParser.parse("RUN x\\\r\ny");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 1, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 1);
        assert.equal(instruction.getArgumentsContent(), "xy");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 5);
        assertRange(ranges[1], 1, 0, 1, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN xy");
    });

    it("RUN \\\\na\\\\na", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\na\\\na");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 2, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 1, 0, 2, 1);
        assert.equal(instruction.getArgumentsContent(), "aa");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 0, 1, 1);
        assertRange(ranges[1], 2, 0, 2, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN aa");
    });

    it("RUN \\\\r\\na\\\\r\\na", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\r\na\\\r\na");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 2, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 1, 0, 2, 1);
        assert.equal(instruction.getArgumentsContent(), "aa");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 0, 1, 1);
        assertRange(ranges[1], 2, 0, 2, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN aa");
    });

    it("RUN \\\\na\\\\n\\\\na", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\na\\\n\\\na");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 3, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 1, 0, 3, 1);
        assert.equal(instruction.getArgumentsContent(), "aa");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 0, 1, 1);
        assertRange(ranges[1], 3, 0, 3, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN aa");
    });

    it("RUN \\\\r\\na\\\\r\\n\\\\r\\na", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\r\na\\\r\n\\\r\na");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 3, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 1, 0, 3, 1);
        assert.equal(instruction.getArgumentsContent(), "aa");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 0, 1, 1);
        assertRange(ranges[1], 3, 0, 3, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN aa");
    });

    it("RUN \\\\n a\\\\n \\\\n a", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\n a\\\n \\\n a");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 3, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 1, 1, 3, 2);
        assert.equal(instruction.getArgumentsContent(), "a a");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 1, 1, 2);
        assertRange(ranges[1], 3, 0, 3, 2);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN a a");
    });

    it("RUN \\\\r\\n a\\\\r\\n \\\\r\\n a", () => {
        let dockerfile = DockerfileParser.parse("RUN \\\r\n a\\\r\n \\\r\n a");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "RUN");
        assert.equal(instruction.getKeyword(), "RUN");
        assertRange(instruction.getRange(), 0, 0, 3, 2);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assertRange(instruction.getArgumentsRange(), 1, 1, 3, 2);
        assert.equal(instruction.getArgumentsContent(), "a a");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 1, 1, 2);
        assertRange(ranges[1], 3, 0, 3, 2);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "RUN a a");
    });

    it("COPY a b \\\\n\\ \\nc", () => {
        const dockerfile = DockerfileParser.parse("COPY a b \\\n\\ \nc");
        const instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "COPY");
        assert.equal(instruction.getKeyword(), "COPY");
        assertRange(instruction.getRange(), 0, 0, 2, 1);
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 2, 1);
        assert.equal(instruction.getArgumentsContent(), "a b c");
        const ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 9);
        assertRange(ranges[1], 2, 0, 2, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "COPY a b c");
    });

    it("#escape=`\\nCOPY a b `\\n` \\nc", () => {
        const dockerfile = DockerfileParser.parse("#escape=`\nCOPY a b `\n` \nc");
        const instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "COPY");
        assert.equal(instruction.getKeyword(), "COPY");
        assertRange(instruction.getRange(), 1, 0, 3, 1);
        assertRange(instruction.getInstructionRange(), 1, 0, 1, 4);
        assertRange(instruction.getArgumentsRange(), 1, 5, 3, 1);
        assert.equal(instruction.getArgumentsContent(), "a b c");
        const ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 5, 1, 9);
        assertRange(ranges[1], 3, 0, 3, 1);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "COPY a b c");
    });

    it("isAfter", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nFROM busybox");
        let instructions = dockerfile.getInstructions();
        assert.equal(instructions[0].isAfter(instructions[1]), false);
        assert.equal(instructions[1].isAfter(instructions[0]), true);
    });

    function createGetInstructionsTest(name: string, onbuildPrefix: string) {
        it(name, () => {
            const instructionLength = onbuildPrefix.length === 0 ? 3 : 7;
            const expectedInstruction = onbuildPrefix.length === 0 ? "RUN" : "ONBUILD";
            let dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<eot\neot");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            let instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getRange(), 0, 0, 1, 3);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<eot\neot\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getRange(), 0, 0, 1, 3);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<eot\necho\n\neot\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getRange(), 0, 0, 3, 3);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<eot\n\necho\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<-eot\n\necho\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<'eot'\n\necho\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<-'eot'\n\necho\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<\"eot\"\n\necho\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);

            dockerfile = DockerfileParser.parse(onbuildPrefix + "RUN <<-\"eot\"\n\necho\r\n");
            assert.strictEqual(dockerfile.getInstructions().length, 1);
            instruction = dockerfile.getInstructions()[0];
            assert.strictEqual(instruction.getInstruction(), expectedInstruction);
            assert.strictEqual(instruction.getKeyword(), expectedInstruction);
            assertRange(instruction.getInstructionRange(), 0, 0, 0, instructionLength);
        });
    }

    describe("getInstructions", () => {
        createGetInstructionsTest("standard", "");
        createGetInstructionsTest("onbuild", "ONBUILD ");
    });
});
