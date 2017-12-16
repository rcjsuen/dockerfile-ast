/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser, Add } from '../../src/main';

describe("ADD", () => {
    it("getFlags", () => {
        let dockerfile = DockerfileParser.parse("ADD --chown=root:root app.zip app.zip");
        let instruction = dockerfile.getInstructions()[0] as Add;
        assert.equal(instruction.getFlags().length, 1);
    });
});
