/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser, Healthcheck } from '../../src/main';

describe("HEALTHCHECK", () => {
    it("getSubcommand", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK\nHEALTCHECK");
        let healthchecks = dockerfile.getHEALTHCHECKs();
        assert.equal(healthchecks.length, 1);
        assert.equal(healthchecks[0].getSubcommand(), null);

        dockerfile = DockerfileParser.parse("HEALTHCHECK NONE");
        healthchecks = dockerfile.getHEALTHCHECKs();
        assert.equal(healthchecks.length, 1);
        let subcommand = healthchecks[0].getSubcommand();
        assert.equal(subcommand.getValue(), "NONE");
        assertRange(subcommand.getRange(), 0, 12, 0, 16);
    });
});
