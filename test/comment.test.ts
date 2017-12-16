/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { Range } from 'vscode-languageserver-types';
import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Comment", () => {
    describe("simple", () => {
        it("getContent", () => {
            let dockerfile = DockerfileParser.parse("# comment ");
            let comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "comment");

            dockerfile = DockerfileParser.parse("#     ");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "");

            dockerfile = DockerfileParser.parse("#=");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "=");

            dockerfile = DockerfileParser.parse("\r\n# comment");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "comment");

            dockerfile = DockerfileParser.parse("# comment\r\n");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "comment");

            dockerfile = DockerfileParser.parse("# comment\r\n# comment 2\r\n# comment 3");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 3);
            assert.equal(comments[0].getContent(), "comment");
            assert.equal(comments[1].getContent(), "comment 2");
            assert.equal(comments[2].getContent(), "comment 3");
        });

        it("getContentRange", () => {
            let dockerfile = DockerfileParser.parse("# comment ");
            let comments = dockerfile.getComments();
            assert.equal(1, comments.length);
            assertRange(comments[0].getContentRange(), 0, 2, 0, 9);

            dockerfile = DockerfileParser.parse("#     ");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContentRange(), null);

            dockerfile = DockerfileParser.parse("# comment\r\n# comment 2\n# comment 3\r\n# comment 4");
            comments = dockerfile.getComments();
            assert.equal(4, comments.length);
            assertRange(comments[0].getContentRange(), 0, 2, 0, 9);
            assertRange(comments[1].getContentRange(), 1, 2, 1, 11);
            assertRange(comments[2].getContentRange(), 2, 2, 2, 11);
            assertRange(comments[3].getContentRange(), 3, 2, 3, 11);
        });

        it("getRange", () => {
            let dockerfile = DockerfileParser.parse("# comment ");
            let comments = dockerfile.getComments();
            assert.equal(1, comments.length);
            assertRange(comments[0].getRange(), 0, 0, 0, 10);

            dockerfile = DockerfileParser.parse("#     ");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assertRange(comments[0].getRange(), 0, 0, 0, 6);

            dockerfile = DockerfileParser.parse("# comment\r\n# comment 2\n# comment 3\r\n# comment 4");
            comments = dockerfile.getComments();
            assert.equal(4, comments.length);
            assertRange(comments[0].getRange(), 0, 0, 0, 9);
            assertRange(comments[1].getRange(), 1, 0, 1, 11);
            assertRange(comments[2].getRange(), 2, 0, 2, 11);
            assertRange(comments[3].getRange(), 3, 0, 3, 11);
        });
    });

    describe("embedded", () => {
        it("getContent", () => {
            let dockerfile = DockerfileParser.parse("RUN ls && \\\n# comment \n ls");
            let comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "comment");

            dockerfile = DockerfileParser.parse("RUN ls && \\\r\n# comment \r\n ls");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "comment");

            dockerfile = DockerfileParser.parse("RUN ls && \\\r\n# comment");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assert.equal(comments[0].getContent(), "comment");
        });

        it("getContentRange", () => {
            let dockerfile = DockerfileParser.parse("RUN ls && \\\n# comment \n ls");
            let comments = dockerfile.getComments();
            assert.equal(1, comments.length);
            assertRange(comments[0].getContentRange(), 1, 2, 1, 9);

            dockerfile = DockerfileParser.parse("RUN ls && \\\r\n# comment \r\n ls");
            comments = dockerfile.getComments();
            assert.equal(1, comments.length);
            assertRange(comments[0].getContentRange(), 1, 2, 1, 9);

            dockerfile = DockerfileParser.parse("RUN ls && \\\r\n# comment");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assertRange(comments[0].getContentRange(), 1, 2, 1, 9);
        });

        it("getRange", () => {
            let dockerfile = DockerfileParser.parse("RUN ls && \\\n# comment \n ls");
            let comments = dockerfile.getComments();
            assert.equal(1, comments.length);
            assertRange(comments[0].getRange(), 1, 0, 1, 10);

            dockerfile = DockerfileParser.parse("RUN ls && \\\r\n# comment \r\n ls");
            comments = dockerfile.getComments();
            assert.equal(1, comments.length);
            assertRange(comments[0].getRange(), 1, 0, 1, 10);

            dockerfile = DockerfileParser.parse("RUN ls && \\\r\n# comment ");
            comments = dockerfile.getComments();
            assert.equal(comments.length, 1);
            assertRange(comments[0].getRange(), 1, 0, 1, 10);
        });
    });
});
