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
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 2);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "F\\");
    });

    it("FR\\ ", () => {
        let dockerfile = DockerfileParser.parse("FR\\ ");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FR\\");
        assert.equal(instruction.getKeyword(), "FR\\");
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 3);
        assert.equal(instruction.getArgumentsRange(), null);
        assert.equal(instruction.getArgumentsContent(), null);
        assert.equal(instruction.getArgumentsRanges().length, 0);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FR\\");
    });

    it("FROM\\ alpine", () => {
        let dockerfile = DockerfileParser.parse("FROM\\ alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM\\");
        assert.equal(instruction.getKeyword(), "FROM\\");
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 5);
        assertRange(instruction.getArgumentsRange(), 0, 6, 0, 12);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 6, 0, 12);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM\\ alpine");
    });

    it("FR\\OM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\om alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal("FR\\om", instruction.getInstruction());
        assert.equal("FR\\OM", instruction.getKeyword());
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
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);
        assertRange(instruction.getArgumentsRange(), 1, 3, 1, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 1, 3, 1, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine");
    });

    it("FR\\\\r\\nOM alpine", () => {
        let dockerfile = DockerfileParser.parse("FR\\\r\nOM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
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
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
        assertRange(instruction.getArgumentsRange(), 0, 5, 2, 9);
        assert.equal(instruction.getArgumentsContent(), "alpine   AS stage");
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 3);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 1, 0, 1, 1);
        assertRange(ranges[2], 2, 0, 2, 9);
        assert.equal(instruction.getVariables().length, 0);
        assert.equal(instruction.toString(), "FROM alpine AS stage");
    });

    it("FROM alpine \\\\n# comment \\n AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine \\\n# comment \n AS stage");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
        assert.equal(instruction.getKeyword(), "FROM");
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

    it("isAfter", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nFROM busybox");
        let instructions = dockerfile.getInstructions();
        assert.equal(instructions[0].isAfter(instructions[1]), false);
        assert.equal(instructions[1].isAfter(instructions[0]), true);
    });
});
