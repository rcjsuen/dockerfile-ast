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
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$image");
    });

    it("FROM $image\\ ", () => {
        let dockerfile = DockerfileParser.parse("FROM $image\\ ");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 0, 11);
        assertRange(variable.getRange(), 0, 5, 0, 11);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$image");
    });

    it("FROM $ima\\\\nge AS setup", () => {
        let dockerfile = DockerfileParser.parse("FROM $ima\\\nge AS setup");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 1, 2);
        assertRange(variable.getRange(), 0, 5, 1, 2);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$image");
    });

    it("FROM ${image}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image}");
    });

    it("FROM ${image:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 18);
        assert.equal(variable.getModifier(), "n");
        assertRange(variable.getModifierRange(), 0, 13, 0, 14);
        assert.equal(variable.getSubstitutionParameter(), "ode");
        assertRange(variable.getSubstitutionRange(), 0, 14, 0, 17);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:node}");
    });

    it("FROM ${image:+node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:+node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 19);
        assert.equal(variable.getModifier(), "+");
        assertRange(variable.getModifierRange(), 0, 13, 0, 14);
        assert.equal(variable.getSubstitutionParameter(), "node");
        assertRange(variable.getSubstitutionRange(), 0, 14, 0, 18);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:+node}");
    });

    it("FROM ${image:-node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:-node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 0, 19);
        assert.equal(variable.getModifier(), "-");
        assertRange(variable.getModifierRange(), 0, 13, 0, 14);
        assert.equal(variable.getSubstitutionParameter(), "node");
        assertRange(variable.getSubstitutionRange(), 0, 14, 0, 18);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:-node}");
    });

    it("FROM $im\\\\nage", () => {
        let dockerfile = DockerfileParser.parse("FROM $im\\\nage");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 3);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$image");
    });

    it("FROM $im\\\\n\\nage", () => {
        let dockerfile = DockerfileParser.parse("FROM $im\\\n\nage");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 2, 3);
        assertRange(variable.getRange(), 0, 5, 2, 3);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$image");
    });

    it("FROM $im\\\\n \\t\\r\\nage", () => {
        let dockerfile = DockerfileParser.parse("FROM $im\\\n \t\r\nage");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 6, 2, 3);
        assertRange(variable.getRange(), 0, 5, 2, 3);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$image");
    });

    it("FROM ${im\\\\nage}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\\nage}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 4);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image}");
    });

    it("FROM ${im\\\\nage:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\\nage:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 9);
        assert.equal(variable.getModifier(), "n");
        assertRange(variable.getModifierRange(), 1, 4, 1, 5);
        assert.equal(variable.getSubstitutionParameter(), "ode");
        assertRange(variable.getSubstitutionRange(), 1, 5, 1, 8);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:node}");
    });

    it("FROM ${im\\ \\t\\r\\nage:node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${im\\ \t\r\nage:node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 1, 3);
        assertRange(variable.getRange(), 0, 5, 1, 9);
        assert.equal(variable.getModifier(), "n");
        assertRange(variable.getModifierRange(), 1, 4, 1, 5);
        assert.equal(variable.getSubstitutionParameter(), "ode");
        assertRange(variable.getSubstitutionRange(), 1, 5, 1, 8);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:node}");
    });

    it("FROM ${image:no\\\\nde}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 3);
        assert.equal(variable.getModifier(), "n");
        assertRange(variable.getModifierRange(), 0, 13, 0, 14);
        assert.equal(variable.getSubstitutionParameter(), "ode");
        assertRange(variable.getSubstitutionRange(), 0, 14, 1, 2);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:node}");
    });

    it("FROM ${image:no\\ \\t\\r\\nde}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:no\\ \t\r\nde}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 3);
        assert.equal(variable.getModifier(), "n");
        assertRange(variable.getModifierRange(), 0, 13, 0, 14);
        assert.equal(variable.getSubstitutionParameter(), "ode");
        assertRange(variable.getSubstitutionRange(), 0, 14, 1, 2);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:node}");
    });

    it("FROM ${image:\\\\\n-node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:\\\n-node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 1, 6);
        assert.equal(variable.getModifier(), "-");
        assertRange(variable.getModifierRange(), 1, 0, 1, 1);
        assert.equal(variable.getSubstitutionParameter(), "node");
        assertRange(variable.getSubstitutionRange(), 1, 1, 1, 5);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:-node}");
    });

    it("FROM ${image:\\\\n\\n-node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:\\\n\n-node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 2, 6);
        assert.equal(variable.getModifier(), "-");
        assertRange(variable.getModifierRange(), 2, 0, 2, 1);
        assert.equal(variable.getSubstitutionParameter(), "node");
        assertRange(variable.getSubstitutionRange(), 2, 1, 2, 5);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:-node}");
    });

    it("FROM ${image:\\\\n \\t\\r\\n-node}", () => {
        let dockerfile = DockerfileParser.parse("FROM ${image:\\\n \t\r\n-node}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");
        assertRange(variable.getNameRange(), 0, 7, 0, 12);
        assertRange(variable.getRange(), 0, 5, 2, 6);
        assert.equal(variable.getModifier(), "-");
        assertRange(variable.getModifierRange(), 2, 0, 2, 1);
        assert.equal(variable.getSubstitutionParameter(), "node");
        assertRange(variable.getSubstitutionRange(), 2, 1, 2, 5);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${image:-node}");
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
        assert.equal(variables[0].getModifier(), null);
        assert.equal(variables[1].getModifier(), null);
        assert.equal(variables[0].getModifierRange(), null);
        assert.equal(variables[1].getModifierRange(), null);
        assert.equal(variables[0].getSubstitutionParameter(), null);
        assert.equal(variables[1].getSubstitutionParameter(), null);
        assert.equal(variables[0].getSubstitutionRange(), null);
        assert.equal(variables[1].getSubstitutionRange(), null);
        assert.equal(variables[0].isDefined(), false);
        assert.equal(variables[1].isDefined(), false);
        assert.equal(variables[0].isBuildVariable(), false);
        assert.equal(variables[1].isBuildVariable(), false);
        assert.equal(variables[0].isEnvironmentVariable(), false);
        assert.equal(variables[1].isEnvironmentVariable(), false);
        assert.equal(variables[0].toString(), "$image");
        assert.equal(variables[1].toString(), "$image2");
    });

    it("FROM $image\\\\n $image2", () => {
        let dockerfile = DockerfileParser.parse("FROM $image\\\n $image2");
        let variables = dockerfile.getInstructions()[0].getVariables();
        assert.equal(variables[0].getName(), "image");
        assert.equal(variables[1].getName(), "image2");
        assertRange(variables[0].getNameRange(), 0, 6, 0, 11);
        assertRange(variables[1].getNameRange(), 1, 2, 1, 8);
        assertRange(variables[0].getRange(), 0, 5, 0, 11);
        assertRange(variables[1].getRange(), 1, 1, 1, 8);
        assert.equal(variables[0].getModifier(), null);
        assert.equal(variables[1].getModifier(), null);
        assert.equal(variables[0].getModifierRange(), null);
        assert.equal(variables[1].getModifierRange(), null);
        assert.equal(variables[0].getSubstitutionParameter(), null);
        assert.equal(variables[1].getSubstitutionParameter(), null);
        assert.equal(variables[0].getSubstitutionRange(), null);
        assert.equal(variables[1].getSubstitutionRange(), null);
        assert.equal(variables[0].isDefined(), false);
        assert.equal(variables[1].isDefined(), false);
        assert.equal(variables[0].isBuildVariable(), false);
        assert.equal(variables[1].isBuildVariable(), false);
        assert.equal(variables[0].isEnvironmentVariable(), false);
        assert.equal(variables[1].isEnvironmentVariable(), false);
        assert.equal(variables[0].toString(), "$image");
        assert.equal(variables[1].toString(), "$image2");
    });

    it("EXPOSE $po\\rt", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $po\\rt");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "po");
        assertRange(variable.getNameRange(), 0, 8, 0, 10);
        assertRange(variable.getRange(), 0, 7, 0, 10);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$po");
    });

    it("EXPOSE $port\\$port2", () => {
        let dockerfile = DockerfileParser.parse("EXPOSE $port\\$port2");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");
        assertRange(variable.getNameRange(), 0, 8, 0, 12);
        assertRange(variable.getRange(), 0, 7, 0, 12);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$port");
    });

    it("RUN echo \\a $port", () => {
        let dockerfile = DockerfileParser.parse("RUN echo \\a $port");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");
        assertRange(variable.getNameRange(), 0, 13, 0, 17);
        assertRange(variable.getRange(), 0, 12, 0, 17);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$port");
    });

    it("RUN echo ${}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 12);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${}");
    });

    it("RUN echo ${:}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${:}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 13);
        assert.equal(variable.getModifier(), "");
        assertRange(variable.getModifierRange(), 0, 12, 0, 12);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${:}");
    });

    it("RUN echo ${::}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${::}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 14);
        assert.equal(variable.getModifier(), ":");
        assertRange(variable.getModifierRange(), 0, 12, 0, 13);
        assert.equal(variable.getSubstitutionParameter(), "");
        assertRange(variable.getSubstitutionRange(), 0, 13, 0, 13);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${::}");
    });

    it("RUN echo ${:::}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${:::}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 15);
        assert.equal(variable.getModifier(), ":");
        assertRange(variable.getModifierRange(), 0, 12, 0, 13);
        assert.equal(variable.getSubstitutionParameter(), ":");
        assertRange(variable.getSubstitutionRange(), 0, 13, 0, 14);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${:::}");
    });

    it("RUN echo ${::abc}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${::abc}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 17);
        assert.equal(variable.getModifier(), ":");
        assertRange(variable.getModifierRange(), 0, 12, 0, 13);
        assert.equal(variable.getSubstitutionParameter(), "abc");
        assertRange(variable.getSubstitutionRange(), 0, 13, 0, 16);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${::abc}");
    });

    it("RUN echo ${:::abc}", () => {
        let dockerfile = DockerfileParser.parse("RUN echo ${:::abc}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
        assertRange(variable.getRange(), 0, 9, 0, 18);
        assert.equal(variable.getModifier(), ":");
        assertRange(variable.getModifierRange(), 0, 12, 0, 13);
        assert.equal(variable.getSubstitutionParameter(), ":abc");
        assertRange(variable.getSubstitutionRange(), 0, 13, 0, 17);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${:::abc}");
    });

    it("ARG aaa=${bbb:\\\\n\\n-\\\\nimage\\\\n}", () => {
        let dockerfile = DockerfileParser.parse("ARG aaa=${bbb:\\\n\n-\\\nimage\\\n}");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "bbb");
        assertRange(variable.getNameRange(), 0, 10, 0, 13);
        assertRange(variable.getRange(), 0, 8, 4, 1);
        assert.equal(variable.getModifier(), "-");
        assertRange(variable.getModifierRange(), 2, 0, 2, 1);
        assert.equal(variable.getSubstitutionParameter(), "image");
        assertRange(variable.getSubstitutionRange(), 3, 0, 3, 5);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "${bbb:-image}");
    });

    it("defined ARG variable", () => {
        let dockerfile = DockerfileParser.parse("ARG var=value\nRUN echo $var");
        let variable = dockerfile.getInstructions()[1].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 1, 10, 1, 13);
        assertRange(variable.getRange(), 1, 9, 1, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), true);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$var");
    });

    it("defined ARG variable in another image", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nARG var=value\nFROM alpine\nRUN echo $var");
        let variable = dockerfile.getInstructions()[3].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 3, 10, 3, 13);
        assertRange(variable.getRange(), 3, 9, 3, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$var");
    });

    it("defined ARG variable before FROM", () => {
        let dockerfile = DockerfileParser.parse("ARG var=value\nFROM alpine\nRUN echo $var");
        let variable = dockerfile.getInstructions()[2].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 2, 10, 2, 13);
        assertRange(variable.getRange(), 2, 9, 2, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$var");
    });

    it("defined ENV variable", () => {
        let dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var");
        let variable = dockerfile.getInstructions()[1].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 1, 10, 1, 13);
        assertRange(variable.getRange(), 1, 9, 1, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), true);
        assert.equal(variable.toString(), "$var");
    });

    it("defined ENV variable in another image", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine\nENV var=value\nFROM alpine\nRUN echo $var");
        let variable = dockerfile.getInstructions()[3].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 3, 10, 3, 13);
        assertRange(variable.getRange(), 3, 9, 3, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), false);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), false);
        assert.equal(variable.toString(), "$var");
    });

    it("defined ARG and ENV variable", () => {
        let dockerfile = DockerfileParser.parse("ARG var=arg\nENV var=env\nRUN echo $var");
        let variable = dockerfile.getInstructions()[2].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 2, 10, 2, 13);
        assertRange(variable.getRange(), 2, 9, 2, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), true);
        assert.equal(variable.toString(), "$var");
    });

    it("defined ENV and ARG variable", () => {
        let dockerfile = DockerfileParser.parse("ENV var=env\nARG var=arg\nRUN echo $var");
        let variable = dockerfile.getInstructions()[2].getVariables()[0];
        assert.equal(variable.getName(), "var");
        assertRange(variable.getNameRange(), 2, 10, 2, 13);
        assertRange(variable.getRange(), 2, 9, 2, 13);
        assert.equal(variable.getModifier(), null);
        assert.equal(variable.getModifierRange(), null);
        assert.equal(variable.getSubstitutionParameter(), null);
        assert.equal(variable.getSubstitutionRange(), null);
        assert.equal(variable.isDefined(), true);
        assert.equal(variable.isBuildVariable(), false);
        assert.equal(variable.isEnvironmentVariable(), true);
        assert.equal(variable.toString(), "$var");
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
                assert.equal(variable.getModifier(), null);
                assert.equal(variable.getModifierRange(), null);
                assert.equal(variable.getSubstitutionParameter(), null);
                assert.equal(variable.getSubstitutionRange(), null);
                assert.equal(variable.isDefined(), false);
                assert.equal(variable.isBuildVariable(), false);
                assert.equal(variable.isEnvironmentVariable(), false);
                assert.equal(variable.toString(), simple);
            });

            let brackets = "${" + defaultVariable + "}";
            it(brackets, () => {
                let dockerfile = DockerfileParser.parse("RUN echo " + brackets);
                let variable = dockerfile.getInstructions()[0].getVariables()[0];
                assert.equal(variable.getName(), defaultVariable);
                assertRange(variable.getNameRange(), 0, 11, 0, 11 + defaultVariable.length);
                assertRange(variable.getRange(), 0, 9, 0, 9 + brackets.length);
                assert.equal(variable.getModifier(), null);
                assert.equal(variable.getModifierRange(), null);
                assert.equal(variable.getSubstitutionParameter(), null);
                assert.equal(variable.getSubstitutionRange(), null);
                assert.equal(variable.isDefined(), false);
                assert.equal(variable.isBuildVariable(), false);
                assert.equal(variable.isEnvironmentVariable(), false);
                assert.equal(variable.toString(), brackets);
            });
        }
    });
});
