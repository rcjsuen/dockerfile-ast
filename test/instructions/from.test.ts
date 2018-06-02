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
        assert.equal(from.getImageRange(), null);
        assert.equal(from.getImageName(), null);
        assert.equal(from.getImageNameRange(), null);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node", () => {
        let dockerfile = DockerfileParser.parse("FROM node");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node");
        assertRange(from.getImageRange(), 0, 5, 0, 9);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM no${de:-de}", () => {
        let dockerfile = DockerfileParser.parse("FROM no${de:-de}");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "no${de:-de}");
        assertRange(from.getImageRange(), 0, 5, 0, 16);
        assert.equal(from.getImageName(), "no${de:-de}");
        assertRange(from.getImageNameRange(), 0, 5, 0, 16);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node:", () => {
        let dockerfile = DockerfileParser.parse("FROM node:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node:");
        assertRange(from.getImageRange(), 0, 5, 0, 10);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 10, 0, 10);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node:alpine", () => {
        let dockerfile = DockerfileParser.parse("FROM node:alpine");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node:alpine");
        assertRange(from.getImageRange(), 0, 5, 0, 16);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), "alpine");
        assertRange(from.getImageTagRange(), 0, 10, 0, 16);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node:${tag:-latest}", () => {
        let dockerfile = DockerfileParser.parse("FROM node:${tag:-latest}");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node:${tag:-latest}");
        assertRange(from.getImageRange(), 0, 5, 0, 24);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), "${tag:-latest}");
        assertRange(from.getImageTagRange(), 0, 10, 0, 24);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node@", () => {
        let dockerfile = DockerfileParser.parse("FROM node@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node@");
        assertRange(from.getImageRange(), 0, 5, 0, 10);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 10, 0, 10);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 81);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 10, 0, 81);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node@${digest:-sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700}", () => {
        let dockerfile = DockerfileParser.parse("FROM node@${digest:-sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node@${digest:-sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 91);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 10, 0, 91);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM custom/node", () => {
        let dockerfile = DockerfileParser.parse("FROM custom/node");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "custom/node");
        assertRange(from.getImageRange(), 0, 5, 0, 16);
        assert.equal(from.getImageName(), "custom/node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 16);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM custom/node:", () => {
        let dockerfile = DockerfileParser.parse("FROM custom/node:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "custom/node:");
        assertRange(from.getImageRange(), 0, 5, 0, 17);
        assert.equal(from.getImageName(), "custom/node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 16);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 17, 0, 17);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM custom/node:alpine", () => {
        let dockerfile = DockerfileParser.parse("FROM custom/node:alpine");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "custom/node:alpine");
        assertRange(from.getImageRange(), 0, 5, 0, 23);
        assert.equal(from.getImageName(), "custom/node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 16);
        assert.equal(from.getImageTag(), "alpine");
        assertRange(from.getImageTagRange(), 0, 17, 0, 23);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM custom/node@", () => {
        let dockerfile = DockerfileParser.parse("FROM custom/node@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "custom/node@");
        assertRange(from.getImageRange(), 0, 5, 0, 17);
        assert.equal(from.getImageName(), "custom/node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 16);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 17, 0, 17);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM custom/node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM custom/node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "custom/node@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 88);
        assert.equal(from.getImageName(), "custom/node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 16);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 17, 0, 88);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com/base/image", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com/base/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com/base/image");
        assertRange(from.getImageRange(), 0, 5, 0, 35);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 25, 0, 35);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com/base/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com/base/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com/base/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 36);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 25, 0, 35);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 36, 0, 36);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com/base/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com/base/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com/base/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 39);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 25, 0, 35);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 36, 0, 39);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com/base/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com/base/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com/base/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 36);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 25, 0, 35);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 36, 0, 36);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 107);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 25, 0, 35);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 36, 0, 107);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/image", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/image");
        assertRange(from.getImageRange(), 0, 5, 0, 35);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 35);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 36);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 35);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 36, 0, 36);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 39);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 35);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 36, 0, 39);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 39);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 35);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 36, 0, 39);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 36);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 35);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 36, 0, 36);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 107);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 35);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 36, 0, 107);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/base/image", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/base/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/base/image");
        assertRange(from.getImageRange(), 0, 5, 0, 40);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 40);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/base/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/base/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/base/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 41);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 40);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 41, 0, 41);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/base/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/base/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/base/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 44);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 40);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 41, 0, 44);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/base/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/base/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/base/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 41);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 40);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 41, 0, 41);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM privateregistry.com:5000/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM privateregistry.com:5000/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "privateregistry.com:5000/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 112);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 30, 0, 40);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 41, 0, 112);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost/base/image", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost/base/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost/base/image");
        assertRange(from.getImageRange(), 0, 5, 0, 25);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 15, 0, 25);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost/base/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost/base/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost/base/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 26);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 15, 0, 25);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 26, 0, 26);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost/base/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost/base/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost/base/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 29);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 15, 0, 25);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 26, 0, 29);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost/base/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost/base/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost/base/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 26);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 15, 0, 25);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 26, 0, 26);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 97);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 15, 0, 25);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 26, 0, 97);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/image", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/image");
        assertRange(from.getImageRange(), 0, 5, 0, 25);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 25);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 26);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 25);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 26, 0, 26);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 29);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 25);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 26, 0, 29);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 26);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 25);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 26, 0, 26);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 97);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 25);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 26, 0, 97);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/base/image", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/base/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/base/image");
        assertRange(from.getImageRange(), 0, 5, 0, 30);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 30);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/base/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/base/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/base/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 31);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 30);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 31, 0, 31);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/base/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/base/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/base/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 34);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 30);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 31, 0, 34);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/base/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/base/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/base/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 31);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 30);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 31, 0, 31);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM localhost:1234/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM localhost:1234/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "localhost:1234/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 102);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 20, 0, 30);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 31, 0, 102);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123/base/image", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123/base/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123/base/image");
        assertRange(from.getImageRange(), 0, 5, 0, 29);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 19, 0, 29);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123/base/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123/base/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123/base/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 30);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 19, 0, 29);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 30, 0, 30);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123/base/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123/base/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123/base/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 33);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 19, 0, 29);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 30, 0, 33);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123/base/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123/base/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123/base/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 30);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 19, 0, 29);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 30, 0, 30);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 101);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 19, 0, 29);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 30, 0, 101);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/image", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/image");
        assertRange(from.getImageRange(), 0, 5, 0, 29);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 29);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 30);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 29);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 30, 0, 30);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 33);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 29);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 30, 0, 33);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 30);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 29);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 30, 0, 30);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 101);
        assert.equal(from.getImageName(), "image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 29);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 30, 0, 101);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/base/image", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/base/image");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/base/image");
        assertRange(from.getImageRange(), 0, 5, 0, 34);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 34);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/base/image:", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/base/image:");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/base/image:");
        assertRange(from.getImageRange(), 0, 5, 0, 35);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 34);
        assert.equal(from.getImageTag(), "");
        assertRange(from.getImageTagRange(), 0, 35, 0, 35);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/base/image:tag", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/base/image:tag");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/base/image:tag");
        assertRange(from.getImageRange(), 0, 5, 0, 38);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 34);
        assert.equal(from.getImageTag(), "tag");
        assertRange(from.getImageTagRange(), 0, 35, 0, 38);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/base/image@", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/base/image@");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/base/image@");
        assertRange(from.getImageRange(), 0, 5, 0, 35);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 34);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 35, 0, 35);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM 123.22.33.123:2345/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700", () => {
        let dockerfile = DockerfileParser.parse("FROM 123.22.33.123:2345/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "123.22.33.123:2345/base/image@sha256:613685c22f65d01f2264bdd49b8a336488e14faf29f3ff9b6bf76a4da23c4700");
        assertRange(from.getImageRange(), 0, 5, 0, 106);
        assert.equal(from.getImageName(), "base/image");
        assertRange(from.getImageNameRange(), 0, 24, 0, 34);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assertRange(from.getImageDigestRange(), 0, 35, 0, 106);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node AS", () => {
        let dockerfile = DockerfileParser.parse("FROM node AS");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node");
        assertRange(from.getImageRange(), 0, 5, 0, 9);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), null);
    });

    it("FROM node AS stage", () => {
        let dockerfile = DockerfileParser.parse("FROM node AS stage");
        let from = dockerfile.getFROMs()[0];
        assert.equal(from.getImage(), "node");
        assertRange(from.getImageRange(), 0, 5, 0, 9);
        assert.equal(from.getImageName(), "node");
        assertRange(from.getImageNameRange(), 0, 5, 0, 9);
        assert.equal(from.getImageTag(), null);
        assert.equal(from.getImageTagRange(), null);
        assert.equal(from.getImageDigestRange(), null);
        assert.equal(from.getBuildStage(), "stage");
    });
});
