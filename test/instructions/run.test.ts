/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser } from '../../src/main';
import { Run } from "../../src/instructions/run";

describe("RUN", () => {
    it("getKeyword", () => {
        const dockerfile = DockerfileParser.parse("RUN echo");
        const instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getKeyword(), "RUN");
    });

    it("RUN --security=insecure echo", () => {
        const dockerfile = DockerfileParser.parse("RUN --security=insecure echo");
        const run = dockerfile.getInstructions()[0] as Run;
        assert.equal(1, run.getFlags().length);
    });
});
