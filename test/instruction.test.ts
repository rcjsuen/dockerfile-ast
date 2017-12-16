/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Instruction", () => {
    it("getInstructionRange", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal("FROM", instruction.getInstruction());

        dockerfile = DockerfileParser.parse(" FROM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FROM\n");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FROM\r\n");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FR\\OM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FR\\OM");

        dockerfile = DockerfileParser.parse("FROM\\ alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM\\");

        dockerfile = DockerfileParser.parse("F");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");

        dockerfile = DockerfileParser.parse("F\n");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");

        dockerfile = DockerfileParser.parse("F\r\n");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");

        dockerfile = DockerfileParser.parse("F\\ ");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "F");

        dockerfile = DockerfileParser.parse("FR\\ ");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FR");

        dockerfile = DockerfileParser.parse("FR\\\nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FR\\\r\nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FR\\ \t \nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FR\\\t\r\nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getInstruction(), "FROM");
    });

    it("getInstructionRange", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine");
        let instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);

        dockerfile = DockerfileParser.parse(" FROM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 1, 0, 5);

        dockerfile = DockerfileParser.parse("FROM\n");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);

        dockerfile = DockerfileParser.parse("FROM\r\n");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);

        dockerfile = DockerfileParser.parse("FR\\OM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 5);

        dockerfile = DockerfileParser.parse("FROM\\ alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);

        dockerfile = DockerfileParser.parse("F");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);

        dockerfile = DockerfileParser.parse("F\n");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);

        dockerfile = DockerfileParser.parse("F\r\n");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);

        dockerfile = DockerfileParser.parse("F\\ ");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 1);

        dockerfile = DockerfileParser.parse("FR\\ ");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 2);

        dockerfile = DockerfileParser.parse("FR\\\nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);

        dockerfile = DockerfileParser.parse("FR\\\r\nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);

        dockerfile = DockerfileParser.parse("FR\\ \t \nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);

        dockerfile = DockerfileParser.parse("FR\\\t\r\nOM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 1, 2);

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getInstructionRange(), 0, 0, 0, 4);
    });

    it("getArgumentsRange", () => {
        let dockerfile = DockerfileParser.parse("FROM");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsRange(), null);

        dockerfile = DockerfileParser.parse("FROM alpine");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 11);

        dockerfile = DockerfileParser.parse("FROM alpine AS stage");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 20);

        dockerfile = DockerfileParser.parse("RUN npm install && \\\n npm test");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 9);

        dockerfile = DockerfileParser.parse("RUN npm install && \\\r\n npm test");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getArgumentsRange(), 0, 4, 1, 9);

        dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getArgumentsRange(), 0, 7, 0, 13);

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        instruction = dockerfile.getInstructions()[0];
        assertRange(instruction.getArgumentsRange(), 0, 5, 0, 11);
    });

    it("getArgumentsRanges", () => {
        let dockerfile = DockerfileParser.parse("FROM");
        let instruction = dockerfile.getInstructions()[0];
        let ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 0);

        dockerfile = DockerfileParser.parse("FROM alpine");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 11);

        dockerfile = DockerfileParser.parse("FROM alpine AS stage");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 20);

        dockerfile = DockerfileParser.parse("RUN npm install && \\\n npm test");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);

        dockerfile = DockerfileParser.parse("RUN npm install && \\\r\n npm test");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);

        dockerfile = DockerfileParser.parse("RUN npm install && \\ \t \t\n npm test");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 4, 0, 19);
        assertRange(ranges[1], 1, 0, 1, 9);

        dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 7, 0, 13);

        dockerfile = DockerfileParser.parse("EXPOSE 80 \\\n 81\\82");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 7, 0, 10);
        assertRange(ranges[1], 1, 0, 1, 6);

        dockerfile = DockerfileParser.parse("EXPOSE 80 \\\n 81 \\ 82");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 7, 0, 10);
        assertRange(ranges[1], 1, 0, 1, 8);

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 1);
        assertRange(ranges[0], 0, 5, 0, 11);

        dockerfile = DockerfileParser.parse("FROM alpine AS \\\n base\\\n # comment");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 15);
        assertRange(ranges[1], 1, 0, 1, 5);

        dockerfile = DockerfileParser.parse("FROM busybox\nFROM alpine AS \\\n base\\\n # comment");
        instruction = dockerfile.getInstructions()[1];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 1, 5, 1, 15);
        assertRange(ranges[1], 2, 0, 2, 5);

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment \n AS stage");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 3);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 1, 0, 1, 1);
        assertRange(ranges[2], 2, 0, 2, 9);

        dockerfile = DockerfileParser.parse("FROM alpine \\\n# comment \n AS stage");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 2, 0, 2, 9);

        dockerfile = DockerfileParser.parse("FROM alpine \\\n\n AS stage");
        instruction = dockerfile.getInstructions()[0];
        ranges = instruction.getArgumentsRanges();
        assert.equal(ranges.length, 2);
        assertRange(ranges[0], 0, 5, 0, 12);
        assertRange(ranges[1], 2, 0, 2, 9);
    });

    it("getArgumentsContent", () => {
        let dockerfile = DockerfileParser.parse("FROM");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), null);

        dockerfile = DockerfileParser.parse("FROM alpine");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "alpine");

        dockerfile = DockerfileParser.parse("FROM alpine AS stage");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "alpine AS stage");

        dockerfile = DockerfileParser.parse("RUN npm install && \\\n npm test");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");

        dockerfile = DockerfileParser.parse("RUN npm install && \\ \t \t\n npm test");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");

        dockerfile = DockerfileParser.parse("RUN npm install && \\\r\n npm test");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");

        dockerfile = DockerfileParser.parse("RUN npm install && \\ \t \t\r\n npm test");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "npm install &&  npm test");

        dockerfile = DockerfileParser.parse("RUN echo 'abc#def'");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "echo 'abc#def'");

        dockerfile = DockerfileParser.parse("EXPOSE \\\n \n 8081");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "8081");

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getArgumentsContent(), "alpine");
    });

    it("getVariables", () => {
        let dockerfile = DockerfileParser.parse("FROM");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM \\$var");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM $");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM $image");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("FROM $image$image2");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 2);

        dockerfile = DockerfileParser.parse("EXOPSE $po\\rt");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("EXOPSE $port\\$port");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("FROM $ima\\\nge");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("FROM $ima\\\r\nge");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("FROM $ima\\ \t\nge");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("FROM $ima\\ \t\r\nge");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("FROM \\$image");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("RUN echo $var $var2");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 2);

        dockerfile = DockerfileParser.parse("RUN echo ${var} ${var2}");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 2);

        dockerfile = DockerfileParser.parse("RUN echo ${}");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("RUN echo ${:}");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("RUN echo ${::}");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 1);

        dockerfile = DockerfileParser.parse("RUN echo ${invalid");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("RUN echo ${invalid\\");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM $ ");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM $\t");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM $\n");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);

        dockerfile = DockerfileParser.parse("FROM $\r\n");
        instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getVariables().length, 0);
    });

    it("isAfter", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nFROM busybox");
        let instructions = dockerfile.getInstructions();
        assert.equal(instructions[0].isAfter(instructions[1]), false);
        assert.equal(instructions[1].isAfter(instructions[0]), true);
    });
});
