/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Range } from 'vscode-languageserver-types';
import { Dockerfile } from '../dockerfile';
import { Parser } from '../parser';
import { Instruction } from '../instruction';

export class Onbuild extends Instruction {

    constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }

    public getTrigger(): string | null {
        let trigger = this.getTriggerWord();
        return trigger === null ? null : trigger.toUpperCase();
    }

    public getTriggerWord(): string | null {
        return this.getRangeContent(this.getTriggerRange());
    }

    public getTriggerRange(): Range | null {
        let args = this.getArguments();
        return args.length > 0 ? args[0].getRange() : null;
    }

    public getTriggerInstruction(): Instruction | null {
        let triggerRange = this.getTriggerRange();
        if (triggerRange === null) {
            return null;
        }
        let args = this.getArguments();
        return Parser.createInstruction(
            this.document,
            this.dockerfile,
            this.escapeChar,
            Range.create(args[0].getRange().start, this.getRange().end),
            this.getTriggerWord(),
            triggerRange);
    }
}
