/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { Position, Range } from 'vscode-languageserver-types';
import { DockerfileParser } from '../src/main';

describe("Dockerfile", () => {
    it("getEscapeCharacter", () => {
        let dockerfile = DockerfileParser.parse("");
        assert.equal(dockerfile.getEscapeCharacter(), "\\");

        dockerfile = DockerfileParser.parse("# escape=\\");
        assert.equal(dockerfile.getEscapeCharacter(), "\\");

        dockerfile = DockerfileParser.parse("# escape=`");
        assert.equal(dockerfile.getEscapeCharacter(), "`");

        // invalid escape directive
        dockerfile = DockerfileParser.parse("# escape=a");
        assert.equal(dockerfile.getEscapeCharacter(), "\\");

        // not a directive, it's a comment
        dockerfile = DockerfileParser.parse("# comment\n# escape=`");
        assert.equal(dockerfile.getEscapeCharacter(), "\\");
    });

    it("getInitialARGs", () => {
        let dockerfile = DockerfileParser.parse("");
        assert.equal(dockerfile.getInitialARGs().length, 0);

        dockerfile = DockerfileParser.parse("FROM alpine\nARG var");
        assert.equal(dockerfile.getInitialARGs().length, 0);

        dockerfile = DockerfileParser.parse("ARG image=alpine\nFROM $image\nARG image=node");
        let args = dockerfile.getInitialARGs();
        assert.equal(args.length, 1);
        let property = args[0].getProperty();
        assert.ok(property !== null);
        assert.equal(property.getName(), "image");
        assert.equal(property.getValue(), "alpine");
    });

    it("getContainingImage", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine");
        let image = dockerfile.getContainingImage(Position.create(0, 1));
        assert.notEqual(image, null);
        image = dockerfile.getContainingImage(Position.create(1, 1));
        assert.equal(image, null);

        dockerfile = DockerfileParser.parse("ARG image\nFROM $image");
        image = dockerfile.getContainingImage(Position.create(0, 1));
        assert.notEqual(image, null);
        let image2 = dockerfile.getContainingImage(Position.create(1, 1));
        assert.notEqual(image2, null);
        assert.ok(image !== image2);
        // line doesn't exist
        image = dockerfile.getContainingImage(Position.create(2, 1));
        assert.equal(image, null);
    });

    it("getComments", () => {
        let dockerfile = DockerfileParser.parse("FROM alpine");
        assert.equal(dockerfile.getComments().length, 0);

        dockerfile = DockerfileParser.parse("# escape=`");
        assert.equal(dockerfile.getComments().length, 0);

        dockerfile = DockerfileParser.parse("# Escape=`");
        assert.equal(dockerfile.getComments().length, 0);

        dockerfile = DockerfileParser.parse("# escape");
        assert.equal(dockerfile.getComments().length, 1);
    });

    it("getDirective", () => {
        let dockerfile = DockerfileParser.parse("# escape=`");
        let directive = dockerfile.getDirective();
        assert.ok(directive !== null);

        dockerfile = DockerfileParser.parse("# test=`");
        directive = dockerfile.getDirective();
        assert.ok(directive !== null);
    });
});
