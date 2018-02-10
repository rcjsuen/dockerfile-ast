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
            let dockerfile = DockerfileParser.parse(" FROM node");
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
            assert.equal(dockerfile.contains(Position.create(0, 0)), false);
            assert.equal(dockerfile.contains(Position.create(0, 15)), false);
            assert.equal(dockerfile.contains(Position.create(0, 1)), false);
            assert.equal(dockerfile.contains(Position.create(0, 4)), false);
            assert.equal(dockerfile.contains(Position.create(0, 10)), false);
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
        });
    });

    describe("build stage", () => {
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
