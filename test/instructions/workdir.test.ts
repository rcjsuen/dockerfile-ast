/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser } from '../../src/main';

describe("WORKDIR", () => {
    it("getKeyword", () => {
        let dockerfile = DockerfileParser.parse("workdir /home/node");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getKeyword(), "WORKDIR");
    });
});
