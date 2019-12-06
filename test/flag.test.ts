/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { assertRange } from './util';
import { DockerfileParser, ModifiableInstruction } from '../src/main';

describe("Flag", () => {
    it("HEALTHCHECK --interval=30s CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 0, 14, 0, 22);
        assert.equal(flag.getValue(), "30s");
        assertRange(flag.getValueRange(), 0, 23, 0, 26);
        assert.equal(flag.toString(), "--interval=30s");
        assertRange(flag.getRange(), 0, 12, 0, 26);
    });

    it("HEALTHCHECK --interval CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 0, 14, 0, 22);
        assert.equal(flag.getValue(), null);
        assertRange(flag.getRange(), 0, 12, 0, 22);
        assert.equal(flag.toString(), "--interval");
        assert.equal(flag.getValueRange(), null);
    });

    it("HEALTHCHECK ---interval CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK ---interval CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "-interval");
        assertRange(flag.getNameRange(), 0, 14, 0, 23);
        assert.equal(flag.getValue(), null);
        assertRange(flag.getRange(), 0, 12, 0, 23);
        assert.equal(flag.toString(), "---interval");
        assert.equal(flag.getValueRange(), null);
    });

    it("HEALTHCHECK --interval= CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval= CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 0, 14, 0, 22);
        assert.equal(flag.getValue(), "");
        assertRange(flag.getValueRange(), 0, 23, 0, 23);
        assert.equal(flag.toString(), "--interval=");
        assertRange(flag.getRange(), 0, 12, 0, 23);
    });

    it("HEALTHCHECK --int\\\\nerval=30s CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --int\\\nerval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 0, 14, 1, 5);
        assert.equal(flag.getValue(), "30s");
        assertRange(flag.getRange(), 0, 12, 1, 9);
        assert.equal(flag.toString(), "--interval=30s");
        assertRange(flag.getValueRange(), 1, 6, 1, 9);
    });

    it("HEALTHCHECK -\\\\n-int\\\\nerval=30s CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 1, 1, 2, 5);
        assert.equal(flag.getValue(), "30s");
        assertRange(flag.getValueRange(), 2, 6, 2, 9);
        assert.equal(flag.toString(), "--interval=30s");
        assertRange(flag.getRange(), 0, 12, 2, 9);
    });

    it("HEALTHCHECK -\\\\n-int\\\\nerval CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 1, 1, 2, 5);
        assert.equal(flag.getValue(), null);
        assert.equal(flag.getValueRange(), null);
        assert.equal(flag.toString(), "--interval");
        assertRange(flag.getRange(), 0, 12, 2, 5);
    });

    it("HEALTHCHECK -\\\\n-int\\\\nerval= CMD ls", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval= CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
        assertRange(flag.getNameRange(), 1, 1, 2, 5);
        assert.equal(flag.getValue(), "");
        assertRange(flag.getValueRange(), 2, 6, 2, 6);
        assert.equal(flag.toString(), "--interval=");
        assertRange(flag.getRange(), 0, 12, 2, 6);
    });
});
