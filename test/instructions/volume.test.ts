/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser } from '../../src/main';

describe("VOLUME", () => {
    it("getKeyword", () => {
        let dockerfile = DockerfileParser.parse("volume /var/log");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getKeyword(), "VOLUME");
    });
});
