/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { DockerfileParser } from '../../src/main';
import { Workdir } from '../../src/instructions/workdir';

describe("WORKDIR", () => {
    it("getKeyword", () => {
        let dockerfile = DockerfileParser.parse("workdir /home/node");
        let instruction = dockerfile.getInstructions()[0];
        assert.equal(instruction.getKeyword(), "WORKDIR");
    });

    describe("getPath", () => {
        it("no arguments", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual(null, workdir.getPath());
        });

        it("whitespace", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR ");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual(null, workdir.getPath());
        });

        it("/", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR /");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual("/", workdir.getPath());
        });

        it("a", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR a");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual("a", workdir.getPath());
        });
    });

    describe("getAbsolutePath", () => {
        it("no arguments", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual(null, workdir.getAbsolutePath());
        });

        it("whitespace", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR ");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual(null, workdir.getAbsolutePath());
        });

        it("/", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR /");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual("/", workdir.getAbsolutePath());
        });

        it("a", () => {
            const dockerfile = DockerfileParser.parse("WORKDIR a");
            const workdir = dockerfile.getInstructions()[0] as Workdir;
            assert.strictEqual(undefined, workdir.getAbsolutePath());
        });

        it("inherits same stage", () => {
            let dockerfile = DockerfileParser.parse("FROM scratch\nWORKDIR /a\nWORKDIR b");
            let workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual("/a", workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[2] as Workdir;
            assert.strictEqual("/a/b", workdir.getAbsolutePath());

            dockerfile = DockerfileParser.parse("FROM scratch\nWORKDIR /a/\nWORKDIR b");
            workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual("/a/", workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[2] as Workdir;
            assert.strictEqual("/a/b", workdir.getAbsolutePath());
        });

        it("inherits different stage", () => {
            let dockerfile = DockerfileParser.parse("FROM scratch AS build\nWORKDIR /a\nFROM build\nWORKDIR b");
            let workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual("/a", workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[3] as Workdir;
            assert.strictEqual("/a/b", workdir.getAbsolutePath());

            dockerfile = DockerfileParser.parse("FROM scratch AS build\nWORKDIR /a/\nFROM build\nWORKDIR b");
            workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual("/a/", workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[3] as Workdir;
            assert.strictEqual("/a/b", workdir.getAbsolutePath());
        });

        it("unknown inheritance", () => {
            const dockerfile = DockerfileParser.parse("FROM scratch\nWORKDIR a");
            const workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual(undefined, workdir.getAbsolutePath());
        });

        it("two relative paths", () => {
            const dockerfile = DockerfileParser.parse("FROM scratch\nWORKDIR /a\nWORKDIR b\nWORKDIR c");
            let workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual("/a", workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[2] as Workdir;
            assert.strictEqual("/a/b", workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[3] as Workdir;
            assert.strictEqual("/a/b/c", workdir.getAbsolutePath());
        });

        it("parent is null relative paths", () => {
            const dockerfile = DockerfileParser.parse("FROM scratch\nWORKDIR\nWORKDIR b");
            let workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual(null, workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[2] as Workdir;
            assert.strictEqual(undefined, workdir.getAbsolutePath());
        });

        it("parent is undefined relative paths", () => {
            const dockerfile = DockerfileParser.parse("FROM scratch\nWORKDIR\nWORKDIR b\nWORKDIR c");
            let workdir = dockerfile.getInstructions()[1] as Workdir;
            assert.strictEqual(null, workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[2] as Workdir;
            assert.strictEqual(undefined, workdir.getAbsolutePath());
            workdir = dockerfile.getInstructions()[3] as Workdir;
            assert.strictEqual(undefined, workdir.getAbsolutePath());
        });
    });
});
