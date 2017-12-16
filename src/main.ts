/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Position } from 'vscode-languageserver-types';

export { Argument } from './argument';
import { Comment } from './comment';
export { Comment };
import * as dockerfile from './dockerfile';

export interface ImageTemplate {

    getComments(): Comment[];

    getInstructions(): Instruction[];

    getARGs(): Arg[];

    getCMDs(): Cmd[];

    getCOPYs(): Copy[];

    getENTRYPOINTs(): Entrypoint[];

    getENVs(): Env[];

    getFROMs(): From[];

    getHEALTHCHECKs(): Healthcheck[];

    getOnbuildTriggers(): Instruction[];

    contains(position: Position): boolean;

    getAvailableVariables(line: number): string[];
}

export interface Dockerfile extends ImageTemplate {

    getEscapeCharacter(): string;

    getInitialARGs(): Arg[];

    getComments(): Comment[];

    getContainingImage(position: Position): ImageTemplate;

    getDirective(): ParserDirective | null;

    /**
     * Resolves a variable with the given name based on the context
     * of the specified line.
     * 
     * @return the variable's resolved value at the given line, or
     *         null if the variable is defined but has no value
     *         defined, or undefined if a variable of the given name
     *         has not been declared
     */
    resolveVariable(variable: string, line: number): string | null | undefined;

}

import { Parser } from './parser';
export { Flag } from './flag';
import { ImageTemplate } from './imageTemplate';
import { Instruction } from './instruction';
export { Instruction };
export { Line } from './line';
export { ParserDirective } from './ParserDirective';
export { Property } from './property';
export { Variable } from './variable';

export { Add } from './instructions/add';
import { Arg } from './instructions/arg';
import { ParserDirective } from './parserDirective';
export { Arg };
import { Cmd } from './instructions/cmd';
export { Cmd };
import { Copy } from './instructions/copy';
export { Copy };
import { Entrypoint } from './instructions/entrypoint';
export { Entrypoint };
import { Env } from './instructions/env';
export { Env };
import { From } from './instructions/from';
export { From };
import { Healthcheck } from './instructions/healthcheck';
export { Healthcheck };
export { JSONInstruction } from './jsonInstruction';
export { Label } from './instructions/label';
export { ModifiableInstruction } from './modifiableInstruction';
export { Onbuild } from './instructions/onbuild';
export { PropertyInstruction } from './propertyInstruction';
export { Shell } from './instructions/shell';
export { Stopsignal } from './instructions/stopsignal';
export { User } from './instructions/user';
export { Volume } from './instructions/volume';
export { Workdir } from './instructions/workdir';

export enum Keyword {
    ADD = "ARG",
    ARG = "ARG",
    CMD = "CMD",
    COPY = "COPY",
    ENTRYPOINT = "ENTRYPOINT",
    ENV = "ENV",
    EXPOSE = "EXPOSE",
    FROM = "FROM",
    HEALTHCHECK = "HEALTHCHECK",
    LABEL = "LABEL",
    MAINTAINER = "MAINTAINER",
    ONBUILD = "ONBUILD",
    RUN = "RUN",
    SHELL = "SHELL",
    STOPSIGNAL = "STOPSIGNAL",
    USER = "USER",
    VOLUME = "VOLUME",
    WORKDIR = "WORKDIR"
}

export enum Directive {
    escape = "escape"
}

export const DefaultVariables = [
    "FTP_PROXY", "ftp_proxy",
    "HTTP_PROXY", "http_proxy",
    "HTTPS_PROXY", "https_proxy",
    "NO_PROXY", "no_proxy"
];

export namespace DockerfileParser {

    export function parse(content: string): Dockerfile {
        let parser = new Parser();
        return parser.parse(content);
    }

}
