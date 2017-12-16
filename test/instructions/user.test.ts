/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser } from '../../src/main';

describe("USER", () => {
    it("getKeyword", () => {
        let dockerfile = DockerfileParser.parse("user node");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getKeyword(), "USER");
    });
});
