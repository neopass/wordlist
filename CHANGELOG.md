# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Removed `forceFallback` option. The fallback can be forced by setting `paths: ['$fallback']` in the options.
- Added support to combine lists via the `combine` option.

## [0.1.1] - 2019-04-24
Under development
