/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { assertRange } from './util';
import { DockerfileParser, ModifiableInstruction } from '../src/main';

describe("FlagOption", () => {
    it("HEALTHCHECK --juice=fruit=orange", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --juice=fruit=orange");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];

        let option = flag.getOption("fruit");
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 20, 0, 32);
        assert.strictEqual(option.getName(), "fruit");
        assertRange(option.getNameRange(), 0, 20, 0, 25);
        assert.strictEqual(option.getValue(), "orange");
        assertRange(option.getValueRange(), 0, 26, 0, 32);
    });

    it("HEALTHCHECK --juice=fruit=", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --juice=fruit=");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];

        let option = flag.getOption("fruit");
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 20, 0, 26);
        assert.strictEqual(option.getName(), "fruit");
        assertRange(option.getNameRange(), 0, 20, 0, 25);
        assert.strictEqual(option.getValue(), "");
        assertRange(option.getValueRange(), 0, 26, 0, 26);
    });

    it("HEALTHCHECK --meal=drink=water,", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --meal=drink=water,");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];

        let option = flag.getOption("drink");
        assert.strictEqual(option, flag.getOptions()[0]);
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 19, 0, 30);
        assert.strictEqual(option.getName(), "drink");
        assertRange(option.getNameRange(), 0, 19, 0, 24);
        assert.strictEqual(option.getValue(), "water");
        assertRange(option.getValueRange(), 0, 25, 0, 30);
    });

    it("HEALTHCHECK --meal=drink=water,food=pasta", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --meal=drink=water,food=pasta");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];

        let option = flag.getOption("drink");
        assert.strictEqual(option, flag.getOptions()[0]);
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 19, 0, 30);
        assert.strictEqual(option.getName(), "drink");
        assertRange(option.getNameRange(), 0, 19, 0, 24);
        assert.strictEqual(option.getValue(), "water");
        assertRange(option.getValueRange(), 0, 25, 0, 30);

        option = flag.getOption("food");
        assert.strictEqual(option, flag.getOptions()[1]);
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 31, 0, 41);
        assert.strictEqual(option.getName(), "food");
        assertRange(option.getNameRange(), 0, 31, 0, 35);
        assert.strictEqual(option.getValue(), "pasta");
        assertRange(option.getValueRange(), 0, 36, 0, 41);
    });

    it("HEALTHCHECK --meal=drink=water,food=", () => {
        let dockerfile = DockerfileParser.parse("HEALTHCHECK --meal=drink=water,food=");
        let instruction = dockerfile.getInstructions()[0] as ModifiableInstruction;
        let flag = instruction.getFlags()[0];

        let option = flag.getOption("drink");
        assert.strictEqual(option, flag.getOptions()[0]);
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 19, 0, 30);
        assert.strictEqual(option.getName(), "drink");
        assertRange(option.getNameRange(), 0, 19, 0, 24);
        assert.strictEqual(option.getValue(), "water");
        assertRange(option.getValueRange(), 0, 25, 0, 30);

        option = flag.getOption("food");
        assert.strictEqual(option, flag.getOptions()[1]);
        assert.notStrictEqual(option, undefined);
        assert.notStrictEqual(option, null);
        assertRange(option.getRange(), 0, 31, 0, 36);
        assert.strictEqual(option.getName(), "food");
        assertRange(option.getNameRange(), 0, 31, 0, 35);
        assert.strictEqual(option.getValue(), "");
        assertRange(option.getValueRange(), 0, 36, 0, 36);
    });
});
