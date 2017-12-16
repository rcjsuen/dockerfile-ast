/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import { Position } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser, ModifiableInstruction } from '../src/main';

describe("Flag", () => {
    it("getName", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK ---interval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "-interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK --int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getName(), "interval");
    });

    it("getNameRange", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 0, 14, 0, 22);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 0, 14, 0, 22);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 0, 14, 0, 22);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 0, 14, 1, 5);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 1, 1, 2, 5);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 1, 1, 2, 5);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getNameRange(), 1, 1, 2, 5);
    });

    it("getName", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), "30s");

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), null);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), "");

        dockerfile = DockerfileParser.parse("HEALTHCHECK --int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), "30s");

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), "30s");

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), null);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValue(), "");
    });

    it("getValueRange", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assertRange(flag.getValueRange(), 0, 23, 0, 26);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValueRange(), null);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getValueRange(), 0, 23, 0, 23);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getValueRange(), 1, 6, 1, 9);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getValueRange(), 2, 6, 2, 9);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assert.equal(flag.getValueRange(), null);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getValueRange(), 2, 6, 2, 6);
    });

    it("getRange", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --interval=30s CMD ls");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 0, 26);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 0, 22);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --interval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 0, 23);

        dockerfile = DockerfileParser.parse("HEALTHCHECK --int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 1, 9);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval=30s CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 2, 9);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 2, 5);

        dockerfile = DockerfileParser.parse("HEALTHCHECK -\\\n-int\\\nerval= CMD ls");
        instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        flag = instruction.getFlags()[0];
        assertRange(flag.getRange(), 0, 12, 2, 6);
    });
});
