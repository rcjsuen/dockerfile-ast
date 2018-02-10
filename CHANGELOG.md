# Changelog
All notable changes to this project will be documented in this file.

## [0.0.3] - 2018-02-10
### Added
- `From`
  - `getImageNameRange()` ([#16](https://github.com/rcjsuen/dockerfile-ast/issues/16))
- `Instruction`
  - `toString()` ([#4](https://github.com/rcjsuen/dockerfile-ast/issues/4))

### Fixed
- calling `ImageTemplate`'s `getAvailableVariables(number)` with a Dockerfile should only return the variables that are declared in the build stage of the given line ([#15](https://github.com/rcjsuen/dockerfile-ast/issues/15))
- correct `From`'s `getImageName()` to return the right name for the image if it is pointing at a digest ([#17](https://github.com/rcjsuen/dockerfile-ast/issues/17))
- calling `ImageTemplate`'s `getAvailableVariables(number)` on a line with a `FROM` should return variables defined by the Dockerfile's initial `ARG` instructions (if any) ([#18](https://github.com/rcjsuen/dockerfile-ast/issues/18))

## [0.0.2] - 2018-01-20
### Added
- `Argument`
  - `toString()` ([#4](https://github.com/rcjsuen/dockerfile-ast/issues/4))
- `Variable`
  - `isBuildVariable()` ([#13](https://github.com/rcjsuen/dockerfile-ast/issues/13))
  - `isDefined()` ([#12](https://github.com/rcjsuen/dockerfile-ast/issues/12))
  - `isEnvironmentVariable()` ([#13](https://github.com/rcjsuen/dockerfile-ast/issues/13))

### Fixed
- restrict variable resolution to the containing build stage ([#14](https://github.com/rcjsuen/dockerfile-ast/issues/14))

### Removed
- `Argument`'s `getRawValue()` function has been removed ([#10](https://github.com/rcjsuen/dockerfile-ast/issues/10))
```TypeScript
// this convenience function has been removed
let rawValue = argument.getRawValue();
// to retrieve the identical value, use the following code instead
import { TextDocument } from 'vscode-languageserver-types';
let document = TextDocument.create(uri, languageId, version, buffer);
let range = argument.getRange();
let rawValue = buffer.substring(document.offsetAt(range.start), document.offsetAt(range.end));
```

## 0.0.1 - 2017-12-20
### Added
- Dockerfile parser
  - handles escape characters
  - preserves comments
  - provides variable lookup and resolution

[0.0.3]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.1...v0.0.2
