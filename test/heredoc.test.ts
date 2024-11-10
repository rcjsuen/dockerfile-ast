/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';

import { assertRange } from './util';
import { Copy, DockerfileParser, Heredoc, Instruction } from '../src/main';
import { Run } from '../src/instructions/run';

describe("Heredoc", () => {
    function testHeredoc(keyword: string, heredocsExtractor: (instruction: Instruction) => Heredoc[]): void {
        const keywordLength = keyword.length;
        describe(keyword, () => {
            describe("no heredocs", () => {
                it("instruction only", () => {
                    const instruction = DockerfileParser.parse(keyword).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 0);
                });
    
                /**
                 * INSTRUCTION <<<EOT
                 * <EOT
                 */
                it(`${keyword} <<<EOT\\n<EOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword}  <<<EOT\n<EOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 0);
                });
    
                /**
                 * INSTRUCTION <<'EOT
                 * EOT
                 * 
                 */
                it(`${keyword} <<'EOT\\nEOT\\n`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<'EOT\nEOT\n`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 0);
                });
    
                /**
                 * INSTRUCTION <<"EOT
                 * EOT
                 * 
                 */
                it(`${keyword} <<"EOT\\nEOT\\n`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<"EOT\nEOT\n`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 0);
                });
            });
        
            it(`${keyword} <<--EOT\\n-EOT`, () => {
                const instruction = DockerfileParser.parse(`${keyword} <<--EOT\n-EOT`).getInstructions()[0];
                const heredocs = heredocsExtractor(instruction);
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "-EOT");
                assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 8);
                assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4, 0, keywordLength + 8);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
            });
    
            describe("untabbed delimiter", () => {
                function testSingle(heredoc: string) {
                    const offset = heredoc === "<<-" ? 1 : 0;
                    describe("one line instructions", () => {
                        it(`${keyword} ${heredoc}EOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
    
                        it(`${keyword} ${heredoc}'EOT'`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}'EOT'`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 8 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4 + offset, 0, keywordLength + 7 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
        
                        it(`${keyword} ${heredoc}"EOT"`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}"EOT"`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 8 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4 + offset, 0, keywordLength + 7 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
        
                        it(`${keyword} ${heredoc}FILE cat > file`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}FILE cat > file`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "FILE");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 7 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 7 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
        
                        it(`${keyword} ${heredoc}`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 3 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 3 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
    
                        it(`${keyword} ${heredoc}EOT\\\\n\\`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\\\n\\`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 1);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 1, 1);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });    
    
                        it(`${keyword} ${heredoc}\\\\n\\`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}\\\n\\`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 1);
                            assertRange(heredocs[0].getNameRange(), 1, 1, 1, 1);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
                    });

                    describe("two lines with no content, complete heredoc", () => {
                        it(`${keyword} ${heredoc}EOT\\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 3);
                        });

                        it(`${keyword} ${heredoc}E#OT\\nE#OT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}E#OT\nE#OT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "E#OT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 7 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 7 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
                        });

                        it(`${keyword} ${heredoc}#EOT\\n#EOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}#EOT\n#EOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "#EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 7 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 7 + offset);
                            assert.strictEqual(heredocs[0].getContentRange(), null);
                            assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
                        });
                    });

                    describe("two lines with no content, incomplete heredoc", () => {
                        it(`${keyword} ${heredoc}EOT\\nABC`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\nABC`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });

                        it(`${keyword} ${heredoc}EOT\\n EOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n EOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 4);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });

                        it(`${keyword} ${heredoc}EOT\\nEOT2`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\nEOT2`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 4);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });        

                        it(`${keyword} ${heredoc}EOT\\nEOT2 EOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\nEOT2 EOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 8);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
                    });

                    describe("three lines with content, complete heredoc", () => {
                        it(`${keyword} ${heredoc}EOT\\ncontent\\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\ncontent\nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 7);
                            assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                        });

                        it(`${keyword} ${heredoc}EOT\\nABC\\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\nABC\nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                            assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                        });
                    });

                    describe("complete heredoc with empty lines as content", () => {
                        it(`${keyword} ${heredoc}EOT\\n\\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n\nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 0);
                            assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                        });

                        it(`${keyword} ${heredoc}EOT\\n \\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n \nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 1, 1);
                            assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                        });

                        it(`${keyword} ${heredoc}EOT\\n\\ncontent\\n\\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n\ncontent\n\nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 3, 0);
                            assertRange(heredocs[0].getDelimiterRange(), 4, 0, 4, 3);
                        });        

                        it(`${keyword} ${heredoc}EOT\\n\\n\\nEOT`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n\n\nEOT`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 2, 0);
                            assertRange(heredocs[0].getDelimiterRange(), 3, 0, 3, 3);
                        });
                    });

                    describe("incomplete heredoc with empty lines as content", () => {
                        it(`${keyword} ${heredoc}EOT\\n\\n`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n\n`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 2, 0);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });

                        it(`${keyword} ${heredoc}EOT\\n \\n`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n \n`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 2, 0);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
        
                        it(`${keyword} ${heredoc}EOT\\n\\ncontent\\n`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n\ncontent\n`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 3, 0);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
        
                        it(`${keyword} ${heredoc}EOT\\n\\n\\n`, () => {
                            const instruction = DockerfileParser.parse(`${keyword} ${heredoc}EOT\n\n\n`).getInstructions()[0];
                            const heredocs = heredocsExtractor(instruction);
                            assert.strictEqual(heredocs.length, 1);
                            assert.strictEqual(heredocs[0].getName(), "EOT");
                            assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3 + offset, 0, keywordLength + 6 + offset);
                            assertRange(heredocs[0].getContentRange(), 1, 0, 3, 0);
                            assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                        });
                    });
                }

                describe("single heredoc", () => {
                    testSingle("<<");
                    testSingle("<<-");
                });
            });

            function testTwo(heredoc: string, heredoc2: string) {
                const offset = heredoc.length;
                const offset2 = heredoc2.length;
                describe("two valid heredocs", () => {
                    it(`${keyword} ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\\nabc\\nFILE1\\ndef\\nFILE2`, () => {
                        const instruction = DockerfileParser.parse(`${keyword} ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\nabc\nFILE1\ndef\nFILE2`).getInstructions()[0];
                        const heredocs = heredocsExtractor(instruction);
                        assert.strictEqual(heredocs.length, 2);
                        assert.strictEqual(heredocs[0].getName(), "FILE1");
                        assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                        assertRange(heredocs[0].getNameRange(), 0, keywordLength + 1 + offset, 0, keywordLength + 6 + offset);
                        assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                        assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 5);
                        assert.strictEqual(heredocs[1].getName(), "FILE2");
                        assertRange(heredocs[1].getStartRange(), 0, keywordLength + 22 + offset, 0, keywordLength + 27 + offset + offset2);
                        assertRange(heredocs[1].getNameRange(), 0, keywordLength + 22 + offset + offset2, 0, keywordLength + 27 + offset + offset2);
                        assertRange(heredocs[1].getContentRange(), 3, 0, 3, 3);
                        assertRange(heredocs[1].getDelimiterRange(), 4, 0, 4, 5);
                    });
                });

                describe("one complete, one incomplete", () => {
                    it(`${keyword} ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\\nabc\\nFILE1`, () => {
                        const instruction = DockerfileParser.parse(`${keyword} ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\nabc\nFILE1`).getInstructions()[0];
                        const heredocs = heredocsExtractor(instruction);
                        assert.strictEqual(heredocs.length, 2);
                        assert.strictEqual(heredocs[0].getName(), "FILE1");
                        assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                        assertRange(heredocs[0].getNameRange(), 0, keywordLength + 1 + offset, 0, keywordLength + 6 + offset);
                        assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                        assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 5);
                        assert.strictEqual(heredocs[1].getName(), "FILE2");
                        assertRange(heredocs[1].getStartRange(), 0, keywordLength + 22 + offset, 0, keywordLength + 27 + offset + offset2);
                        assertRange(heredocs[1].getNameRange(), 0, keywordLength + 22 + offset + offset2, 0, keywordLength + 27 + offset + offset2);
                        assert.strictEqual(heredocs[1].getContentRange(), null);
                        assert.strictEqual(heredocs[1].getDelimiterRange(), null);
                    });
    
                    it(`${keyword} ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\\nabc\\nFILE1\\ndef`, () => {
                        const instruction = DockerfileParser.parse(`${keyword} ${heredoc}FILE1 cat > file1 && ${heredoc2}FILE2 cat > file2\nabc\nFILE1\ndef`).getInstructions()[0];
                        const heredocs = heredocsExtractor(instruction);
                        assert.strictEqual(heredocs.length, 2);
                        assert.strictEqual(heredocs[0].getName(), "FILE1");
                        assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 6 + offset);
                        assertRange(heredocs[0].getNameRange(), 0, keywordLength + 1 + offset, 0, keywordLength + 6 + offset);
                        assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                        assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 5);
                        assert.strictEqual(heredocs[1].getName(), "FILE2");
                        assertRange(heredocs[1].getStartRange(), 0, keywordLength + 22 + offset, 0, keywordLength + 27 + offset + offset2);
                        assertRange(heredocs[1].getNameRange(), 0, keywordLength + 22 + offset + offset2, 0, keywordLength + 27 + offset + offset2);
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
                const instruction = DockerfileParser.parse(`${keyword} <<FILE1 <<FILE2 <<FILE3\nFILE1`).getInstructions()[0];
                const heredocs = heredocsExtractor(instruction);
                assert.strictEqual(heredocs.length, 3);
                assert.strictEqual(heredocs[0].getName(), "FILE1");
                assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 8);
                assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 0, keywordLength + 8);
                assert.strictEqual(heredocs[0].getContentRange(), null);
                assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 5);
                assert.strictEqual(heredocs[1].getName(), "FILE2");
                assertRange(heredocs[1].getStartRange(), 0, keywordLength + 9, 0, keywordLength + 16);
                assertRange(heredocs[1].getNameRange(), 0, keywordLength + 11, 0, keywordLength + 16);
                assert.strictEqual(heredocs[1].getContentRange(), null);
                assert.strictEqual(heredocs[1].getDelimiterRange(), null);
                assert.strictEqual(heredocs[2].getName(), "FILE3");
                assertRange(heredocs[2].getStartRange(), 0, keywordLength + 17, 0, keywordLength + 24);
                assertRange(heredocs[2].getNameRange(), 0, keywordLength + 19, 0, keywordLength + 24);
                assert.strictEqual(heredocs[2].getContentRange(), null);
                assert.strictEqual(heredocs[2].getDelimiterRange(), null);
            });
        });

        describe("untabbed delimiter", () => {
            describe("escaped", () => {
                /**
                 * RUN <<\
                 * EOT
                 */
                it(`${keyword} <<\\\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<\\\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 3);
                    assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                /**
                 * RUN <<\
                 * #EOT
                 * EOT
                 */
                it(`${keyword} <<\\\\n#EOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<\\\n#EOT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 2, 3);
                    assertRange(heredocs[0].getNameRange(), 2, 0, 2, 3);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });

                /**
                 * RUN <<E\OT
                 * EOT
                 */
                it(`${keyword} <<E\\OT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<E\\OT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 7);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 0, keywordLength + 7);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 3);
                });

                /**
                 * RUN <<E\\OT
                 * E\OT
                 */
                it(`${keyword} <<E\\\\OT\\nE\\OT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<E\\\\OT\nE\\OT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "E\\OT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 8);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 0, keywordLength + 8);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 1, 0, 1, 4);
                });

                /**
                 * RUN <<E\ \t
                 * OT
                 * EOT
                 */
                it(`${keyword} <<E\\ \\t\\r\\nOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<E\\ \t\r\nOT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 2);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 1, 2);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });

                /**
                 * RUN <<E\
                 *  \t
                 * OT
                 * EOT
                 */
                it(`${keyword} <<E\\\\n \\t\\r\\nOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<E\\\n \t\r\nOT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 2, 2);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 2, 2);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 3, 0, 3, 3);
                });
    
                /**
                 * RUN <<E\
                 * #comment
                 * OT
                 * EOT
                 */
                it(`${keyword} <<E\\\\n#comment\\nOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<E\\\n#comment\nOT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 2, 2);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 2, 2);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 3, 0, 3, 3);
                });

                /**
                 * RUN <<E\
                 * #comment
                 */
                it(`${keyword} <<E\\\\n#comment`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<E\\\n#comment`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "E");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 4);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 3, 0, keywordLength + 4);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
                /**
                 * RUN <<'EOT\
                 * '
                 */
                it(`${keyword} <<'EOT\\\\n'`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<'EOT\\\n'`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 1);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4, 0, keywordLength + 7);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
    
                /**
                 * RUN <<"EOT\
                 * "
                 */
                it(`RUN <<"EOT\\\\n"`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<"EOT\\\n"`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 1);
                    assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4, 0, keywordLength + 7);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
    
                it(`${keyword} <<\\\\nEOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<\\\nEOT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 3);
                    assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });
    
                it(`${keyword} <<\\ \\t\\r\\nEOT\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<\\ \t\r\nEOT\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 3);
                    assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assertRange(heredocs[0].getDelimiterRange(), 2, 0, 2, 3);
                });

                it(`${keyword} <<\\\\n\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<\\\n\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 2, 3);
                    assertRange(heredocs[0].getNameRange(), 2, 0, 2, 3);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
    
                it(`${keyword} <<\\ \\t\\r\\nEOT`, () => {
                    const instruction = DockerfileParser.parse(`${keyword} <<\\ \t\r\nEOT`).getInstructions()[0];
                    const heredocs = heredocsExtractor(instruction);
                    assert.strictEqual(heredocs.length, 1);
                    assert.strictEqual(heredocs[0].getName(), "EOT");
                    assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 1, 3);
                    assertRange(heredocs[0].getNameRange(), 1, 0, 1, 3);
                    assert.strictEqual(heredocs[0].getContentRange(), null);
                    assert.strictEqual(heredocs[0].getDelimiterRange(), null);
                });
            });
        });

        describe("tabbed delimiter", () => {
            it("one heredoc, one tab", () => {
                const instruction = DockerfileParser.parse(`${keyword} <<-EOT\nABC\n\tEOT`).getInstructions()[0];
                const heredocs = heredocsExtractor(instruction);
                assert.strictEqual(heredocs.length, 1);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 7);
                assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4, 0, keywordLength + 7);
                assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                assertRange(heredocs[0].getDelimiterRange(), 2, 1, 2, 4);
            });
    
            it("two heredocs, two tabs", () => {
                const instruction = DockerfileParser.parse(`${keyword} <<-EOT <<-EOT2\nABC\n\tEOT\nDEF\n\t\tEOT2`).getInstructions()[0];
                const heredocs = heredocsExtractor(instruction);
                assert.strictEqual(heredocs.length, 2);
                assert.strictEqual(heredocs[0].getName(), "EOT");
                assertRange(heredocs[0].getStartRange(), 0, keywordLength + 1, 0, keywordLength + 7);
                assertRange(heredocs[0].getNameRange(), 0, keywordLength + 4, 0, keywordLength + 7);
                assertRange(heredocs[0].getContentRange(), 1, 0, 1, 3);
                assertRange(heredocs[0].getDelimiterRange(), 2, 1, 2, 4);
                assert.strictEqual(heredocs[1].getName(), "EOT2");
                assertRange(heredocs[1].getStartRange(), 0, keywordLength + 8, 0, keywordLength + 15);
                assertRange(heredocs[1].getNameRange(), 0, keywordLength + 11, 0, keywordLength + 15);
                assertRange(heredocs[1].getContentRange(), 3, 0, 3, 3);
                assertRange(heredocs[1].getDelimiterRange(), 4, 2, 4, 6);
            });
        });
    }

    testHeredoc("COPY", (instruction: Instruction): Heredoc[] => {
        return (instruction as Copy).getHeredocs();
    });

    testHeredoc("RUN", (instruction: Instruction): Heredoc[] => {
        return (instruction as Run).getHeredocs();
    });
});
