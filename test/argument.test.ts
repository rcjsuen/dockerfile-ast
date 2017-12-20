/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import { Position } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Argument", () => {
    describe("regular", () => {
        it("RUN npm install", () => {
            let dockerfile = DockerfileParser.parse("RUN npm install");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "npm");
            assert.equal(args[1].getValue(), "install");
            assertRange(args[0].getRange(), 0, 4, 0, 7);
            assertRange(args[1].getRange(), 0, 8, 0, 15);
        });

        it("EXPOSE 80\\\\n00 8001", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 80\\\n00 8001");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "8000");
            assert.equal(args[1].getValue(), "8001");
            assertRange(args[0].getRange(), 0, 7, 1, 2);
            assertRange(args[1].getRange(), 1, 3, 1, 7);
        });

        it("EXPOSE 8000\\\\n 8001", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 8000\\\n 8001");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "8000");
            assert.equal(args[1].getValue(), "8001");
            assertRange(args[0].getRange(), 0, 7, 0, 11);
            assertRange(args[1].getRange(), 1, 1, 1, 5);
        });

        it("EXPOSE 80\\ 81", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "80");
            assert.equal(args[1].getValue(), "81");
            assertRange(args[0].getRange(), 0, 7, 0, 9);
            assertRange(args[1].getRange(), 0, 11, 0, 13);
        });

        it("EXPOSE \\ 8000", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE \\ 8000");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "8000");
            assertRange(args[0].getRange(), 0, 9, 0, 13);
        });

        it("SHELL [ \"a\\ b\" ]", () => {
            let dockerfile = DockerfileParser.parse("SHELL [ \"a\\ b\" ]");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 4);
            assert.equal(args[0].getValue(), "[");
            assert.equal(args[1].getValue(), "\"a");
            assert.equal(args[2].getValue(), "b\"");
            assert.equal(args[3].getValue(), "]");
            assertRange(args[0].getRange(), 0, 6, 0, 7);
            assertRange(args[1].getRange(), 0, 8, 0, 10);
            assertRange(args[2].getRange(), 0, 12, 0, 14);
            assertRange(args[3].getRange(), 0, 15, 0, 16);
        });

        it("EXPOSE \\a", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE \\a");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "a");
            assertRange(args[0].getRange(), 0, 7, 0, 9);
        });

        it("EXPOSE 80\\81", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 80\\81");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "8081");
            assertRange(args[0].getRange(), 0, 7, 0, 12);
        });

        it("FROM alpine \\\\n # comment", () => {
            let dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine");
            assertRange(args[0].getRange(), 0, 5, 0, 11);
        });

        it("FROM alpine \\\\n # comment \\n AS stage", () => {
            let dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment \n AS stage");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 3);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[1].getValue(), "AS");
            assert.equal(args[2].getValue(), "stage");
            assertRange(args[0].getRange(), 0, 5, 0, 11);
            assertRange(args[1].getRange(), 2, 1, 2, 3);
            assertRange(args[2].getRange(), 2, 4, 2, 9);
        });

        it("ARG a=a\\\\n b", () => {
            let dockerfile = DockerfileParser.parse("ARG a=a\\\n b");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "a=a");
            assert.equal(args[1].getValue(), "b");
            assertRange(args[0].getRange(), 0, 4, 0, 7);
            assertRange(args[1].getRange(), 1, 1, 1, 2);
        });

        it("ENV key=value  key2=value2", () => {
            let dockerfile = DockerfileParser.parse("ENV key=value  key2=value2");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "key=value");
            assert.equal(args[1].getValue(), "key2=value2");
            assertRange(args[0].getRange(), 0, 4, 0, 13);
            assertRange(args[1].getRange(), 0, 15, 0, 26);
        });

        it("LABEL key=value  key2=value2", () => {
            let dockerfile = DockerfileParser.parse("LABEL key=value  key2=value2");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "key=value");
            assert.equal(args[1].getValue(), "key2=value2");
            assertRange(args[0].getRange(), 0, 6, 0, 15);
            assertRange(args[1].getRange(), 0, 17, 0, 28);
        });
    });

    describe("expanded", () => {
        it("ENV var=value\\nRUN echo $var", () => {
            let dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value");
            assertRange(args[0].getRange(), 1, 4, 1, 8);
            assertRange(args[1].getRange(), 1, 9, 1, 13);
        });

        it("ENV var=value\\nRUN echo $var$var2", () => {
            let dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var$var2");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value$var2");
            assertRange(args[0].getRange(), 1, 4, 1, 8);
            assertRange(args[1].getRange(), 1, 9, 1, 18);
        });

        it("ARG var=value\\nRUN echo $var$var2", () => {
            let dockerfile = DockerfileParser.parse("ARG var=value\nRUN echo $var$var2");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value$var2");
            assertRange(args[0].getRange(), 1, 4, 1, 8);
            assertRange(args[1].getRange(), 1, 9, 1, 18);
        });

        it("RUN echo $var$var2\\nARG var=value\\nENV var=value2", () => {
            let dockerfile = DockerfileParser.parse("RUN echo $var$var2\nARG var=value\nENV var=value2");
            let args = dockerfile.getInstructions()[0].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "$var$var2");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assertRange(args[1].getRange(), 0, 9, 0, 18);
        });

        it("ENV var=value \\ \\t\\r\\n var2=value2", () => {
            let dockerfile = DockerfileParser.parse("ENV var=value \\ \t\r\n var2=value2");
            let args = dockerfile.getInstructions()[0].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "var=value");
            assert.equal(args[1].getValue(), "var2=value2");
            assertRange(args[0].getRange(), 0, 4, 0, 13);
            assertRange(args[1].getRange(), 1, 1, 1, 12);
        });
    });

    it("isBefore", () => {
        let dockerfile = DockerfileParser.parse("\nRUN npm install\n");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assert.equal(args[0].isBefore(Position.create(0, 0)), false);
        assert.equal(args[0].isBefore(Position.create(1, 1)), false);
        assert.equal(args[0].isBefore(Position.create(1, 10)), true);
        assert.equal(args[0].isBefore(Position.create(2, 0)), true);
    });

    it("isAfter", () => {
        let dockerfile = DockerfileParser.parse("\nRUN npm install\n");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assert.equal(args[0].isAfter(Position.create(0, 0)), true);
        assert.equal(args[0].isAfter(Position.create(1, 10)), false);
        assert.equal(args[1].isAfter(Position.create(1, 5)), true);
        assert.equal(args[0].isAfter(Position.create(2, 0)), false);
    });
});
