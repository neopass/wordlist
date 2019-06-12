# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2019-06-12
- Mutator function no longer accepts a boolean; it must return a string or string[] for words to be added.

## [0.4.8] - 2019-06-06
- Add `mutator` option to allow custom word transformations/additions/deletions.

## [0.4.7] - 2019-06-05
- Update project config to work with node v6.17.1.
- Update default word list.

## [0.4.6] - 2019-06-04
- Update default word list.

## [0.4.5] - 2019-06-04
- Warn if patterns don't match words or expressions
- Update default word list.

## [0.4.4] - 2019-06-04
- `word-gen` constructs exclusion patterns from a match array instead of using eval.
- Update default word list.

## [0.4.3] - 2019-06-03
- `word-gen` utility recurses source directories (`resolve-paths.js`).

## [0.4.2] - 2019-06-03
- Add unit tests.

## [0.4.1] - 2019-06-03
- Add missing SCOWL sources.

## [0.4.0] - 2019-06-03
- Add SCOWL word sources.
- `word-gen` uses word-splitting logic instead of word iteration to break apart lines of text.

## [0.3.4] - 2019-06-02
- Fix missing fallback.txt.

## [0.3.3] - 2019-06-02
- Fix missing `yargs` package.

## [0.3.2] - 2019-06-02
- Fix missing `regex-each` package.

## [0.3.1] - 2019-06-02
- Add `willUseFallback` function that determines if the fallback list will be used, given provided options.
- Add `wordlist-gen` binary to the package for creating custom word lists.

## [0.3.0] - 2019-06-01
- Removed `forceFallback` option. The fallback can be forced by setting `paths: ['$default']` in the options.
- Added support to combine lists via the `combine` option.

## [0.2.0] - 2019-06-01
Unchanged

## [0.1.1] - 2019-04-24
Under development
