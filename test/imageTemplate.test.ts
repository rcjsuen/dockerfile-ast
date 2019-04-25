/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { Position, Range } from 'vscode-languageserver-types';
import { DockerfileParser } from '../src/main';
import { assertRange } from './util';

describe("ImageTemplate", () => {
    describe("dockerfile", () => {
        it("contains", () => {
            let dockerfile = DockerfileParser.parse("");
            assert.equal(dockerfile.contains(Position.create(0, 0)), false);

            dockerfile = DockerfileParser.parse("# escape=`");
            assert.equal(dockerfile.contains(Position.create(0, 5)), true);

            dockerfile = DockerfileParser.parse("# escape=`\nFROM node");
            assert.equal(dockerfile.contains(Position.create(0, 5)), true);

            dockerfile = DockerfileParser.parse("# comment");
            assert.equal(dockerfile.contains(Position.create(0, 5)), true);

            dockerfile = DockerfileParser.parse("# comment\nFROM node");
            assert.equal(dockerfile.contains(Position.create(0, 5)), true);

            dockerfile = DockerfileParser.parse("FROM node\n# comment");
            assert.equal(dockerfile.contains(Position.create(0, 5)), true);

            dockerfile = DockerfileParser.parse("FROM node\n# comment\nRUN echo");
            assert.equal(dockerfile.contains(Position.create(0, 5)), true);

            dockerfile = DockerfileParser.parse(" FROM node");
            assert.equal(dockerfile.contains(Position.create(0, 1)), true);
            assert.equal(dockerfile.contains(Position.create(0, 4)), true);
            assert.equal(dockerfile.contains(Position.create(0, 10)), true);
            assert.equal(dockerfile.contains(Position.create(1, 0)), false);
            assert.equal(dockerfile.contains(Position.create(0, 0)), false);
            assert.equal(dockerfile.contains(Position.create(0, 15)), false);

            dockerfile = DockerfileParser.parse("# comment\nFROM node\nFROM alpine\nFROM busybox\n# comment");
            assert.equal(dockerfile.contains(Position.create(1, 0)), true);
            assert.equal(dockerfile.contains(Position.create(2, 0)), true);
            assert.equal(dockerfile.contains(Position.create(3, 0)), true);
            assert.equal(dockerfile.contains(Position.create(0, 0)), true);
            assert.equal(dockerfile.contains(Position.create(0, 15)), true);
            assert.equal(dockerfile.contains(Position.create(0, 1)), true);
            assert.equal(dockerfile.contains(Position.create(0, 4)), true);
            assert.equal(dockerfile.contains(Position.create(0, 10)), true);
        });

        it("getCMDs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nEXPOSE 8080\ncmd ls");
            let cmds = dockerfile.getCMDs();
            assert.equal(cmds.length, 1);
            assert.equal(cmds[0].getInstruction(), "cmd");
            assert.equal(cmds[0].getKeyword(), "CMD");
        });

        it("getCOPYs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nEXPOSE 8080\ncopy . .");
            let copies = dockerfile.getCOPYs();
            assert.equal(copies.length, 1);
            assert.equal(copies[0].getInstruction(), "copy");
            assert.equal(copies[0].getKeyword(), "COPY");
        });

        it("getENTRYPOINTs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nEXPOSE 8080\nentrypoint ls");
            let entrypoints = dockerfile.getENTRYPOINTs();
            assert.equal(entrypoints.length, 1);
            assert.equal(entrypoints[0].getInstruction(), "entrypoint");
            assert.equal(entrypoints[0].getKeyword(), "ENTRYPOINT");
        });

        it("getFROMs", () => {
            let dockerfile = DockerfileParser.parse("from node\nEXPOSE 8080");
            let froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getInstruction(), "from");
            assert.equal(froms[0].getKeyword(), "FROM");
        });

        it("getOnbuildTriggers", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nONBUILD expose 8080\nONBUILD");
            let triggers = dockerfile.getOnbuildTriggers();
            assert.equal(triggers.length, 1);
            assert.equal(triggers[0].getInstruction(), "expose");
            assert.equal(triggers[0].getKeyword(), "EXPOSE");
            assertRange(triggers[0].getRange(), 1, 8, 1, 19);
        });

        it("getAvailableVariables", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nARG var=value\nENV var=value\nRUN echo $var");
            let variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "var");
            variables = dockerfile.getAvailableVariables(3);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "var");

            dockerfile = DockerfileParser.parse("FROM node\nARG var=value\nENV var2=value\nRUN echo $var");
            variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "var");
            variables = dockerfile.getAvailableVariables(3);
            assert.equal(variables.length, 2);
            assert.equal(variables[0], "var");
            assert.equal(variables[1], "var2");

            dockerfile = DockerfileParser.parse("FROM node\nARG\nENV var=value\nRUN echo $var");
            variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(3);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "var");

            dockerfile = DockerfileParser.parse("FROM node\nARG var=value\nARG var=value2\nRUN echo $var");
            variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "var");
            variables = dockerfile.getAvailableVariables(3);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "var");

            dockerfile = DockerfileParser.parse("ARG tag=1.0\nFROM alpine\nFROM busybox");
            variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "tag");
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 1);
            assert.equal(variables[0], "tag");

            // invalid line numbers that are outside the parsed Dockerfile
            dockerfile = DockerfileParser.parse("FROM node");
            variables = dockerfile.getAvailableVariables(-1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);

            dockerfile = DockerfileParser.parse("ARG\nFROM node");
            variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
        });

        it("getComments", () => {
            let dockerfile = DockerfileParser.parse("FROM scratch\n# comment\nRUN echo \"$VAR\"");
            let image = dockerfile.getContainingImage({ line: 2, character: 1 });
            assert.equal(image.getComments().length, 1);

            dockerfile = DockerfileParser.parse("# comment\nFROM scratch");
            image = dockerfile.getContainingImage({ line: 1, character: 1 });
            assert.equal(image.getComments().length, 0);

            dockerfile = DockerfileParser.parse("# comment\nARG image=test\nFROM scratch");
            image = dockerfile.getContainingImage({ line: 0, character: 1 });
            assert.equal(image.getComments().length, 1);
            image = dockerfile.getContainingImage({ line: 1, character: 1 });
            assert.equal(image.getComments().length, 0);
            image = dockerfile.getContainingImage({ line: 2, character: 1 });
            assert.equal(image.getComments().length, 0);
        });

        it("getRange", () => {
            let dockerfile = DockerfileParser.parse("FROM node");
            assertRange(dockerfile.getRange(), 0, 0, 0, 9);
            let image = dockerfile.getContainingImage(Position.create(0, 0));
            assertRange(image.getRange(), 0, 0, 0, 9);

            dockerfile = DockerfileParser.parse("FROM node\nFROM alpine");
            assertRange(dockerfile.getRange(), 0, 0, 1, 11);
            image = dockerfile.getContainingImage(Position.create(0, 0));
            assertRange(image.getRange(), 0, 0, 0, 9);
            image = dockerfile.getContainingImage(Position.create(1, 9));
            assertRange(image.getRange(), 1, 0, 1, 11);

            dockerfile = DockerfileParser.parse("FROM node\n# comment\nFROM alpine");
            assertRange(dockerfile.getRange(), 0, 0, 2, 11);
            image = dockerfile.getContainingImage(Position.create(0, 0));
            assertRange(image.getRange(), 0, 0, 0, 9);
            image = dockerfile.getContainingImage(Position.create(1, 5));
            assertRange(image.getRange(), 0, 0, 2, 11);
            image = dockerfile.getContainingImage(Position.create(2, 9));
            assertRange(image.getRange(), 2, 0, 2, 11);

            dockerfile = DockerfileParser.parse("#escape=`");
            assertRange(dockerfile.getRange(), 0, 0, 0, 9);
            image = dockerfile.getContainingImage(Position.create(0, 1));
            assertRange(image.getRange(), 0, 0, 0, 9);

            dockerfile = DockerfileParser.parse(" #escape=`");
            assertRange(dockerfile.getRange(), 0, 1, 0, 10);
            image = dockerfile.getContainingImage(Position.create(0, 2));
            assertRange(image.getRange(), 0, 1, 0, 10);

            dockerfile = DockerfileParser.parse("# comment");
            assertRange(dockerfile.getRange(), 0, 0, 0, 9);
            image = dockerfile.getContainingImage(Position.create(0, 1));
            assertRange(image.getRange(), 0, 0, 0, 9);
        });
    });

    describe("build stage", () => {
        it("getComments", () => {
            let dockerfile = DockerfileParser.parse("FROM scratch\nFROM scratch\n# comment\nRUN echo \"$VAR\"");
            let image = dockerfile.getContainingImage({ line: 3, character: 1 });
            assert.equal(image.getComments().length, 1);

            dockerfile = DockerfileParser.parse("FROM scratch\n# comment\nRUN echo\nFROM scratch\n# comment\nRUN echo");
            image = dockerfile.getContainingImage({ line: 0, character: 1 });
            assert.equal(image.getComments().length, 1);
            image = dockerfile.getContainingImage({ line: 3, character: 1 });
            assert.equal(image.getComments().length, 1);
        });

        it("getCMDs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nCMD ls\nFROM alpine\nCMD ls\nCMD pwd");
            assert.equal(dockerfile.getCMDs().length, 3);
            let image = dockerfile.getContainingImage(Position.create(0, 0));
            assert.equal(image.getCMDs().length, 1);
            image = dockerfile.getContainingImage(Position.create(2, 0));
            assert.equal(image.getCMDs().length, 2);
        });

        it("getCOPYs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nCOPY . .\nFROM alpine\nCOPY . .\nCOPY . .");
            assert.equal(dockerfile.getCOPYs().length, 3);
            let image = dockerfile.getContainingImage(Position.create(0, 0));
            assert.equal(image.getCOPYs().length, 1);
            image = dockerfile.getContainingImage(Position.create(2, 0));
            assert.equal(image.getCOPYs().length, 2);
        });

        it("getENTRYPOINTs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nENTRYPOINT ls\nFROM alpine\nENTRYPOINT ls\nENTRYPOINT ls");
            assert.equal(dockerfile.getENTRYPOINTs().length, 3);
            let image = dockerfile.getContainingImage(Position.create(0, 0));
            assert.equal(image.getENTRYPOINTs().length, 1);
            image = dockerfile.getContainingImage(Position.create(2, 0));
            assert.equal(image.getENTRYPOINTs().length, 2);
        });

        it("getFROMs", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nFROM alpine");
            assert.equal(dockerfile.getFROMs().length, 2);
            let image = dockerfile.getContainingImage(Position.create(0, 0));
            assert.equal(image.getFROMs().length, 1);
            image = dockerfile.getContainingImage(Position.create(1, 0));
            assert.equal(image.getFROMs().length, 1);
        });

        it("getOnbuildTriggers", () => {
            let dockerfile = DockerfileParser.parse(
                "FROM node\nONBUILD expose 8080\nONBUILD EXPOSE 80801\nONBUILD\n" +
                "FROM node\nONBUILD expose 8080\nonbuild"
            );
            assert.equal(dockerfile.getOnbuildTriggers().length, 3);
            let image = dockerfile.getContainingImage(Position.create(0, 0));
            assert.equal(image.getOnbuildTriggers().length, 2);
            image = dockerfile.getContainingImage(Position.create(4, 0));
            assert.equal(image.getOnbuildTriggers().length, 1);
        });

        it("getAvailableVariables", () => {
            let dockerfile = DockerfileParser.parse("FROM node\nARG var=value\nFROM node\nRUN echo $var");
            let variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(3);
            assert.equal(variables.length, 0);

            let image = dockerfile.getContainingImage(Position.create(0, 0));
            let image2 = dockerfile.getContainingImage(Position.create(2, 0));
            variables = image.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = image.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = image2.getAvailableVariables(2);
            assert.equal(variables.length, 0);
            variables = image2.getAvailableVariables(3);
            assert.equal(variables.length, 0);

            dockerfile = DockerfileParser.parse("FROM node\nENV var=value\nFROM node\nRUN echo $var");
            variables = dockerfile.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(2);
            assert.equal(variables.length, 0);
            variables = dockerfile.getAvailableVariables(3);
            assert.equal(variables.length, 0);

            image = dockerfile.getContainingImage(Position.create(0, 0));
            image2 = dockerfile.getContainingImage(Position.create(2, 0));
            variables = image.getAvailableVariables(0);
            assert.equal(variables.length, 0);
            variables = image.getAvailableVariables(1);
            assert.equal(variables.length, 0);
            variables = image2.getAvailableVariables(2);
            assert.equal(variables.length, 0);
            variables = image2.getAvailableVariables(3);
            assert.equal(variables.length, 0);
        });
    });
});
