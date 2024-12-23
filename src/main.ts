/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Position, Range } from 'vscode-languageserver-types';

export { Argument } from './argument';
export { JSONArgument } from './jsonArgument';
import { Comment } from './comment';
export { Comment };

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

    /**
     * Retrieves an array of variable names that are valid at the
     * given line in the Dockerfile (zero-based). If the 
     * line is outside the range of the parsed Dockerfile, an empty
     * array will be returned.
     * 
     * @param line the interested line, zero-based
     * @return the array of variables that may be used by an
     *         instruction at the specified line
     */
    getAvailableVariables(line: number): string[];

    getRange(): Range | null;
}

export interface Dockerfile extends ImageTemplate {

    getAvailableWorkingDirectories(line: number): string[];

    getEscapeCharacter(): string;

    getInitialARGs(): Arg[];

    getComments(): Comment[];

    /**
     * Returns the set of instructions that include the given position.
     * 
     * @param position the position to search in
     * @return the set of instructions that the given position is in,
     *         or null if the position is invalid and is not contained
     *         within the Dockerfile
     */
    getContainingImage(position: Position): ImageTemplate | null;

    /**
     * @deprecated As of 0.0.18, replaced by getDirectives(). If there
     *             is more than one parser directive defined in the
     *             Dockerfile, the first one will be returned.
     */
    getDirective(): ParserDirective | null;

    /**
     * Retrieves the list of parser directives that have been defined
     * in this Dockerfile. It will be in the order it was defined in
     * the file with the first line of the file being the first
     * directive in the returned array.
     * 
     * @return the list of parser directives defined in this
     *         Dockerfile in the order they are defined
     * @since 0.0.18
     */
    getDirectives(): ParserDirective[];

    /**
     * Resolves a variable with the given name at the specified line
     * to its value. If null is returned, then the variable has been
     * defined but no value was given. If undefined is returned, then
     * a variable with the given name has not been defined yet as of
     * the given line.
     * 
     * @param variable the name of the variable to resolve
     * @param line the line number that the variable is on, zero-based
     * @return the value of the variable as defined by an ARG or ENV
     *         instruction, or null if no value has been specified, or
     *         undefined if a variable with the given name has not
     *         been defined or if the document does not contain the
     *         given line number
     */
    resolveVariable(variable: string, line: number): string | null | undefined;

}

import { Parser } from './parser';
export { Flag } from './flag';
import { Instruction } from './instruction';
export { Instruction };
export { Line } from './line';
import { ParserDirective } from './parserDirective';
export { ParserDirective };
export { Property } from './property';
export { Variable } from './variable';

export { Add } from './instructions/add';
import { Arg } from './instructions/arg';
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
export { Heredoc } from './heredoc';
export { JSONInstruction } from './jsonInstruction';
export { Label } from './instructions/label';
export { ModifiableInstruction } from './modifiableInstruction';
export { Onbuild } from './instructions/onbuild';
export { PropertyInstruction } from './propertyInstruction';
export { Run } from './instructions/run';
export { Shell } from './instructions/shell';
export { Stopsignal } from './instructions/stopsignal';
export { User } from './instructions/user';
export { Volume } from './instructions/volume';
import { Workdir } from './instructions/workdir';
export { Workdir };

export enum Keyword {
    ADD = "ADD",
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
    escape = "escape",
    syntax = "syntax"
}

export const DefaultVariables = [
    "ALL_PROXY", "all_proxy",
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
