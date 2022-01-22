/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';
import { Run } from '../src/instructions/run';

describe("Heredoc", () => {
    it("no heredocs", () => {
        const instruction = DockerfileParser.parse("RUN").getInstructions()[0] as Run;
        const heredocs = instruction.getHeredocs();
        assert.strictEqual(heredocs.length, 0);
    });

    it("RUN <<--EOT\\n-EOT", () => {
        const instruction = DockerfileParser.parse("RUN <<--EOT\n-EOT").getInstructions()[0] as Run;
        const heredocs = instruction.getHeredocs();
        assert.strictEqual(heredocs.length, 1);
        assert.strictEqual(heredocs[0].getName(), "-EOT");
        assertRange(heredocs[0].getStartRange(), 0, 4, 0, 11);
        assertRange(heredocs[0].getNameRange(), 0, 7, 0, 11);
        assert.strictEqual(heredocs[0].getContentRange(), null);
        assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
    });

    describe("untabbed delimiter", () => {
        function testSingle(heredoc: string) {
            const offset = heredoc === "<<-" ? 1 : 0;
            describe("one line instructions", () => {
                it(`RUN ${heredoc}EOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}'EOT'`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}'EOT'`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 11 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 7 + offset, 0, 10 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}"EOT"`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}"EOT"`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 11 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 7 + offset, 0, 10 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}FILE cat > file`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}FILE cat > file`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "FILE");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 10 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 6 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 6 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\\\n\\`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\\\n\\`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 1, 1);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 1, 1);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}\\\\n\\`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}\\\n\\`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 1, 1);
                    assertRange(heredocs[0].getNameRange(), 1, 1, 1, 1);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
            });

            describe("two lines with no content, complete heredoc", () => {
                it(`RUN ${heredoc}EOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 3);
                });

                it(`RUN ${heredoc}E#OT\\nE#OT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}E#OT\nE#OT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "E#OT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 10 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
                });

                it(`RUN ${heredoc}#EOT\\n#EOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}#EOT\n#EOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "#EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 10 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
                });

                it(`RUN ${heredoc}#EOT\\n#EOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}#EOT\n#EOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "#EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 10 + offset);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
                });
            });

            describe("two lines with no content, incomplete heredoc", () => {
                it(`RUN ${heredoc}EOT\\nABC`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\nABC`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\n EOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n EOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 4);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\nEOT2`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\nEOT2`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 4);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\nEOT2 EOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\nEOT2 EOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 8);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
            });

            describe("three lines with content, complete heredoc", () => {
                it(`RUN ${heredoc}EOT\\ncontent\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\ncontent\nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 7);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });

                it(`RUN ${heredoc}EOT\\nABC\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\nABC\nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });
            });

            describe("complete heredoc with empty lines as content", () => {
                it(`RUN ${heredoc}EOT\\n\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n\nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 0);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });

                it(`RUN ${heredoc}EOT\\n \\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n \nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 1);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });

                it(`RUN ${heredoc}EOT\\n\\ncontent\\n\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n\ncontent\n\nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 3, 0);
                    assertRange(heredocs[0].getDelimiterRange(), 4, 0, 4, 3);
                });

                it(`RUN ${heredoc}EOT\\n\\n\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n\n\nEOT`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 2, 0);
                    assertRange(heredocs[0].getDelimiterRange(), 3, 0, 3, 3);
                });
            });

            describe("incomplete heredoc with empty lines as content", () => {
                it(`RUN ${heredoc}EOT\\n\\n`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n\n`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 2, 0);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\n \\n`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n \n`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 2, 0);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\n\\ncontent\\n`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n\ncontent\n`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 3, 0);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}EOT\\n\\n\\n`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}EOT\n\n\n`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 6 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 3, 0);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
            });
        }

        describe("single heredoc", () => {
            testSingle("<<");
            testSingle("<<-");
        });

        function testTwo(heredoc: string, heredoc2: string) {
            const offset = heredoc.length;
            const offset2 = heredoc2.length;
            describe("two valid heredocs", () => {
                it(`RUN ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\\nabc\\nFILE1\\ndef\\nFILE2`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\nabc\nFILE1\ndef\nFILE2`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 2);
                    assert.strictEqual(heredocs[0].getName(), "FILE1");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 4 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 5);
                    assert.strictEqual(heredocs[1].getName(), "FILE2");
                    assertRange(heredocs[1].getStartRange(), 0, 25 + offset, 0, 30 + offset + offset2);
                    assertRange(heredocs[1].getNameRange(), 0, 25 + offset + offset2, 0, 30 + offset + offset2);
                    assertRange(heredocs[1].getContentRange(), 3, 0, 3, 3);
                    assertRange(heredocs[1].getDelimiterRange(), 4, 0, 4, 5);
                });
            });

            describe("one complete, one incomplete", () => {
                it(`RUN ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\\nabc\\nFILE1`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\nabc\nFILE1`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 2);
                    assert.strictEqual(heredocs[0].getName(), "FILE1");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 4 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 5);
                    assert.strictEqual(heredocs[1].getName(), "FILE2");
                    assertRange(heredocs[1].getStartRange(), 0, 25 + offset, 0, 30 + offset + offset2);
                    assertRange(heredocs[1].getNameRange(), 0, 25 + offset + offset2, 0, 30 + offset + offset2);
                    assert.strictEqual(heredocs[1].getContentRange(), null);
                    assert.strictEqual(heredocs[1].getDelimiterRange(), null);
                });

                it(`RUN ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\\nabc\\nFILE1\\ndef`, () => {
                    const instruction = DockerfileParser.parse(`RUN ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\nabc\nFILE1\ndef`).getInstructions()[0] as Run;
                    const heredocs = instruction.getHeredocs();
                    assert.strictEqual(heredocs.length, 2);
                    assert.strictEqual(heredocs[0].getName(), "FILE1");
                    assertRange(heredocs[0].getStartRange(), 0, 4, 0, 9 + offset);
                    assertRange(heredocs[0].getNameRange(), 0, 4 + offset, 0, 9 + offset);
                    assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 5);
                    assert.strictEqual(heredocs[1].getName(), "FILE2");
                    assertRange(heredocs[1].getStartRange(), 0, 25 + offset, 0, 30 + offset + offset2);
                    assertRange(heredocs[1].getNameRange(), 0, 25 + offset + offset2, 0, 30 + offset + offset2);
                    assertRange(heredocs[1].getContentRange(), 3, 0, 3, 3);
                    assert.strictEqual(heredocs[1].getDelimiterRange(), null);
                });
            });
        }

        describe("two heredocs", () => {
            testTwo("<<", "<<");
            testTwo("<<", "<<-");
            testTwo("<<-", "<<");
            testTwo("<<-", "<<-");
        });

        it("one complete with no content and two incomplete with no content", () => {
            const instruction = DockerfileParser.parse("RUN <<FILE1 <<FILE2 <<FILE3\nFILE1").getInstructions()[0] as Run;
            const heredocs = instruction.getHeredocs();
            assert.strictEqual(heredocs.length, 3);
            assert.strictEqual(heredocs[0].getName(), "FILE1");
            assertRange(heredocs[0].getStartRange(), 0, 4, 0, 11);
            assertRange(heredocs[0].getNameRange(), 0, 6, 0, 11);
            assert.strictEqual(heredocs[0].getContentRange(), null);
            assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 5);
            assert.strictEqual(heredocs[1].getName(), "FILE2");
            assertRange(heredocs[1].getStartRange(), 0, 12, 0, 19);
            assertRange(heredocs[1].getNameRange(), 0, 14, 0, 19);
            assert.strictEqual(heredocs[1].getContentRange(), null);
            assert.strictEqual(heredocs[1].getDelimiterRange(), null);
            assert.strictEqual(heredocs[2].getName(), "FILE3");
            assertRange(heredocs[2].getStartRange(), 0, 20, 0, 27);
            assertRange(heredocs[2].getNameRange(), 0, 22, 0, 27);
            assert.strictEqual(heredocs[2].getContentRange(), null);
            assert.strictEqual(heredocs[2].getDelimiterRange(), null);
        });

        describe("escaped", () => {

            /**
             * RUN <<\
             * EOT
             */
            it("RUN <<\\\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<\\\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 3);
                assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });

            /**
             * RUN <<\
             * #EOT
             * EOT
             */
            it("RUN <<\\\\n#EOT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<\\\n#EOT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 2, 3);
                assertRange(heredocs[0].getNameRange(), 2, 0, 2, 3);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });

            /**
             * RUN <<E\OT
             * EOT
             */
            it("RUN <<E\\OT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<E\\OT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10);
                assertRange(heredocs[0].getNameRange(), 0, 6, 0, 10);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 3);
            });

            /**
             * RUN <<E\\OT
             * E\OT
             */
            it("RUN <<E\\\\OT\\nE\\OT", () => {
                const instruction = DockerfileParser.parse("RUN <<E\\\\OT\nE\\OT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "E\\OT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 0, 11);
                assertRange(heredocs[0].getNameRange(), 0, 6, 0, 11);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
            });

            /**
             * RUN <<E\ \t
             * OT
             * EOT
             */
            it("RUN <<E\\ \\t\\r\\nOT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<E\\ \t\r\nOT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 2);
                assertRange(heredocs[0].getNameRange(), 0, 6, 1, 2);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
            });

            /**
             * RUN <<E\
             *  \t
             * OT
             * EOT
             */
            it("RUN <<E\\\\n \\t\\r\\nOT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<E\\\n \t\r\nOT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 2, 2);
                assertRange(heredocs[0].getNameRange(), 0, 6, 2, 2);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 3, 0, 3, 3);
            });

            /**
             * RUN <<E\
             * #comment
             * OT
             * EOT
             */
            it("RUN <<E\\\\n#comment\\nOT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<E\\\n#comment\nOT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 2, 2);
                assertRange(heredocs[0].getNameRange(), 0, 6, 2, 2);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 3, 0, 3, 3);
            });

            /**
             * RUN <<E\
             * #comment
             */
            it("RUN <<E\\\\n#comment", () => {
                const instruction = DockerfileParser.parse("RUN <<E\\\n#comment").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "E");
                assertRange(heredocs[0].getStartRange(), 0, 4, 0, 7);
                assertRange(heredocs[0].getNameRange(), 0, 6, 0, 7);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });

            /**
             * RUN <<'EOT\
             * '
             */
            it("RUN <<'EOT\\\\n'", () => {
                const instruction = DockerfileParser.parse("RUN <<'EOT\\\n'").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 1);
                assertRange(heredocs[0].getNameRange(), 0, 7, 0, 10);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });

            /**
             * RUN <<"EOT\
             * "
             */
            it(`RUN <<"EOT\\\\n"`, () => {
                const instruction = DockerfileParser.parse(`RUN <<"EOT\\\n"`).getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 1);
                assertRange(heredocs[0].getNameRange(), 0, 7, 0, 10);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });

            it("RUN <<\\\\nEOT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<\\\nEOT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 3);
                assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
            });

            it("RUN <<\\ \\t\\r\\nEOT\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<\\ \t\r\nEOT\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 3);
                assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
            });

            it("RUN <<\\\\n\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<\\\n\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 2, 3);
                assertRange(heredocs[0].getNameRange(), 2, 0, 2, 3);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });

            it("RUN <<\\ \\t\\r\\nEOT", () => {
                const instruction = DockerfileParser.parse("RUN <<\\ \t\r\nEOT").getInstructions()[0] as Run;
                const heredocs = instruction.getHeredocs();
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, 4, 1, 3);
                assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assert.strictEqual(heredocs[0].getDelimiterRange(), null);
            });
        });
    });

    describe("tabbed delimiter", () => {
        it("one heredoc, one tab", () => {
            const instruction = DockerfileParser.parse("RUN <<-EOT\nABC\n\tEOT").getInstructions()[0] as Run;
            const heredocs = instruction.getHeredocs();
            assert.strictEqual(heredocs.length, 1);
            assert.strictEqual(heredocs[0].getName(), "EOT");
            assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10);
            assertRange(heredocs[0].getNameRange(), 0, 7, 0, 10);
            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
            assertRange(heredocs[0].getDelimiterRange(), 2, 1, 2, 4);
        });

        it("two heredocs, two tabs", () => {
            const instruction = DockerfileParser.parse("RUN <<-EOT <<-EOT2\nABC\n\tEOT\nDEF\n\t\tEOT2").getInstructions()[0] as Run;
            const heredocs = instruction.getHeredocs();
            assert.strictEqual(heredocs.length, 2);
            assert.strictEqual(heredocs[0].getName(), "EOT");
            assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10);
            assertRange(heredocs[0].getNameRange(), 0, 7, 0, 10);
            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
            assertRange(heredocs[0].getDelimiterRange(), 2, 1, 2, 4);
            assert.strictEqual(heredocs[0].getName(), "EOT");
            assertRange(heredocs[0].getStartRange(), 0, 4, 0, 10);
            assertRange(heredocs[0].getNameRange(), 0, 7, 0, 10);
            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
            assertRange(heredocs[0].getDelimiterRange(), 2, 1, 2, 4);
        });
    });
});
