/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { DockerfileParser } from '../src/main';
import { PropertyInstruction } from '../src/propertyInstruction';

describe("PropertyInstruction", () => {
    function createSinglePropertyTests(instruction: string, delimiter: string) {
        it("getProperties single, delimiter (" + delimiter + ")", () => {
            let dockerfile = DockerfileParser.parse(instruction);
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let properties = propInstruction.getProperties();
            assert.equal(properties.length, 0);

            dockerfile = DockerfileParser.parse(instruction + " key");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter);
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key\\\n" + delimiter + "value");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\\ \t\n# comment\nvalue");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\\\t \r\n# comment\r\nvalue");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\ \t\r\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\n # comment");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value \\\t \r\n # comment");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
        });
    }

    function createSingleLongPropertyTests(instruction: string) {
        it("getProperties single long", () => {
            let dockerfile = DockerfileParser.parse(instruction + " key value value2 value3");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
        });
    }

    function createMultiplePropertyTests(instruction: string) {
        it("getProperties multiple", () => {
            let dockerfile = DockerfileParser.parse(instruction + " key=value key2=value2");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n # nested comment \n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n # nested comment \r\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\r\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);

            dockerfile = DockerfileParser.parse(instruction + " key=value \\ \t \r\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);

            dockerfile = DockerfileParser.parse(instruction + " key=value key2=value2 key3=value3");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
        });
    }

    describe("ARG", () => {
        createSinglePropertyTests("ARG", "=");
    });

    describe("ENV", () => {
        createSinglePropertyTests("ENV", "=");
        createSinglePropertyTests("ENV", " ");
        createSingleLongPropertyTests("ENV");
        createMultiplePropertyTests("ENV");
    });

    describe("LABEL", () => {
        createSinglePropertyTests("LABEL", "=");
        createSinglePropertyTests("LABEL", " ");
        createSingleLongPropertyTests("LABEL");
        createMultiplePropertyTests("LABEL");
    });
});
