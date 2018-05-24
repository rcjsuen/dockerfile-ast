# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- `Variable`
  - `getModifier()` ([#27](https://github.com/rcjsuen/dockerfile-ast/issues/27))
  - `getSubstitutionValue()` ([#27](https://github.com/rcjsuen/dockerfile-ast/issues/27))

### Fixed
- resolve references to uninitialized `ARG` variables against `ARG` variables before the first `FROM` if present ([#26](https://github.com/rcjsuen/dockerfile-ast/issues/26))
- change `FROM` to parse its image argument correctly if it is in a private registry ([#28](https://github.com/rcjsuen/dockerfile-ast/issues/28))
- fix parsing issue with quoted keys and values in `ARG`, `ENV`, and `LABEL` ([#30](https://github.com/rcjsuen/dockerfile-ast/issues/30))
- ignore equals signs that are found inside quotes ([#29](https://github.com/rcjsuen/dockerfile-ast/issues/29))

## [0.0.6] - 2018-04-19
### Changed
- `Property`
  - `getRawValue()` has been renamed to `getUnescapedValue()` ([#25](https://github.com/rcjsuen/dockerfile-ast/issues/25))
    - the underlying implementation of the function has not changed so it should be easy for clients to migrate to the new API

### Fixed
- fix parsing of spaces embedded within a variable replacement in `ARG`, `ENV`, and `LABEL` instructions ([#24](https://github.com/rcjsuen/dockerfile-ast/issues/24))

## [0.0.5] - 2018-04-15
### Fixed
- fix resolution of `ARG` variables that are used in a `FROM` ([#22](https://github.com/rcjsuen/dockerfile-ast/issues/22))
- prevent error from being thrown if an invalid line number is specified by `Dockerfile`'s `getAvailableVariables(number)` function ([#23](https://github.com/rcjsuen/dockerfile-ast/issues/23))

## [0.0.4] - 2018-04-03
### Added
- `JSONArgument extends Argument` ([#20](https://github.com/rcjsuen/dockerfile-ast/issues/20))
  - `getJSONRange()`
  - `getJSONValue()`
- `Comment`
  - `toString()` ([#4](https://github.com/rcjsuen/dockerfile-ast/issues/4))

### Changed
- `JSONInstruction`
  - `getJSONStrings()` now returns `JSONArgument[]` instead of `Argument[]`
    - since `JSONArgument` extends `Argument`, any existing code should continue to work with no code changes required

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

[Unreleased]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.6...HEAD
[0.0.6]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.1...v0.0.2
