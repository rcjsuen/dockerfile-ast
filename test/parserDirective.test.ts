/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser, Directive } from '../src/main';
import { assertRange } from './util';

describe("Parser Directive", () => {
    describe("escape", () => {
        it("# escape=`", () => {
            let dockerfile = DockerfileParser.parse("# escape=`");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 10);
            assert.equal(directive.getName(), "escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), "`");
            assertRange(directive.getValueRange(), 0, 9, 0, 10);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# escape=`");
        });

        it("# Escape=`", () => {
            let dockerfile = DockerfileParser.parse("# Escape=`");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 10);
            assert.equal(directive.getName(), "Escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), "`");
            assertRange(directive.getValueRange(), 0, 9, 0, 10);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# Escape=`");
        });

        it("# escape= \\t\\r\\n", () => {
            let dockerfile = DockerfileParser.parse("# escape= \t\r\n");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 11);
            assert.equal(directive.getName(), "escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), " \t");
            assertRange(directive.getValueRange(), 0, 9, 0, 11);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# escape= \t");
        });

        it("# escape=`\\r\\n", () => {
            let dockerfile = DockerfileParser.parse("# escape=`\r\n");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 10);
            assert.equal(directive.getName(), "escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), "`");
            assertRange(directive.getValueRange(), 0, 9, 0, 10);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# escape=`");
        });

        it("#\\t\\tEscape   =`", () => {
            let dockerfile = DockerfileParser.parse("#\t\tEscape   =`");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 14);
            assert.equal(directive.getName(), "Escape");
            assertRange(directive.getNameRange(), 0, 3, 0, 9);
            assert.equal(directive.getValue(), "`");
            assertRange(directive.getValueRange(), 0, 13, 0, 14);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# Escape=`");
        });

        it("# Escape=aaa", () => {
            let dockerfile = DockerfileParser.parse("# Escape=aaa");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 12);
            assert.equal(directive.getName(), "Escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), "aaa");
            assertRange(directive.getValueRange(), 0, 9, 0, 12);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# Escape=aaa");
        });

        it("# escape=asdf asdf", () => {
            let dockerfile = DockerfileParser.parse("# escape=asdf asdf");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 18);
            assert.equal(directive.getName(), "escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), "asdf");
            assertRange(directive.getValueRange(), 0, 9, 0, 13);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# escape=asdf");
        });

        it("# escape=", () => {
            let dockerfile = DockerfileParser.parse("# escape=");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 9);
            assert.equal(directive.getName(), "escape");
            assertRange(directive.getNameRange(), 0, 2, 0, 8);
            assert.equal(directive.getValue(), "");
            assertRange(directive.getValueRange(), 0, 9, 0, 9);
            assert.equal(directive.getDirective(), Directive.escape);
            assert.equal(directive.toString(), "# escape=");
        });

        it("# unknown=value", () => {
            let dockerfile = DockerfileParser.parse("# unknown=value");
            const directives = dockerfile.getDirectives();
            assert.equal(directives.length, 1);
            const directive = directives[0];
            assertRange(directive.getRange(), 0, 0, 0, 15);
            assert.equal(directive.getName(), "unknown");
            assertRange(directive.getNameRange(), 0, 2, 0, 9);
            assert.equal(directive.getValue(), "value");
            assertRange(directive.getValueRange(), 0, 10, 0, 15);
            assert.equal(directive.getDirective(), undefined);
            assert.equal(directive.toString(), "# unknown=value");
        });
    });
});
