/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser, Stopsignal } from '../../src/main';

describe("STOPSIGNAL", () => {
    it("getKeyword", () => {
        let dockerfile = DockerfileParser.parse("stopSIGNAL 9");
        let instruction = dockerfile.getInstructions()[0] as Stopsignal;
        assert.equal(instruction.getKeyword(), "STOPSIGNAL");
    });
});
