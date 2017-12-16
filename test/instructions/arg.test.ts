/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser } from '../../src/main';

describe("ARG", () => {
    it("no declaration", () => {
        let dockerfile = DockerfileParser.parse("ARG");
        let args = dockerfile.getARGs();
        assert.equal(args.length, 1);
        assert.equal(args[0].getProperty(), null);
    });

    it("name only", () => {
        let dockerfile = DockerfileParser.parse("ARG var");
        let args = dockerfile.getARGs();
        assert.equal(args.length, 1);
        let property = args[0].getProperty();
        assert.equal(property.getName(), "var");
        assert.equal(property.getValue(), null);
        assertRange(property.getNameRange(), 0, 4, 0, 7);
        assert.equal(property.getValueRange(), null);
    });

    it("name and empty value", () => {
        let dockerfile = DockerfileParser.parse("ARG var=");
        let args = dockerfile.getARGs();
        assert.equal(args.length, 1);
        let property = args[0].getProperty();
        assert.equal(property.getName(), "var");
        assert.equal(property.getValue(), "");
        assertRange(property.getNameRange(), 0, 4, 0, 7);
        assertRange(property.getValueRange(), 0, 8, 0, 8);
    });

    it("name and value", () => {
        let dockerfile = DockerfileParser.parse("ARG var=value");
        let args = dockerfile.getARGs();
        assert.equal(args.length, 1);
        let property = args[0].getProperty();
        assert.equal(property.getName(), "var");
        assert.equal(property.getValue(), "value");
        assertRange(property.getNameRange(), 0, 4, 0, 7);
        assertRange(property.getValueRange(), 0, 8, 0, 13);
    });
});
