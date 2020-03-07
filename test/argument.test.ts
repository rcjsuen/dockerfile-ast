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
            assert.equal(args[0].toString(), "npm");
            assert.equal(args[1].toString(), "install");
            assertRange(args[0].getRange(), 0, 4, 0, 7);
            assertRange(args[1].getRange(), 0, 8, 0, 15);
        });

        it("EXPOSE 80\\\\n00 8001", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 80\\\n00 8001");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "8000");
            assert.equal(args[1].getValue(), "8001");
            assert.equal(args[0].toString(), "8000");
            assert.equal(args[1].toString(), "8001");
            assertRange(args[0].getRange(), 0, 7, 1, 2);
            assertRange(args[1].getRange(), 1, 3, 1, 7);
        });

        it("EXPOSE 8000\\\\n 8001", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 8000\\\n 8001");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "8000");
            assert.equal(args[1].getValue(), "8001");
            assert.equal(args[0].toString(), "8000");
            assert.equal(args[1].toString(), "8001");
            assertRange(args[0].getRange(), 0, 7, 0, 11);
            assertRange(args[1].getRange(), 1, 1, 1, 5);
        });

        it("EXPOSE 8000\\\\r\\n 8001", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 8000\\\r\n 8001");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "8000");
            assert.equal(args[1].getValue(), "8001");
            assert.equal(args[0].toString(), "8000");
            assert.equal(args[1].toString(), "8001");
            assertRange(args[0].getRange(), 0, 7, 0, 11);
            assertRange(args[1].getRange(), 1, 1, 1, 5);
        });

        it("EXPOSE 80\\ 81", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "80");
            assert.equal(args[1].getValue(), "81");
            assert.equal(args[0].toString(), "80");
            assert.equal(args[1].toString(), "81");
            assertRange(args[0].getRange(), 0, 7, 0, 9);
            assertRange(args[1].getRange(), 0, 11, 0, 13);
        });

        it("EXPOSE \\ 8000", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE \\ 8000");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "8000");
            assert.equal(args[0].toString(), "8000");
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
            assert.equal(args[0].toString(), "[");
            assert.equal(args[1].toString(), "\"a");
            assert.equal(args[2].toString(), "b\"");
            assert.equal(args[3].toString(), "]");
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
            assert.equal(args[0].toString(), "a");
            assertRange(args[0].getRange(), 0, 7, 0, 9);
        });

        it("EXPOSE 80\\81", () => {
            let dockerfile = DockerfileParser.parse("EXPOSE 80\\81");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "8081");
            assert.equal(args[0].toString(), "8081");
            assertRange(args[0].getRange(), 0, 7, 0, 12);
        });

        it("USER r\\\\n\\oot", () => {
            let dockerfile = DockerfileParser.parse("USER r\\\n\\oot");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "root");
            assert.equal(args[0].toString(), "root");
            assertRange(args[0].getRange(), 0, 5, 1, 4);
        });

        it("RUN echo\\\\n \\abc", () => {
            let dockerfile = DockerfileParser.parse("RUN echo\\\n \\abc");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[0].toString(), "echo");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assert.equal(args[1].getValue(), "abc");
            assert.equal(args[1].toString(), "abc");
            assertRange(args[1].getRange(), 1, 1, 1, 5);
        });

        it("RUN echo\\\\n 'Hello'", () => {
            let dockerfile = DockerfileParser.parse("RUN echo\\\n 'Hello'");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[0].toString(), "echo");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assert.equal(args[1].getValue(), "'Hello'");
            assert.equal(args[1].toString(), "'Hello'");
            assertRange(args[1].getRange(), 1, 1, 1, 8);
        });

        it("RUN echo\\ \\n 'Hello'", () => {
            let dockerfile = DockerfileParser.parse("RUN echo\\ \n 'Hello'");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[0].toString(), "echo");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assert.equal(args[1].getValue(), "'Hello'");
            assert.equal(args[1].toString(), "'Hello'");
            assertRange(args[1].getRange(), 1, 1, 1, 8);
        });

        it("FROM alp\\\\nine", () => {
            let dockerfile = DockerfileParser.parse("FROM alp\\\nine");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[0].toString(), "alpine");
            assertRange(args[0].getRange(), 0, 5, 1, 3);
        });

        it("FROM alp\\\\n\\nine", () => {
            let dockerfile = DockerfileParser.parse("FROM alp\\\n\nine");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[0].toString(), "alpine");
            assertRange(args[0].getRange(), 0, 5, 2, 3);
        });

        it("FROM alp\\\\r\\n \t\\nine", () => {
            let dockerfile = DockerfileParser.parse("FROM alp\\\r\n \t\nine");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[0].toString(), "alpine");
            assertRange(args[0].getRange(), 0, 5, 2, 3);
        });

        it("FROM alp\\\\n \t\\r\\nine", () => {
            let dockerfile = DockerfileParser.parse("FROM alp\\\n \t\r\nine");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[0].toString(), "alpine");
            assertRange(args[0].getRange(), 0, 5, 2, 3);
        });

        it("ARG var=\\\\n\\nvalue", () => {
            let dockerfile = DockerfileParser.parse("ARG var=\\\n\nvalue");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "var=value");
            assert.equal(args[0].toString(), "var=value");
            assertRange(args[0].getRange(), 0, 4, 2, 5);
        });

        it("FROM alpine \\\\n # comment", () => {
            let dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[0].toString(), "alpine");
            assertRange(args[0].getRange(), 0, 5, 0, 11);
        });

        it("FROM alpine \\\\n # comment \\n AS stage", () => {
            let dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment \n AS stage");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 3);
            assert.equal(args[0].getValue(), "alpine");
            assert.equal(args[1].getValue(), "AS");
            assert.equal(args[2].getValue(), "stage");
            assert.equal(args[0].toString(), "alpine");
            assert.equal(args[1].toString(), "AS");
            assert.equal(args[2].toString(), "stage");
            assertRange(args[0].getRange(), 0, 5, 0, 11);
            assertRange(args[1].getRange(), 2, 1, 2, 3);
            assertRange(args[2].getRange(), 2, 4, 2, 9);
        });

        it("RUN echo \\\\n\\n# comment\\nabc", () => {
            let dockerfile = DockerfileParser.parse("RUN echo \\\n\n# comment\nabc");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "abc");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "abc");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assertRange(args[1].getRange(), 3, 0, 3, 3);
        });

        it("RUN echo \\\\n# comment\\n\\nabc", () => {
            let dockerfile = DockerfileParser.parse("RUN echo \\\n# comment\n\nabc");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "abc");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "abc");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assertRange(args[1].getRange(), 3, 0, 3, 3);
        });

        it("RUN echo \\\\n# comment\\n# comment\\nabc", () => {
            let dockerfile = DockerfileParser.parse("RUN echo \\\n# comment\n# comment\nabc");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "abc");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "abc");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assertRange(args[1].getRange(), 3, 0, 3, 3);
        });

        it("RUN echo \\\\n# comment\\n\\n# comment\\nabc", () => {
            let dockerfile = DockerfileParser.parse("RUN echo \\\n# comment\n\n# comment\nabc");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "abc");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "abc");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assertRange(args[1].getRange(), 4, 0, 4, 3);
        });

        it("ARG a=a\\\\n b", () => {
            let dockerfile = DockerfileParser.parse("ARG a=a\\\n b");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "a=a");
            assert.equal(args[1].getValue(), "b");
            assert.equal(args[0].toString(), "a=a");
            assert.equal(args[1].toString(), "b");
            assertRange(args[0].getRange(), 0, 4, 0, 7);
            assertRange(args[1].getRange(), 1, 1, 1, 2);
        });

        it("ARG a=a\\\\r\\n b", () => {
            let dockerfile = DockerfileParser.parse("ARG a=a\\\r\n b");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "a=a");
            assert.equal(args[1].getValue(), "b");
            assert.equal(args[0].toString(), "a=a");
            assert.equal(args[1].toString(), "b");
            assertRange(args[0].getRange(), 0, 4, 0, 7);
            assertRange(args[1].getRange(), 1, 1, 1, 2);
        });

        it("ENV key=value  key2=value2", () => {
            let dockerfile = DockerfileParser.parse("ENV key=value  key2=value2");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "key=value");
            assert.equal(args[1].getValue(), "key2=value2");
            assert.equal(args[0].toString(), "key=value");
            assert.equal(args[1].toString(), "key2=value2");
            assertRange(args[0].getRange(), 0, 4, 0, 13);
            assertRange(args[1].getRange(), 0, 15, 0, 26);
        });

        it("LABEL key=value  key2=value2", () => {
            let dockerfile = DockerfileParser.parse("LABEL key=value  key2=value2");
            let args = dockerfile.getInstructions()[0].getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "key=value");
            assert.equal(args[1].getValue(), "key2=value2");
            assert.equal(args[0].toString(), "key=value");
            assert.equal(args[1].toString(), "key2=value2");
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
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "value");
            assertRange(args[0].getRange(), 1, 4, 1, 8);
            assertRange(args[1].getRange(), 1, 9, 1, 13);
        });

        it("ENV var=value\\nRUN echo $var$var2", () => {
            let dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var$var2");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value$var2");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "value$var2");
            assertRange(args[0].getRange(), 1, 4, 1, 8);
            assertRange(args[1].getRange(), 1, 9, 1, 18);
        });

        it("ARG var=value\\nRUN echo $var$var2", () => {
            let dockerfile = DockerfileParser.parse("ARG var=value\nRUN echo $var$var2");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value$var2");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "value$var2");
            assertRange(args[0].getRange(), 1, 4, 1, 8);
            assertRange(args[1].getRange(), 1, 9, 1, 18);
        });

        it("RUN echo $var$var2\\nARG var=value\\nENV var=value2", () => {
            let dockerfile = DockerfileParser.parse("RUN echo $var$var2\nARG var=value\nENV var=value2");
            let args = dockerfile.getInstructions()[0].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "$var$var2");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "$var$var2");
            assertRange(args[0].getRange(), 0, 4, 0, 8);
            assertRange(args[1].getRange(), 0, 9, 0, 18);
        });

        it("ENV var=value \\ \\t\\r\\n var2=value2", () => {
            let dockerfile = DockerfileParser.parse("ENV var=value \\ \t\r\n var2=value2");
            let args = dockerfile.getInstructions()[0].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "var=value");
            assert.equal(args[1].getValue(), "var2=value2");
            assert.equal(args[0].toString(), "var=value");
            assert.equal(args[1].toString(), "var2=value2");
            assertRange(args[0].getRange(), 0, 4, 0, 13);
            assertRange(args[1].getRange(), 1, 1, 1, 12);
        });

        it("ENV variable defined in another build stage", () => {
            let dockerfile = DockerfileParser.parse("FROM alpine\nENV var=value\nFROM alpine\nRUN echo $var");
            let args = dockerfile.getInstructions()[3].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "$var");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "$var");
            assertRange(args[0].getRange(), 3, 4, 3, 8);
            assertRange(args[1].getRange(), 3, 9, 3, 13);
        });

        it("ARG variable defined in another build stage", () => {
            let dockerfile = DockerfileParser.parse("FROM alpine\nARG var=value\nFROM alpine\nRUN echo $var");
            let args = dockerfile.getInstructions()[3].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "$var");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "$var");
            assertRange(args[0].getRange(), 3, 4, 3, 8);
            assertRange(args[1].getRange(), 3, 9, 3, 13);
        });

        it("ARG variables being used in FROM", () => {
            let dockerfile = DockerfileParser.parse("ARG tag=8\nFROM node:$tag");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "node:8");
            assert.equal(args[0].toString(), "node:8");
            assertRange(args[0].getRange(), 1, 5, 1, 14);

            dockerfile = DockerfileParser.parse("ARG VERSION=latest\nFROM alpine:$VERSION");
            args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine:latest");
            assert.equal(args[0].toString(), "alpine:latest");
            assertRange(args[0].getRange(), 1, 5, 1, 20);

            dockerfile = DockerfileParser.parse("ARG version=atest\nFROM alpine:l$version");
            args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine:latest");
            assert.equal(args[0].toString(), "alpine:latest");
            assertRange(args[0].getRange(), 1, 5, 1, 21);

            dockerfile = DockerfileParser.parse("ARG atest=atest\nFROM alpine:l$atest");
            args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine:latest");
            assert.equal(args[0].toString(), "alpine:latest");
            assertRange(args[0].getRange(), 1, 5, 1, 19);

            dockerfile = DockerfileParser.parse("ARG DIGEST=sha256:7df6db5aa61ae9480f52f0b3a06a140ab98d427f86d8d5de0bedab9b8df6b1c0\nFROM alpine@$DIGEST");
            args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine@sha256:7df6db5aa61ae9480f52f0b3a06a140ab98d427f86d8d5de0bedab9b8df6b1c0");
            assert.equal(args[0].toString(), "alpine@sha256:7df6db5aa61ae9480f52f0b3a06a140ab98d427f86d8d5de0bedab9b8df6b1c0");
            assertRange(args[0].getRange(), 1, 5, 1, 19);

            dockerfile = DockerfileParser.parse("ARG alpine=latest\nARG node=8\nFROM alpine:$alpine\nFROM node:$node");
            args = dockerfile.getInstructions()[2].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "alpine:latest");
            assert.equal(args[0].toString(), "alpine:latest");
            assertRange(args[0].getRange(), 2, 5, 2, 19);
            args = dockerfile.getInstructions()[3].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "node:8");
            assert.equal(args[0].toString(), "node:8");
            assertRange(args[0].getRange(), 3, 5, 3, 15);
        });

        it("ARG variable inherits default value from ARG before FROM", () => {
            let dockerfile = DockerfileParser.parse("ARG var=value\nFROM alpine\nARG var\nRUN echo $var");
            let args = dockerfile.getInstructions()[3].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "value");
            assertRange(args[0].getRange(), 3, 4, 3, 8);
            assertRange(args[1].getRange(), 3, 9, 3, 13);

            dockerfile = DockerfileParser.parse("ARG var=value\nFROM alpine\nARG var=value2\nRUN echo $var");
            args = dockerfile.getInstructions()[3].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value2");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "value2");
            assertRange(args[0].getRange(), 3, 4, 3, 8);
            assertRange(args[1].getRange(), 3, 9, 3, 13);

            dockerfile = DockerfileParser.parse("ARG var=value\nFROM alpine\nARG var=value2\nARG var\nRUN echo $var");
            args = dockerfile.getInstructions()[4].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "value");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "value");
            assertRange(args[0].getRange(), 4, 4, 4, 8);
            assertRange(args[1].getRange(), 4, 9, 4, 13);
        });

        it("ARG variable does not inherit default value from ENV before FROM", () => {
            let dockerfile = DockerfileParser.parse("ENV var=value\nFROM alpine\nARG var\nRUN echo $var");
            let args = dockerfile.getInstructions()[3].getExpandedArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getValue(), "echo");
            assert.equal(args[1].getValue(), "$var");
            assert.equal(args[0].toString(), "echo");
            assert.equal(args[1].toString(), "$var");
            assertRange(args[0].getRange(), 3, 4, 3, 8);
            assertRange(args[1].getRange(), 3, 9, 3, 13);
        });

        it("FROM variables should not resolve against initial ENVs", () => {
            let dockerfile = DockerfileParser.parse("ENV image=alpine\nFROM $image");
            let args = dockerfile.getInstructions()[1].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "$image");
            assert.equal(args[0].toString(), "$image");
            assertRange(args[0].getRange(), 1, 5, 1, 11);
        });

        it("Closing quote around variable is not dropped", () => {
            let dockerfile = DockerfileParser.parse("FROM scratch\nARG ARG_VAR=1234\nEXPOSE \"$ARG_VAR\"");
            let args = dockerfile.getInstructions()[2].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "\"1234\"");
            assert.equal(args[0].toString(), "\"1234\"");
            assertRange(args[0].getRange(), 2, 7, 2, 17);
        });

        it("Closing apostrophe around variable is not dropped", () => {
            let dockerfile = DockerfileParser.parse("FROM scratch\nARG ARG_VAR=1234\nEXPOSE '$ARG_VAR'");
            let args = dockerfile.getInstructions()[2].getExpandedArguments();
            assert.equal(args.length, 1);
            assert.equal(args[0].getValue(), "'1234'");
            assert.equal(args[0].toString(), "'1234'");
            assertRange(args[0].getRange(), 2, 7, 2, 17);
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
