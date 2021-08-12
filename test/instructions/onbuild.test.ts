/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser, Onbuild } from '../../src/main';

describe("ONBUILD", () => {
    it("getTrigger", () => {
        let dockerfile = DockerfileParser.parse("ONBUILD");
        let instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        let onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), null);

        dockerfile = DockerfileParser.parse("ONBUILD ");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), null);

        dockerfile = DockerfileParser.parse("ONBUILD \t");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), null);

        dockerfile = DockerfileParser.parse("ONBUILD \n");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), null);

        dockerfile = DockerfileParser.parse("ONBUILD \r\n");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), null);

        dockerfile = DockerfileParser.parse("ONBUILD COPY . .");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), "COPY");

        dockerfile = DockerfileParser.parse("ONBUILD copY . .");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTrigger(), "COPY");
    });

    it("getTriggerWord", () => {
        let dockerfile = DockerfileParser.parse("ONBUILD");
        let instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        let onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTriggerWord(), null);

        dockerfile = DockerfileParser.parse("ONBUILD COPY . .");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTriggerWord(), "COPY");

        dockerfile = DockerfileParser.parse("ONBUILD copY . .");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTriggerWord(), "copY");
    });

    it("getTriggerInstruction", () => {
        let dockerfile = DockerfileParser.parse("ONBUILD");
        let instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        let onbuild = instructions[0] as Onbuild;
        assert.equal(onbuild.getTriggerInstruction(), null);

        dockerfile = DockerfileParser.parse("ONBUILD COPY . .");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        let trigger = onbuild.getTriggerInstruction();
        assert.equal(trigger.getKeyword(), "COPY");

        dockerfile = DockerfileParser.parse("ONBUILD copY . .");
        instructions = dockerfile.getInstructions();
        assert.equal(1, instructions.length);
        onbuild = instructions[0] as Onbuild;
        trigger = onbuild.getTriggerInstruction();
        assert.equal(trigger.getKeyword(), "COPY");
    });
});
