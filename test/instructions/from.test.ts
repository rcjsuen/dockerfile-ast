/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { assertRange } from '../util';
import { DockerfileParser } from '../../src/main';

describe("FROM", () => {
    it("FROM", () => {
        let dockerfile = DockerfileParser.parse("FROM");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), null);
        assert.equal(from.getImageName(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node", () => {
        let dockerfile = DockerfileParser.parse("FROM node");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node");
        assert.equal(from.getImageName(), "node");
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node:", () => {
        let dockerfile = DockerfileParser.parse("FROM node:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node:");
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageTagRange(), 0, 10, 0, 10);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node:alpine", () => {
        let dockerfile = DockerfileParser.parse("FROM node:alpine");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node:alpine");
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageTagRange(), 0, 10, 0, 16);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node@", () => {
        let dockerfile = DockerfileParser.parse("FROM node@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node@");
        assert.equal(from.getImageName(), "node");
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 10, 0, 10);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 10, 0, 81);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node AS", () => {
        let dockerfile = DockerfileParser.parse("FROM node AS");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node");
        assert.equal(from.getImageName(), "node");
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM node AS stage");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node");
        assert.equal(from.getImageName(), "node");
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), "stage");
    });
});
