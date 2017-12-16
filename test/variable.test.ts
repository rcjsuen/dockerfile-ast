/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import { Position } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Variable", () => {
    it("getName", () => {
        let dockerfile = DockerfileParser.parse("FROM $image");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${image}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${image:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM $im\\\nage");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${im\\\nage}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${im\\\nage:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${im\\ \t\r\nage:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM ${image:no\\ \t\r\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "image");

        dockerfile = DockerfileParser.parse("FROM $image$image2");
        let variables = dockerfile.getInstructions()[0].getVariables();
        assert.equal(variables[0].getName(), "image");
        assert.equal(variables[1].getName(), "image2");

        dockerfile = DockerfileParser.parse("EXOPSE $po\\rt");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "po");

        dockerfile = DockerfileParser.parse("EXOPSE $port\\$port2");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");

        dockerfile = DockerfileParser.parse("RUN echo \\a $port");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "port");

        dockerfile = DockerfileParser.parse("RUN echo ${}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");

        dockerfile = DockerfileParser.parse("RUN echo ${:}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");

        dockerfile = DockerfileParser.parse("RUN echo ${::}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assert.equal(variable.getName(), "");
    });

    it("getNameRange", () => {
        let dockerfile = DockerfileParser.parse("FROM $image");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 6, 0, 11);

        dockerfile = DockerfileParser.parse("FROM $image\\ ");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 6, 0, 11);

        dockerfile = DockerfileParser.parse("FROM ${image}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 0, 12);

        dockerfile = DockerfileParser.parse("FROM ${image:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 0, 12);

        dockerfile = DockerfileParser.parse("FROM $im\\\nage");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 6, 1, 3);

        dockerfile = DockerfileParser.parse("FROM ${im\\\nage}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 1, 3);

        dockerfile = DockerfileParser.parse("FROM ${im\\ \t\r\nage:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 1, 3);

        dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 0, 12);

        dockerfile = DockerfileParser.parse("FROM ${image:no\\ \t\r\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 0, 12);

        dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 7, 0, 12);

        dockerfile = DockerfileParser.parse("FROM $image$image2");
        let variables = dockerfile.getInstructions()[0].getVariables();
        assertRange(variables[0].getNameRange(), 0, 6, 0, 11);
        assertRange(variables[1].getNameRange(), 0, 12, 0, 18);

        dockerfile = DockerfileParser.parse("EXOPSE $po\\rt");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 8, 0, 10);

        dockerfile = DockerfileParser.parse("EXOPSE $port\\$port2");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 8, 0, 12);

        dockerfile = DockerfileParser.parse("RUN echo \\a $port");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 13, 0, 17);

        dockerfile = DockerfileParser.parse("RUN echo ${}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 11, 0, 11);

        dockerfile = DockerfileParser.parse("RUN echo ${:}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 11, 0, 11);

        dockerfile = DockerfileParser.parse("RUN echo ${::}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getNameRange(), 0, 11, 0, 11);
    });

    it("getRange", () => {
        let dockerfile = DockerfileParser.parse("FROM $image");
        let variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 0, 11);

        dockerfile = DockerfileParser.parse("FROM ${image}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 0, 13);

        dockerfile = DockerfileParser.parse("FROM ${image:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 0, 18);

        dockerfile = DockerfileParser.parse("FROM $im\\\nage");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 1, 3);

        dockerfile = DockerfileParser.parse("FROM ${im\\\nage}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 1, 4);

        dockerfile = DockerfileParser.parse("FROM ${im\\\nage:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 1, 9);

        dockerfile = DockerfileParser.parse("FROM ${im\\ \t\r\nage:node}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 1, 9);

        dockerfile = DockerfileParser.parse("FROM ${image:no\\\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 1, 3);

        dockerfile = DockerfileParser.parse("FROM ${image:no\\ \t\r\nde}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 5, 1, 3);

        dockerfile = DockerfileParser.parse("FROM $image$image2");
        let variables = dockerfile.getInstructions()[0].getVariables();
        assertRange(variables[0].getRange(), 0, 5, 0, 11);
        assertRange(variables[1].getRange(), 0, 11, 0, 18);

        dockerfile = DockerfileParser.parse("EXOPSE $po\\rt");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 7, 0, 10);

        dockerfile = DockerfileParser.parse("EXOPSE $port\\$port2");
        variable = dockerfile.getInstructions()[0].getVariables()[0];

        dockerfile = DockerfileParser.parse("RUN echo \\a $port");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 12, 0, 17);

        dockerfile = DockerfileParser.parse("RUN echo ${}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 9, 0, 12);

        dockerfile = DockerfileParser.parse("RUN echo ${:}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 9, 0, 13);

        dockerfile = DockerfileParser.parse("RUN echo ${::}");
        variable = dockerfile.getInstructions()[0].getVariables()[0];
        assertRange(variable.getRange(), 0, 9, 0, 14);
    });
});
