# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Argument
  - toString() [(#4)](https://github.com/rcjsuen/dockerfile-ast/issues/4)
- Variable
  - isDefined() [(#12)](https://github.com/rcjsuen/dockerfile-ast/issues/12)

### Fixed
- restrict variable resolution to the containing build stage ([#13](https://github.com/rcjsuen/dockerfile-ast/issues/13))

### Removed
- `Argument`'s `getRawValue()` function has been removed [(#10)](https://github.com/rcjsuen/dockerfile-ast/issues/10)
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

[Unreleased]: https://github.com/rcjsuen/dockerfile-ast/compare/v0.0.1...HEAD
