/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { assertRange } from './util';
import { DockerfileParser, ModifiableInstruction } from '../src/main';

describe("Flag", () => {
    describe("no option", () => {
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
            assert.equal(false, flag.hasOptions());
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
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
            assert.notStrictEqual(flag.getOptions(), undefined);
            assert.notStrictEqual(flag.getOptions(), null);
            assert.equal(0, flag.getOptions().length);
            assert.strictEqual(null, flag.getOption("interval"));
        });
    });

    describe("options", () => {
        it("HEALTHCHECK --juice=fruit=", () => {
            let dockerfile = DockerfileParser.parse("HEALTHCHECK --juice=fruit=");
            let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
            let flag = instruction.getFlags()[0];
            assert.equal(flag.getName(), "juice");
            assertRange(flag.getNameRange(), 0, 14, 0, 19);
            assert.equal(flag.getValue(), "fruit=");
            assertRange(flag.getValueRange(), 0, 20, 0, 26);
            assert.equal(flag.toString(), "--juice=fruit=");
            assertRange(flag.getRange(), 0, 12, 0, 26);
            assert.equal(1, flag.getOptions().length);
            let option = flag.getOption("fruit");
            assert.strictEqual(option, flag.getOptions()[0]);
        });

        it("HEALTHCHECK --juice=fruit=orange", () => {
            let dockerfile = DockerfileParser.parse("HEALTHCHECK --juice=fruit=orange");
            let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
            let flag = instruction.getFlags()[0];
            assert.equal(flag.getName(), "juice");
            assertRange(flag.getNameRange(), 0, 14, 0, 19);
            assert.equal(flag.getValue(), "fruit=orange");
            assertRange(flag.getValueRange(), 0, 20, 0, 32);
            assert.equal(flag.toString(), "--juice=fruit=orange");
            assertRange(flag.getRange(), 0, 12, 0, 32);
            assert.equal(1, flag.getOptions().length);
            let option = flag.getOption("fruit");
            assert.strictEqual(option, flag.getOptions()[0]);
        });

        it("HEALTHCHECK --meal=drink=water,", () => {
            let dockerfile = DockerfileParser.parse("HEALTHCHECK --meal=drink=water,");
            let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
            let flag = instruction.getFlags()[0];
            assert.equal(flag.getName(), "meal");
            assertRange(flag.getNameRange(), 0, 14, 0, 18);
            assert.equal(flag.getValue(), "drink=water,");
            assertRange(flag.getValueRange(), 0, 19, 0, 31);
            assert.equal(flag.toString(), "--meal=drink=water,");
            assertRange(flag.getRange(), 0, 12, 0, 31);
            assert.equal(1, flag.getOptions().length);
            let option = flag.getOption("drink");
            assert.strictEqual(option, flag.getOptions()[0]);
        });

        it("HEALTHCHECK --meal=drink=,food=pasta", () => {
            let dockerfile = DockerfileParser.parse("HEALTHCHECK --meal=drink=,food=pasta");
            let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
            let flag = instruction.getFlags()[0];
            assert.equal(flag.getName(), "meal");
            assertRange(flag.getNameRange(), 0, 14, 0, 18);
            assert.equal(flag.getValue(), "drink=,food=pasta");
            assertRange(flag.getValueRange(), 0, 19, 0, 36);
            assert.equal(flag.toString(), "--meal=drink=,food=pasta");
            assertRange(flag.getRange(), 0, 12, 0, 36);
            assert.equal(2, flag.getOptions().length);
            let option = flag.getOption("drink");
            assert.strictEqual(option, flag.getOptions()[0]);
            option = flag.getOption("food");
            assert.strictEqual(option, flag.getOptions()[1]);
        });

        it("HEALTHCHECK --meal=drink=water,food=pasta", () => {
            let dockerfile = DockerfileParser.parse("HEALTHCHECK --meal=drink=water,food=pasta");
            let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
            let flag = instruction.getFlags()[0];
            assert.equal(flag.getName(), "meal");
            assertRange(flag.getNameRange(), 0, 14, 0, 18);
            assert.equal(flag.getValue(), "drink=water,food=pasta");
            assertRange(flag.getValueRange(), 0, 19, 0, 41);
            assert.equal(flag.toString(), "--meal=drink=water,food=pasta");
            assertRange(flag.getRange(), 0, 12, 0, 41);
            assert.equal(2, flag.getOptions().length);
            let option = flag.getOption("drink");
            assert.strictEqual(option, flag.getOptions()[0]);
            option = flag.getOption("food");
            assert.strictEqual(option, flag.getOptions()[1]);
        });
    });
});
