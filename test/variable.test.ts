/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import { Position } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser, DefaultVariables } from '../src/main';

describe("Variable", () => {
    it("FROM $image", () => {
        let dockerfile = DockerfileParser.parse("FROM $image");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 0, 11);
        assertRange(variable.getRange(), 0, 5, 0, 11);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM $image\\ ", () => {
        let dockerfile = DockerfileParser.parse("FROM $image\\ ");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 0, 11);
        assertRange(variable.getRange(), 0, 5, 0, 11);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${image}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 13);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${image:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 18);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM $im\\\\nage", () => {
        let dockerfile = DockerfileParser.parse("FROM $im\\\nage");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 3);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${im\\\\nage}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\\nage}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 4);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${im\\\\nage:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\\nage:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 9);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${im\\ \\t\\r\\nage:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\ \t\r\nage:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 9);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${image:no\\\\nde}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 3);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM ${image:no\\ \\t\\r\\nde}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:no\\ \t\r\nde}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 3);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("FROM $image$image2", () => {
        let dockerfile = DockerfileParser.parse("FROM $image$image2");
        let variables = dockerfile.getInstructions()[0].getVariables();
        assert.equal(variables[0].getName(), "image");
        assert.equal(variables[1].getName(), "image2");
        assertRange(variables[0].getNameRange(), 0, 6, 0, 11);
        assertRange(variables[1].getNameRange(), 0, 12, 0, 18);
        assertRange(variables[0].getRange(), 0, 5, 0, 11);
        assertRange(variables[1].getRange(), 0, 11, 0, 18);
        assert.equal(variables[0].isDefined(), false);
        assert.equal(variables[1].isDefined(), false);
        assert.equal(variables[0].isBuildVariable(), false);
        assert.equal(variables[1].isBuildVariable(), false);
        assert.equal(variables[0].isEnvironmentVariable(), false);
        assert.equal(variables[1].isEnvironmentVariable(), false);
    });

    it("EXPOSE $po\\rt", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $po\\rt");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "po");
        assertRange(variable.getNameRange(), 0, 8, 0, 10);
        assertRange(variable.getRange(), 0, 7, 0, 10);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("EXPOSE $port\\$port2", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $port\\$port2");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");
        assertRange(variable.getNameRange(), 0, 8, 0, 12);
        assertRange(variable.getRange(), 0, 7, 0, 12);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("RUN echo \\a $port", () => {
        let dockerfile = DockerfileParser.parse("RUN echo \\a $port");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");
        assertRange(variable.getNameRange(), 0, 13, 0, 17);
        assertRange(variable.getRange(), 0, 12, 0, 17);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("RUN echo ${}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 12);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("RUN echo ${:}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${:}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 13);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("RUN echo ${::}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${::}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 14);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("defined ARG variable", () => {
        let dockerfile = DockerfileParser.parse("ARG var=value\nRUN echo $var");
        let variable = dockerfile.getInstructions()[1].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 1, 10, 1, 13);
        assertRange(variable.getRange(), 1, 9, 1, 13);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), true);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("defined ARG variable in another image", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nARG var=value\nFROM alpine\nRUN echo $var");
        let variable = dockerfile.getInstructions()[3].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 3, 10, 3, 13);
        assertRange(variable.getRange(), 3, 9, 3, 13);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("defined ENV variable", () => {
        let dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var");
        let variable = dockerfile.getInstructions()[1].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 1, 10, 1, 13);
        assertRange(variable.getRange(), 1, 9, 1, 13);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), true);
    });

    it("defined ENV variable in another image", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nENV var=value\nFROM alpine\nRUN echo $var");
        let variable = dockerfile.getInstructions()[3].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 3, 10, 3, 13);
        assertRange(variable.getRange(), 3, 9, 3, 13);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
    });

    it("defined ARG and ENV variable", () => {
        let dockerfile = DockerfileParser.parse("ARG var=arg\nENV var=env\nRUN echo $var");
        let variable = dockerfile.getInstructions()[2].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 2, 10, 2, 13);
        assertRange(variable.getRange(), 2, 9, 2, 13);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), true);
    });

    it("defined ENV and ARG variable", () => {
        let dockerfile = DockerfileParser.parse("ENV var=env\nARG var=arg\nRUN echo $var");
        let variable = dockerfile.getInstructions()[2].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 2, 10, 2, 13);
        assertRange(variable.getRange(), 2, 9, 2, 13);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), true);
    });

    describe("default variables", () => {
        for (let defaultVariable of DefaultVariables) {
            let simple = "$" + defaultVariable;
            it(simple, () => {
                let dockerfile = DockerfileParser.parse("RUN echo " + simple);
                let variable = dockerfile.getInstructions()[0].getVariables()[0];
                assert.equal(variable.getName(), defaultVariable);
                assertRange(variable.getNameRange(), 0, 10, 0, 10 + defaultVariable.length);
                assertRange(variable.getRange(), 0, 9, 0, 9 + simple.length);
                assert.equal(variable.isDefined(), false);
                assert.equal(variable.isBuildVariable(), false);
                assert.equal(variable.isEnvironmentVariable(), false);
            });

            let brackets = "${" + defaultVariable + "}";
            it(brackets, () => {
                let dockerfile = DockerfileParser.parse("RUN echo " + brackets);
                let variable = dockerfile.getInstructions()[0].getVariables()[0];
                assert.equal(variable.getName(), defaultVariable);
                assertRange(variable.getNameRange(), 0, 11, 0, 11 + defaultVariable.length);
                assertRange(variable.getRange(), 0, 9, 0, 9 + brackets.length);
                assert.equal(variable.isDefined(), false);
                assert.equal(variable.isBuildVariable(), false);
                assert.equal(variable.isEnvironmentVariable(), false);
            });
        }
    });
});
