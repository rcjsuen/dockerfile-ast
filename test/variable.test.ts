/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import { Position } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Variable", () => {
    it("FROM $image", () => {
        let dockerfile = DockerfileParser.parse("FROM $image");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 0, 11);
        assertRange(variable.getRange(), 0, 5, 0, 11);
    });

    it("FROM $image\\ ", () => {
        let dockerfile = DockerfileParser.parse("FROM $image\\ ");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 0, 11);
        assertRange(variable.getRange(), 0, 5, 0, 11);
    });

    it("FROM ${image}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 13);
    });

    it("FROM ${image:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 18);
    });

    it("FROM $im\\\\nage", () => {
        let dockerfile = DockerfileParser.parse("FROM $im\\\nage");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 3);
    });

    it("FROM ${im\\\\nage}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\\nage}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 4);
    });

    it("FROM ${im\\\\nage:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\\nage:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 9);
    });

    it("FROM ${im\\ \\t\\r\\nage:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\ \t\r\nage:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 9);
    });

    it("FROM ${image:no\\\\nde}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 3);
    });

    it("FROM ${image:no\\ \\t\\r\\nde}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:no\\ \t\r\nde}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 3);
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
    });

    it("EXPOSE $po\\rt", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $po\\rt");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "po");
        assertRange(variable.getNameRange(), 0, 8, 0, 10);
        assertRange(variable.getRange(), 0, 7, 0, 10);
    });

    it("EXPOSE $port\\$port2", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $port\\$port2");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");
        assertRange(variable.getNameRange(), 0, 8, 0, 12);
        assertRange(variable.getRange(), 0, 7, 0, 12);
    });

    it("RUN echo \\a $port", () => {
        let dockerfile = DockerfileParser.parse("RUN echo \\a $port");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");
        assertRange(variable.getNameRange(), 0, 13, 0, 17);
        assertRange(variable.getRange(), 0, 12, 0, 17);
    });

    it("RUN echo ${}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 12);
    });

    it("RUN echo ${:}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${:}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 13);
    });

    it("RUN echo ${::}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${::}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 14);
    });
});
