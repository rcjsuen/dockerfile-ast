# Dockerfile AST

[![Build Status](https://travis-ci.org/rcjsuen/dockerfile-ast.svg?branch=master)](https://travis-ci.org/rcjsuen/dockerfile-ast) [![Coverage Status](https://coveralls.io/repos/github/rcjsuen/dockerfile-ast/badge.svg?branch=master)](https://coveralls.io/github/rcjsuen/dockerfile-ast?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The `dockerfile-ast` NPM module is a Dockerfile parser written in TypeScript.
The module provides full programmatic access to a parsed Dockerfile.

Supported features:
- escaped newline detection
  - `escape` parser directive considered when parsing
- comments preserved
  - inlined comments in multiline instructions preserved
- continuous empty newlines honoured (albeit discouraged as of Docker CE 17.09)
- `ARG` and `ENV` variable lookup and resolution

Unsupported:
- `\r` as a a line delimiter
  - only `\r\n` and `\n` are supported as being line delimiters
  - if a `\r` is detected the parser assumes that it is followed by a `\n`

## Development Instructions

If you wish to build and compile this language server, you must first install [Node.js](https://nodejs.org/en/download/) if you have not already done so.
After you have installed Node.js and cloned the repository with Git, you may now proceed to build and compile the language server with the following commands:

```
npm install
npm run build
npm test
```

If you are planning to change the code, use `npm run watch` to get the
TypeScript files transpiled on-the-fly as they are modified.

Once the code has finished compiling, you can connect a language server
client to the server via Node IPC, stdio, or sockets.

## Installation Instructions

To add this library as a dependency to your project, please add `dockerfile-ast` as a dependency in your package.json file.

## Using this Module

```TypeScript
import { DockerfileParser } from 'dockerfile-ast';

const content =
`FROM alpine
ExposE 8080`

let dockerfile = DockerfileParser.parse(content);
let instructions = dockerfile.getInstructions();
for (let instruction in instructions) {
  // FROM
  // EXPOSE
  console.log(instruction.getKeyword());
  // FROM
  // ExposE
  console.log(instruction.getInstruction());
}
```
