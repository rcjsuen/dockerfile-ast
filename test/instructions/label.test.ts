/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser } from '../../src/main';

describe("LABEL", () => {
    it("getVariables", () => {
        let dockerfile = DockerfileParser.parse("LABEL key=$value");
        let label = dockerfile.getInstructions()[0];
        let variables = label.getVariables();
        assert.equal(variables.length, 1);
        assert.equal(variables[0].getName(), "value");
        assertRange(variables[0].getNameRange(), 0, 11, 0, 16);
        assertRange(variables[0].getRange(), 0, 10, 0, 16);

        dockerfile = DockerfileParser.parse("LABEL key=\"$value\"");
        label = dockerfile.getInstructions()[0];
        variables = label.getVariables();
        assert.equal(variables.length, 1);
        assert.equal(variables[0].getName(), "value");
        assertRange(variables[0].getNameRange(), 0, 12, 0, 17);
        assertRange(variables[0].getRange(), 0, 11, 0, 17);

        dockerfile = DockerfileParser.parse("LABEL key=$value key2='$value2'");
        label = dockerfile.getInstructions()[0];
        variables = label.getVariables();
        // single quotes are parsed literally so there should only be one variable
        assert.equal(variables.length, 1);
        assert.equal(variables[0].getName(), "value");
        assertRange(variables[0].getNameRange(), 0, 11, 0, 16);
        assertRange(variables[0].getRange(), 0, 10, 0, 16);

        dockerfile = DockerfileParser.parse("LABEL");
        label = dockerfile.getInstructions()[0];
        variables = label.getVariables();
        assert.equal(variables.length, 0);

        dockerfile = DockerfileParser.parse("LABEL abc");
        label = dockerfile.getInstructions()[0];
        variables = label.getVariables();
        assert.equal(variables.length, 0);

        dockerfile = DockerfileParser.parse("LABEL abc=def xyz");
        label = dockerfile.getInstructions()[0];
        variables = label.getVariables();
        assert.equal(variables.length, 0);
    });
});
