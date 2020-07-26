/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { assertRange } from './util';
import { DockerfileParser, Property } from '../src/main';
import { PropertyInstruction } from '../src/propertyInstruction';

function assertOperator(property: Property, delimiter: string, startLine?: number, startCharacter?: number, endLine?: number, endCharacter?: number): void {
    if (delimiter === null || delimiter === " ") {
        assert.strictEqual(property.getAssignmentOperator(), null);
        assert.strictEqual(property.getAssignmentOperatorRange(), null);
    } else {
        assert.strictEqual(property.getAssignmentOperator(), delimiter);
        assertRange(property.getAssignmentOperatorRange(), startLine, startCharacter, endLine, endCharacter);
    }
}

describe("Property", () => {
    function createSinglePropertyTests(instruction: string, delimiter: string) {
        let offset = instruction.length;

        it("single, delimiter (" + delimiter + ")", () => {
            let dockerfile = DockerfileParser.parse(instruction + " key");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            let property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), null);
            assert.equal(property.getUnescapedValue(), null);
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assert.equal(property.getValueRange(), null);
            assertOperator(property, null);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 4);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter);
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            if (delimiter === " ") {
                assert.equal(property.getValue(), null);
                assert.equal(property.getUnescapedValue(), null);
                assert.equal(property.getValueRange(), null);
                assertRange(property.getRange(), 0, offset + 1, 0, offset + 4);
            } else {
                assert.equal(property.getValue(), "");
                assert.equal(property.getUnescapedValue(), "");
                assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 5);
                assertRange(property.getRange(), 0, offset + 1, 0, offset + 5);
            }

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\r\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\n\n\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\r\n\r\n\r\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\ \t\r\n");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\n# comment");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "value\\\r\n\\\n# comment");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " x" + delimiter + "y\\ z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "y z");
            assert.equal(property.getUnescapedValue(), "y\\ z");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 2);
            assertRange(property.getValueRange(), 0, offset + 3, 0, offset + 7);
            assertOperator(property, delimiter, 0, offset + 2, 0, offset + 3);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 7);

            dockerfile = DockerfileParser.parse(instruction + " x" + delimiter + "#");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "#");
            assert.equal(property.getUnescapedValue(), "#");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 2);
            assertRange(property.getValueRange(), 0, offset + 3, 0, offset + 4);
            assertOperator(property, delimiter, 0, offset + 2, 0, offset + 3);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 4);

            dockerfile = DockerfileParser.parse(instruction + " x" + delimiter + "y\\z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "yz");
            assert.equal(property.getUnescapedValue(), "y\\z");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 2);
            assertRange(property.getValueRange(), 0, offset + 3, 0, offset + 6);
            assertOperator(property, delimiter, 0, offset + 2, 0, offset + 3);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 6);

            dockerfile = DockerfileParser.parse("#escape=`\n" + instruction + " x" + delimiter + "y`z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "yz");
            assert.equal(property.getUnescapedValue(), "y`z");
            assertRange(property.getNameRange(), 1, offset + 1, 1, offset + 2);
            assertRange(property.getValueRange(), 1, offset + 3, 1, offset + 6);
            assertOperator(property, delimiter, 1, offset + 2, 1, offset + 3);
            assertRange(property.getRange(), 1, offset + 1, 1, offset + 6);

            dockerfile = DockerfileParser.parse("#directive=value\n#escape=`\n" + instruction + " x" + delimiter + "y`z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "yz");
            assert.equal(property.getUnescapedValue(), "y`z");
            assertRange(property.getNameRange(), 2, offset + 1, 2, offset + 2);
            assertRange(property.getValueRange(), 2, offset + 3, 2, offset + 6);
            assertOperator(property, delimiter, 2, offset + 2, 2, offset + 3);
            assertRange(property.getRange(), 2, offset + 1, 2, offset + 6);

            dockerfile = DockerfileParser.parse(instruction + " x" + delimiter + "\\y");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "y");
            assert.equal(property.getUnescapedValue(), "\\y");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 2);
            assertRange(property.getValueRange(), 0, offset + 3, 0, offset + 5);
            assertOperator(property, delimiter, 0, offset + 2, 0, offset + 3);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 5);

            dockerfile = DockerfileParser.parse("#escape=`\n" + instruction + " x" + delimiter + "`y");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "y");
            assert.equal(property.getUnescapedValue(), "`y");
            assertRange(property.getNameRange(), 1, offset + 1, 1, offset + 2);
            assertRange(property.getValueRange(), 1, offset + 3, 1, offset + 5);
            assertOperator(property, delimiter, 1, offset + 2, 1, offset + 3);
            assertRange(property.getRange(), 1, offset + 1, 1, offset + 5);

            dockerfile = DockerfileParser.parse(instruction + " x" + delimiter + "y\\\\z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "y\\z");
            assert.equal(property.getUnescapedValue(), "y\\\\z");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 2);
            assertRange(property.getValueRange(), 0, offset + 3, 0, offset + 7);
            assertOperator(property, delimiter, 0, offset + 2, 0, offset + 3);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 7);

            dockerfile = DockerfileParser.parse("#escape=`\n" + instruction + " x" + delimiter + "y``z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "y`z");
            assert.equal(property.getUnescapedValue(), "y``z");
            assertRange(property.getNameRange(), 1, offset + 1, 1, offset + 2);
            assertRange(property.getValueRange(), 1, offset + 3, 1, offset + 7);
            assertOperator(property, delimiter, 1, offset + 2, 1, offset + 3);
            assertRange(property.getRange(), 1, offset + 1, 1, offset + 7);

            dockerfile = DockerfileParser.parse(instruction + " abc" + delimiter + "d\\ \t \n \t \r\n\n\r\nef");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "abc");
            assert.equal(property.getValue(), "def");
            assert.equal(property.getUnescapedValue(), "def");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 4, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 4, 2);

            dockerfile = DockerfileParser.parse(instruction + " abc" + delimiter + "d\\ \t \r\n# comment\r\nef");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "abc");
            assert.equal(property.getValue(), "def");
            assert.equal(property.getUnescapedValue(), "def");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 2, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 2, 2);

            dockerfile = DockerfileParser.parse(instruction + " abc" + delimiter + "d\\\n \t \r\n\n# comment\r\nef");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "abc");
            assert.equal(property.getValue(), "def");
            assert.equal(property.getUnescapedValue(), "def");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 4, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 4, 2);

            dockerfile = DockerfileParser.parse(instruction + " abc" + delimiter + "d\\\n \t \r\n\n# comment\r\ne#f");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "abc");
            assert.equal(property.getValue(), "de#f");
            assert.equal(property.getUnescapedValue(), "de#f");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 4, 3);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 4, 3);

            dockerfile = DockerfileParser.parse(instruction + " abc" + delimiter + "d\\\r\n \t# comment\r\nef");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "abc");
            assert.equal(property.getValue(), "def");
            assert.equal(property.getUnescapedValue(), "def");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 2, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 2, 2);

            dockerfile = DockerfileParser.parse(instruction + " abc" + delimiter + "d\\\r\n \t# comment");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "abc");
            assert.equal(property.getValue(), "d");
            assert.equal(property.getUnescapedValue(), "d");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 6);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 6);

            dockerfile = DockerfileParser.parse(instruction + " x" + delimiter + "a\\ b\\ \\ c");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "x");
            assert.equal(property.getValue(), "a b  c");
            assert.equal(property.getUnescapedValue(), "a\\ b\\ \\ c");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 2);
            assertRange(property.getValueRange(), 0, offset + 3, 0, offset + 12);
            assertOperator(property, delimiter, 0, offset + 2, 0, offset + 3);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 12);

            dockerfile = DockerfileParser.parse(instruction + " BUNDLE_WITHOUT" + delimiter + "${bundle_without:-'development test'}");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "BUNDLE_WITHOUT");
            assert.equal(property.getValue(), "${bundle_without:-'development test'}");
            assert.equal(property.getUnescapedValue(), "${bundle_without:-'development test'}");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 15);
            assertRange(property.getValueRange(), 0, offset + 16, 0, offset + 53);
            assertOperator(property, delimiter, 0, offset + 15, 0, offset + 16);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 53);

            dockerfile = DockerfileParser.parse(instruction + " BUNDLE_WITHOUT" + delimiter + "${bundle_without:-\"development test\"}");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "BUNDLE_WITHOUT");
            assert.equal(property.getValue(), "${bundle_without:-\"development test\"}");
            assert.equal(property.getUnescapedValue(), "${bundle_without:-\"development test\"}");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 15);
            assertRange(property.getValueRange(), 0, offset + 16, 0, offset + 53);
            assertOperator(property, delimiter, 0, offset + 15, 0, offset + 16);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 53);

            dockerfile = DockerfileParser.parse(instruction + " aaab=${bbb:-\"ccc dddd' y=z");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "aaab");
            assert.equal(property.getValue(), "${bbb:-\"ccc dddd' y=z");
            assert.equal(property.getUnescapedValue(), "${bbb:-\"ccc dddd' y=z");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 5);
            assertRange(property.getValueRange(), 0, offset + 6, 0, offset + 27);
            assertOperator(property, "=", 0, offset + 5, 0, offset + 6);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 27);

            dockerfile = DockerfileParser.parse(instruction + " aaa=${bbb:-\"ccc   \\\nddd\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "aaa");
            assert.equal(property.getValue(), "${bbb:-\"ccc   ddd\"");
            assert.equal(property.getUnescapedValue(), "${bbb:-\"ccc   ddd\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 1, 4);
            assertOperator(property, "=", 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 1, 4);

            dockerfile = DockerfileParser.parse(instruction + " aaa=${bbb:-\"ccc   \\\n\r\n\nddd\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "aaa");
            assert.equal(property.getValue(), "${bbb:-\"ccc   ddd\"");
            assert.equal(property.getUnescapedValue(), "${bbb:-\"ccc   ddd\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 3, 4);
            assertOperator(property, "=", 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 3, 4);

            dockerfile = DockerfileParser.parse(instruction + " aaa=${bbb:-\"ccc  \\ \t\r\nddd\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "aaa");
            assert.equal(property.getValue(), "${bbb:-\"ccc  ddd\"");
            assert.equal(property.getUnescapedValue(), "${bbb:-\"ccc  ddd\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 1, 4);
            assertOperator(property, "=", 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 1, 4);

            dockerfile = DockerfileParser.parse(instruction + " aaa=${bbb:-\"c''c\"}");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "aaa");
            assert.equal(property.getValue(), "${bbb:-\"c''c\"}");
            assert.equal(property.getUnescapedValue(), "${bbb:-\"c''c\"}");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 19);
            assertOperator(property, "=", 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 19);

            dockerfile = DockerfileParser.parse(instruction + " aaa=${bbb:-'c\"\"c'}");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "aaa");
            assert.equal(property.getValue(), "${bbb:-'c\"\"c'}");
            assert.equal(property.getUnescapedValue(), "${bbb:-'c\"\"c'}");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 19);
            assertOperator(property, "=", 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 19);

            dockerfile = DockerfileParser.parse(instruction + " \\\n#");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            assert.equal(propInstruction.getProperties().length, 0);

            dockerfile = DockerfileParser.parse(instruction + " \\\n# comment");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            assert.equal(propInstruction.getProperties().length, 0);

            dockerfile = DockerfileParser.parse(instruction + " \\\n# comment\nkey" + delimiter + "value");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 2, 0, 2, 3);
            assertRange(property.getValueRange(), 2, 4, 2, 9);
            assertOperator(property, delimiter, 2, 3, 2, 4);
            assertRange(property.getRange(), 2, 0, 2, 9);

            dockerfile = DockerfileParser.parse(instruction + " \\\n# comment\n key" + delimiter + "value");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 1);
            property = properties[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value");
            assert.equal(property.getUnescapedValue(), "value");
            assertRange(property.getNameRange(), 2, 1, 2, 4);
            assertRange(property.getValueRange(), 2, 5, 2, 10);
            assertOperator(property, delimiter, 2, 4, 2, 5);
            assertRange(property.getRange(), 2, 1, 2, 10);
        });
    }

    function createSingleLongPropertyTests(instruction: string) {
        let offset = instruction.length;

        it("single long", () => {
            let dockerfile = DockerfileParser.parse(instruction + " key value value2 value3");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "value value2 value3");
            assert.equal(property.getUnescapedValue(), "value value2 value3");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 24);
            assertOperator(property, null);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 24);

            dockerfile = DockerfileParser.parse(instruction + " key \\\\a");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "\\a");
            assert.equal(property.getUnescapedValue(), "\\\\a");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 8);
            assertOperator(property, null);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 8);

            dockerfile = DockerfileParser.parse(instruction + " key a\\        ");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a");
            assert.equal(property.getUnescapedValue(), "a");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 6);
            assertOperator(property, null);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 6);
        });
    }

    function createSingleQuotedPropertyTests(instruction: string, delimiter: string) {
        let offset = instruction.length;

        it("single quoted", () => {
            let dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a b\"");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a b");
            assert.equal(property.getUnescapedValue(), "\"a b\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a \\");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "\"a \\");
            assert.equal(property.getUnescapedValue(), "\"a \\");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 9);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 9);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "'a \\");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "'a \\");
            assert.equal(property.getUnescapedValue(), "'a \\");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 9);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 9);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "'a\\\nb'");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "ab");
            assert.equal(property.getUnescapedValue(), "'ab'");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 1, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 1, 2);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "'a\\\r\nb'");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "ab");
            assert.equal(property.getUnescapedValue(), "'ab'");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 1, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 1, 2);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a\\\nb\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "ab");
            assert.equal(property.getUnescapedValue(), "\"ab\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 1, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 1, 2);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a\\\r\nb\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "ab");
            assert.equal(property.getUnescapedValue(), "\"ab\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 1, 2);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 1, 2);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "'a\\b'");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a\\b");
            assert.equal(property.getUnescapedValue(), "'a\\b'");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a\\b\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a\\b");
            assert.equal(property.getUnescapedValue(), "\"a\\b\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a\\\"\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a\"");
            assert.equal(property.getUnescapedValue(), "\"a\\\"\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 10);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a\\\\b\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a\\b");
            assert.equal(property.getUnescapedValue(), "\"a\\\\b\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 11);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 11);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "\"a\\  b\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a\\  b");
            assert.equal(property.getUnescapedValue(), "\"a\\  b\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 12);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 12);

            dockerfile = DockerfileParser.parse(instruction + " key" + delimiter + "'a\\  b'");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "key");
            assert.equal(property.getValue(), "a\\  b");
            assert.equal(property.getUnescapedValue(), "'a\\  b'");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 4);
            assertRange(property.getValueRange(), 0, offset + 5, 0, offset + 12);
            assertOperator(property, delimiter, 0, offset + 4, 0, offset + 5);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 12);

            dockerfile = DockerfileParser.parse(instruction + " \"aaa\"" + delimiter + "\"bbb\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "aaa");
            assert.equal(property.getValue(), "bbb");
            assert.equal(property.getUnescapedValue(), "\"bbb\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 6);
            assertRange(property.getValueRange(), 0, offset + 7, 0, offset + 12);
            assertOperator(property, delimiter, 0, offset + 6, 0, offset + 7);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 12);
        });

        it("\"a\\\"b\"" + delimiter + "\"c\\\"d\"", () => {
            let dockerfile = DockerfileParser.parse(instruction + " \"a\\\"b\"" + delimiter + "\"c\\\"d\"");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "a\"b");
            assert.equal(property.getValue(), "c\"d");
            assert.equal(property.getUnescapedValue(), "\"c\\\"d\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 7);
            assertRange(property.getValueRange(), 0, offset + 8, 0, offset + 14);
            assertOperator(property, delimiter, 0, offset + 7, 0, offset + 8);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 14);
        });

        it("\"a\\\"b\"" + delimiter + "'c\"d'", () => {
            let dockerfile = DockerfileParser.parse(instruction + " \"a\\\"b\"" + delimiter + "'c\"d'");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "a\"b");
            assert.equal(property.getValue(), "c\"d");
            assert.equal(property.getUnescapedValue(), "'c\"d'");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 7);
            assertRange(property.getValueRange(), 0, offset + 8, 0, offset + 13);
            assertOperator(property, delimiter, 0, offset + 7, 0, offset + 8);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 13);
        });

        it("'a\"b'" + delimiter + "\"c\"d\"", () => {
            let dockerfile = DockerfileParser.parse(instruction + " 'a\"b'" + delimiter + "\"c\"d\"");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "a\"b");
            assert.equal(property.getValue(), "c\"d");
            assert.equal(property.getUnescapedValue(), "\"c\"d\"");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 6);
            assertRange(property.getValueRange(), 0, offset + 7, 0, offset + 12);
            assertOperator(property, delimiter, 0, offset + 6, 0, offset + 7);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 12);
        });

        it("'a\"b'" + delimiter + "'c\"d'", () => {
            let dockerfile = DockerfileParser.parse(instruction + " 'a\"b'" + delimiter + "'c\"d'");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "a\"b");
            assert.equal(property.getValue(), "c\"d");
            assert.equal(property.getUnescapedValue(), "'c\"d'");
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 6);
            assertRange(property.getValueRange(), 0, offset + 7, 0, offset + 12);
            assertOperator(property, delimiter, 0, offset + 6, 0, offset + 7);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 12);
        });

        it("single quoted with invalid key \"abc" + delimiter + "xyz\"", () => {
            let dockerfile = DockerfileParser.parse(instruction + " \"abc" + delimiter + "xyz\"");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "abc" + delimiter + "xyz");
            assert.equal(property.getValue(), null);
            assert.equal(property.getUnescapedValue(), null);
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 10);
            assert.equal(property.getValueRange(), null);
            assertOperator(property, null);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);
        });

        it("single quoted with invalid key 'abc" + delimiter + "xyz'", () => {
            let dockerfile = DockerfileParser.parse(instruction + " 'abc" + delimiter + "xyz'");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let property = propInstruction.getProperties()[0];
            assert.equal(property.getName(), "abc" + delimiter + "xyz");
            assert.equal(property.getValue(), null);
            assert.equal(property.getUnescapedValue(), null);
            assertRange(property.getNameRange(), 0, offset + 1, 0, offset + 10);
            assert.equal(property.getValueRange(), null);
            assertOperator(property, null);
            assertRange(property.getRange(), 0, offset + 1, 0, offset + 10);
        });
    }

    function createMultiplePropertyTests(instruction: string) {
        it("getProperties multiple", () => {
            let dockerfile = DockerfileParser.parse(instruction + " key=value key2=value2");
            let propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            let properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n # nested comment \n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n # nested comment \r\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\r\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value \\ \t \r\n key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value key2=value2 key3=value3");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "key");
            assert.equal(properties[1].getName(), "key2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " x=a\\  b=d");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties[0].getName(), "x");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "a ");
            assert.equal(properties[1].getName(), "b");
            assert.equal(properties[1].getValue(), "d");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=value  key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.equal(properties[1].getValue(), "value2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");

            dockerfile = DockerfileParser.parse(instruction + " key=${value key2=value2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "${value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");

            dockerfile = DockerfileParser.parse(instruction + " key=${value key2=val}ue2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "${value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "val}ue2");

            dockerfile = DockerfileParser.parse(instruction + " key=${value\tkey2=val}ue2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "${value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "val}ue2");

            dockerfile = DockerfileParser.parse(instruction + " key=${value:-'a b' \tkey2=val}ue2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "${value:-'a b'");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "val}ue2");

            dockerfile = DockerfileParser.parse(instruction + " key=${value:-\"a b\" \tkey2=val}ue2");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 2);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "${value:-\"a b\"");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "val}ue2");

            dockerfile = DockerfileParser.parse(instruction + " key=value key2='value2' key3=\"value3\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");
            assert.equal(properties[2].getValue(), "value3");

            dockerfile = DockerfileParser.parse(instruction + " 'key'=value 'key2'='value2' 'key3'=\"value3\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");
            assert.equal(properties[2].getValue(), "value3");

            dockerfile = DockerfileParser.parse(instruction + " \"key\"=value \"key2\"='value2' \"key3\"=\"value3\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");
            assert.equal(properties[2].getValue(), "value3");

            dockerfile = DockerfileParser.parse(instruction + " key=value \\\n key2='value2' \\\n key3=\"value3\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");
            assert.equal(properties[2].getValue(), "value3");

            dockerfile = DockerfileParser.parse(instruction + " 'key'=value \\\n 'key2'='value2' \\\n 'key3'=\"value3\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");
            assert.equal(properties[2].getValue(), "value3");

            dockerfile = DockerfileParser.parse(instruction + " \"key\"=value \\\n \"key2\"='value2' \\\n \"key3\"=\"value3\"");
            propInstruction = dockerfile.getInstructions()[0] as PropertyInstruction;
            properties = propInstruction.getProperties();
            assert.equal(properties.length, 3);
            assert.equal(properties[0].getName(), "key");
            assert.strictEqual(properties[0].getAssignmentOperator(), "=");
            assert.equal(properties[0].getValue(), "value");
            assert.equal(properties[1].getName(), "key2");
            assert.strictEqual(properties[1].getAssignmentOperator(), "=");
            assert.equal(properties[1].getValue(), "value2");
            assert.equal(properties[2].getName(), "key3");
            assert.strictEqual(properties[2].getAssignmentOperator(), "=");
            assert.equal(properties[2].getValue(), "value3");
        });
    }

    describe("ARG", () => {
        createSinglePropertyTests("ARG", "=");
        createSingleLongPropertyTests("ARG");
        createSingleQuotedPropertyTests("ARG", "=");
    });

    describe("ENV", () => {
        createSinglePropertyTests("ENV", "=");
        createSinglePropertyTests("ENV", " ");
        createSingleLongPropertyTests("ENV");
        createSingleQuotedPropertyTests("ENV", "=");
        createSingleQuotedPropertyTests("ENV", " ");
        createMultiplePropertyTests("ENV");
    });

    describe("LABEL", () => {
        createSinglePropertyTests("LABEL", "=");
        createSinglePropertyTests("LABEL", " ");
        createSingleLongPropertyTests("LABEL");
        createSingleQuotedPropertyTests("LABEL", "=");
        createSingleQuotedPropertyTests("LABEL", " ");
        createMultiplePropertyTests("LABEL");
    });
});
