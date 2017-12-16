/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser } from '../../src/main';

describe("COPY", () => {
    describe("--from", () => {
        it("getFromFlag", () => {
            let dockerfile = DockerfileParser.parse("COPY app.zip app.zip");
            let copies = dockerfile.getCOPYs();
            assert.equal(copies.length, 1);
            assert.equal(copies[0].getFromFlag(), null);

            dockerfile = DockerfileParser.parse("COPY --from=stage app.zip app.zip");
            copies = dockerfile.getCOPYs();
            assert.equal(copies.length, 1);
            assert.ok(copies[0].getFromFlag() !== null);

            dockerfile = DockerfileParser.parse("COPY --FROM=stage app.zip app.zip");
            copies = dockerfile.getCOPYs();
            assert.equal(copies.length, 1);
            assert.equal(copies[0].getFromFlag(), null);

            dockerfile = DockerfileParser.parse("COPY --froM=stage app.zip app.zip");
            copies = dockerfile.getCOPYs();
            assert.equal(copies.length, 1);
            assert.equal(copies[0].getFromFlag(), null);
            assert.equal(copies[0].getArgumentsContent(), "app.zip app.zip");
        });
    });
});
