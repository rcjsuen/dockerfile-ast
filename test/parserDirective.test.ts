/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";
import { Range } from 'vscode-languageserver-types';

import { DockerfileParser } from '../src/main';
import { assertRange } from './util';

describe("Parser Directive", () => {
    describe("escape", () => {
        it("getName", () => {
            let dockerfile = DockerfileParser.parse("# escape=`");
            let directive = dockerfile.getDirective();
            assert.equal(directive.getName(), "escape");

            dockerfile = DockerfileParser.parse("# Escape=`");
            directive = dockerfile.getDirective();
            assert.equal(directive.getName(), "Escape");

            dockerfile = DockerfileParser.parse("# escape= \t\r\n");
            directive = dockerfile.getDirective();
            assert.equal(directive.getName(), "escape");

            dockerfile = DockerfileParser.parse("# escape=`\r\n");
            directive = dockerfile.getDirective();
            assert.equal(directive.getName(), "escape");

            dockerfile = DockerfileParser.parse("# unknown=value");
            directive = dockerfile.getDirective();
            assert.equal(directive.getName(), "unknown");
        });

        it("getNameRange", () => {
            let dockerfile = DockerfileParser.parse("# escape=`");
            let directive = dockerfile.getDirective();
            assertRange(directive.getNameRange(), 0, 2, 0, 8);

            dockerfile = DockerfileParser.parse("#\t\tEscape   =`");
            directive = dockerfile.getDirective();
            assertRange(directive.getNameRange(), 0, 3, 0, 9);

            dockerfile = DockerfileParser.parse("# unknown=value");
            directive = dockerfile.getDirective();
            assertRange(directive.getNameRange(), 0, 2, 0, 9);
        });

        it("getValue", () => {
            let dockerfile = DockerfileParser.parse("# escape=`");
            let directive = dockerfile.getDirective();
            assert.equal(directive.getValue(), "`");

            dockerfile = DockerfileParser.parse("# Escape=aaa");
            directive = dockerfile.getDirective();
            assert.equal(directive.getValue(), "aaa");

            dockerfile = DockerfileParser.parse("# unknown=value");
            directive = dockerfile.getDirective();
            assert.equal(directive.getValue(), "value");

            dockerfile = DockerfileParser.parse("# escape=");
            directive = dockerfile.getDirective();
            assert.equal(directive.getValue(), "");
        });

        it("getValueRange", () => {
            let dockerfile = DockerfileParser.parse("# escape=`");
            let directive = dockerfile.getDirective();
            assertRange(directive.getValueRange(), 0, 9, 0, 10);

            dockerfile = DockerfileParser.parse("# escape=asdf asdf");
            directive = dockerfile.getDirective();
            assertRange(directive.getValueRange(), 0, 9, 0, 13);

            dockerfile = DockerfileParser.parse("# unknown=value");
            directive = dockerfile.getDirective();
            assertRange(directive.getValueRange(), 0, 10, 0, 15);

            dockerfile = DockerfileParser.parse("# escape=");
            directive = dockerfile.getDirective();
            assertRange(directive.getValueRange(), 0, 9, 0, 9);
        });
    });
});
