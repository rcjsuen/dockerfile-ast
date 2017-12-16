/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser } from '../../src/main';

describe("FROM", () => {
    describe("single stage", () => {
        it("getImage", () => {
            let dockerfile = DockerfileParser.parse("FROM");
            let froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImage(), null);

            dockerfile = DockerfileParser.parse("FROM node");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImage(), "node");

            dockerfile = DockerfileParser.parse("FROM node:alpine");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImage(), "node:alpine");
        });

        it("getImageName", () => {
            let dockerfile = DockerfileParser.parse("FROM");
            let froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageName(), null);

            dockerfile = DockerfileParser.parse("FROM node");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageName(), "node");

            dockerfile = DockerfileParser.parse("FROM node:alpine");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageName(), "node");
        });

        it("getImageTagRange", () => {
            let dockerfile = DockerfileParser.parse("FROM");
            let froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageTagRange(), null);

            dockerfile = DockerfileParser.parse("FROM node");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageTagRange(), null);

            dockerfile = DockerfileParser.parse("FROM node:");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assertRange(froms[0].getImageTagRange(), 0, 10, 0, 10);

            dockerfile = DockerfileParser.parse("FROM node@");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageTagRange(), null);

            dockerfile = DockerfileParser.parse("FROM node:alpine");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assertRange(froms[0].getImageTagRange(), 0, 10, 0, 16);

            dockerfile = DockerfileParser.parse("FROM node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
            froms = dockerfile.getFROMs();
            assert.equal(froms.length, 1);
            assert.equal(froms[0].getImageTagRange(), null);
        });

        it("getImageDigestRange", () => {
            let dockerfile = DockerfileParser.parse("FROM");
            let froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getImageDigestRange(), null);

            dockerfile = DockerfileParser.parse("FROM node");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getImageDigestRange(), null);

            dockerfile = DockerfileParser.parse("FROM node:");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getImageDigestRange(), null);

            dockerfile = DockerfileParser.parse("FROM node@");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assertRange(froms[0].getImageDigestRange(), 0, 10, 0, 10);

            dockerfile = DockerfileParser.parse("FROM node:alpine");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getImageDigestRange(), null);

            dockerfile = DockerfileParser.parse("FROM node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assertRange(froms[0].getImageDigestRange(), 0, 10, 0, 81);
        });

        it("getBuildStage", () => {
            let dockerfile = DockerfileParser.parse("FROM");
            let froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getBuildStage(), null);

            dockerfile = DockerfileParser.parse("FROM node");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getBuildStage(), null);

            dockerfile = DockerfileParser.parse("FROM node AS");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getBuildStage(), null);

            dockerfile = DockerfileParser.parse("FROM node AS stage");
            froms = dockerfile.getFROMs();
            assert.equal(1, froms.length);
            assert.equal(froms[0].getBuildStage(), "stage");
        });
    });
});
