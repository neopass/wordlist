[![Build Status](https://travis-ci.org/neopass/wordlist.svg?branch=master)](https://travis-ci.org/neopass/wordlist)

# wordlist

Generate a word list from various sources, including [SCOWL](http://wordlist.aspell.net). Includes a default list of ~86,000 english words. Additional dictionary/wordlist paths can be configured via the [options](#options).

System dictionaries can also be used, such as `/usr/share/dict/words`, `/usr/share/dict/british-english`, etc.

```bash
npm install @neopass/wordlist
```

## Contents

- [Usage](#usage)
- [Options](#options)
  - [Specify Alternate Word Lists](#specify-alternate-word-lists)
  - [Combine Lists](#combine-lists)
- [The Default List](#the-default-list)
- [Generate a List From SCOWL Sources](#generate-a-list-from-scowl-sources)
  - [SCOWL Aliases](#scowl-aliases)
- [Create a Custom Word List File](#create-a-custom-word-list-file)
  - [Exclusions](#exclusions)
  - [Using the Custom List](#using-the-custom-list)
- [SCOWL License](#scowl-license)

## Usage

There are three functions available for creating word lists: `wordList`, `wordListSync`, and `listBuilder`. The [default list](#the-default-list) is included by default, so no configuration of [options](#options) is required.

`wordList` builds and returns the list asynchronously:

```javascript
const { wordList } = require('@neopass/wordlist')

wordList().then(list => console.log(list.length)) // 86748
```

`wordListSync` builds and returns the list synchronously:

```javascript
const { wordListSync } = require('@neopass/wordlist')

const list = wordListSync()
console.log(list.length) // 86748
```

`listBuilder` calls back each word asynchronously:

```javascript
const { listBuilder } = require('@neopass/wordlist')

const builder = listBuilder()
const list = []

builder(word => list.push(word))
  .then(() => console.log(list.length)) // 86748
```

## Options

```typescript
export interface IListOptions {
  /**
   * Word list paths to search for in order. Only the first
   * one found is used. This option is ignored if 'combine'
   * is a non-empty array.
   *
   * default: [
   *  '$default',
   * ]
   */
  paths?: string[]
  /**
   * Word list paths to combine. All found files are used.
   */
  combine?: string[]
  /**
   * Mutate the list by filtering on lower-case words, converting to
   * lower case, or applying a custom mutator function.
   */
  mutator?: 'only-lower'|'to-lower'|Mutator
}
```

`paths`: Allows [alternate](#specify-alternate-word-lists), fallback lists to be used.

`combine`: Allows multiple lists to be [combined](#combine-lists) into one.

`mutator`:
- `only-lower`: Filter out words that are not comprised of only characters `[a-z]`.
- `to-lower`: Convert words to lower case.
- `Mutator`: `(word: string) => boolean|string|string[]`: a custom function that receives a word and returns one or more words, or a `boolean`. Used for custom transformation of words in the list. Return values:
  - `true`: the word is added to the list.
  - `string`: the returned `string` is added to the list.
  - `string[]`: all returned `string`s are added to the list.

  If any other value is returned (such as `false`) the word is _not_ added.

```javascript
/**
 * Create a custom mutator for splitting hyphenated words
 * and converting them to lower case.
 */
function customMutator(word: string) {
  // Will return ['west', 'ender'] for an input of 'West-ender'.
  return word.split('-').map(word => word.toLowerCase())
}

const options = {
  paths: ['/some/list/path/words.txt'],
  mutator: customMutator,
}

const list = await wordList(options)
assert(list.includes('west'))
assert(list.includes('ender'))
```

### Specify Alternate Word Lists

The `paths` specified in `options` are searched in order and the first list found is used. This allows for the use of system word lists with different names and/or locations on various platforms. A common location for the system word list is `/usr/share/dict/words`.

```javascript
const { wordList } = require('@neopass/wordlist')

// Prefer british-english list.
const options = {
  paths: [
    '/usr/share/dict/british-english',  // if found, use this one
    '/usr/share/dict/american-english', // else if found, use this one
    '/usr/share/dict/words',            // else if found, use this one
    '$default',  // else use this one
  ]
}

wordList(options)
  .then(list => console.log(list.length)) // 101825
```

### Combine Lists

Lists can be combined into one with the `combine` option:

```javascript
const { wordList } = require('@neopass/wordlist')

// Combine multiple dictionaries.
const options = {
  combine: [
    // System dictionary.
    '/usr/share/dict/words', // use this one
    '$default',              // and use this one
  ]
}

wordList(options)
  .then(list => console.log(list.length)) // 335427
```

**Important**: Using `combine` with `wordList`/`wordListSync` will result in duplicates if the lists overlap. It is recommended to use `combine` with `listBuilder` to control how words are added. For example, a `Set` can be used to eliminate duplicates from combined lists:

```javascript
const { listBuilder } = require('@neopass/wordlist')

// Combine multiple lists.
const options = {
  combine: [
    // System dictionary.
    '/usr/share/dict/words',
    // Default list.
    '$default',
  ]
}

// Create a list builder.
const builder = listBuilder(options)

// Create a set to avoid duplicate words.
const set = new Set()

// Run the builder.
builder(word => set.add(word))
  .then(() => console.log(set.size)) // 299569
```

## The Default List

The default list is a ~86,000-word, PG-13, lower-case list taken from english [SCOWL](http://wordlist.aspell.net) sources, with some other additions including slang.

Suggestions for additions to the default list are welcome by [submitting an issue](https://github.com/neopass/wordlist/issues). Whole lists are definitely preferred to single-word suggestions, e.g., `"notable extraterrestrials in history"`, `"insects of upper polish honduras"`, or `"names of horses in modern literature"`. _Suggestions for inappropriate word removal are also welcome (curse words, coarse words/slang, racial slurs, etc.)_.

By default the list alias, `$default`, is included in the options. This allows `wordlist` to create a largish list without any additional configuration.

```javascript
export const defaultOptions: IListOptions = {
  paths: [
    '$default'
  ]
}
```

The `$default` alias (along with [other aliases](#scowl-aliases)) resolves to a path at run time.

## Generate a List From Scowl Sources

[SCOWL](http://wordlist.aspell.net) word lists are included as aliases, and can be used to generate custom lists:

```javascript
const { listBuilder } = require('@neopass/wordlist')

// Combine multiple lists from scowl.
const options = {
  combine: [
    '$english-words.10',
    '$english-words.20',
    '$english-words.35',
    '$special-hacker.50',
  ]
}

// Create a list builder.
const builder = listBuilder(options)

// We'll add the words to a set.
const set = new Set()

// Run the builder.
builder(word => set.add(word))
  .then(() => console.log(set.size)) // 49130
```

**Note:** SCOWL sources contain some words with apostrophes `'s` and also unicode characters. Care should be taken to deal with these depending on your needs. For example, we can transform words to remove any trailing `'s` characters and then only accept words that contain the letters a-z:

```javascript
const { listBuilder } = require('@neopass/wordlist')

/**
 * Remove trailig `'s` from words.
 */
function transform(word) {
  if (word.endsWith(`'s`)) {
    return word.slice(0, -2)
  }
  return word
}

/**
 * Determine if a word should be added.
 */
function accept(word) {
  // Only accept words with characters a-z.
  return (/^[a-z]+$/i).test(word)
}

// Combine multiple lists from scowl.
const options = {
  combine: [
    '$english-words.10',
    '$english-words.20',
    '$english-words.35',
    '$special-hacker.50',
  ]
}

// Create a list builder.
const builder = listBuilder(options)

// Create a set to avoid duplicate words.
const set = new Set()

// Run the builder.
const _builder = builder((word) => {
  word = transform(word)

  if (accept(word)) {
    set.add(word)
  }
})

_builder.then(() => console.log(set.size)) // 38714
```

### Scowl Aliases

A path alias is defined for every [SCOWL source list](https://github.com/neopass/wordlist/blob/master/scowl/words). SCOWL aliases consist of the `$` character followed by the [source file name](https://github.com/neopass/wordlist/blob/master/scowl/words). The below is a representative sample of the available source aliases.

```
$american-abbreviations.70
$american-abbreviations.95
$american-proper-names.80
$american-proper-names.95
$american-upper.50
$american-upper.80
$american-upper.95
$american-words.35
$american-words.80
$australian-abbreviations.35
$australian-abbreviations.80
$australian-contractions.35
$australian-proper-names.35
$australian-proper-names.80
$australian-proper-names.95
$australian-upper.60
$australian-upper.95
$australian-words.35
$australian-words.80
$australian_variant_1-abbreviations.95
$australian_variant_1-contractions.60
$australian_variant_1-proper-names.80
$australian_variant_1-proper-names.95
$australian_variant_1-upper.80
$australian_variant_1-upper.95
$australian_variant_1-words.80
$australian_variant_1-words.95
$australian_variant_2-abbreviations.80
$australian_variant_2-abbreviations.95
$australian_variant_2-contractions.50
$australian_variant_2-contractions.70
$australian_variant_2-proper-names.95
$australian_variant_2-upper.80
$australian_variant_2-words.55
$australian_variant_2-words.95
$british-abbreviations.35
$british-abbreviations.80
$british-proper-names.80
$british-proper-names.95
$british-upper.50
$british-upper.95
$british-words.10
$british-words.20
$british-words.35
$british-words.95
$british_variant_1-abbreviations.55
$british_variant_1-contractions.35
$british_variant_1-contractions.60
$british_variant_1-upper.95
$british_variant_1-words.10
$british_variant_1-words.95
$british_variant_2-abbreviations.70
$british_variant_2-contractions.50
$british_variant_2-upper.35
$british_variant_2-upper.95
$british_variant_2-words.80
$british_variant_2-words.95
$british_z-abbreviations.80
$british_z-abbreviations.95
$british_z-proper-names.80
$british_z-proper-names.95
$british_z-upper.50
$british_z-upper.95
$british_z-words.10
$british_z-words.95
$canadian-abbreviations.55
$canadian-proper-names.80
$canadian-proper-names.95
$canadian-upper.50
$canadian-upper.95
$canadian-words.10
$canadian-words.95
$canadian_variant_1-abbreviations.55
$canadian_variant_1-contractions.35
$canadian_variant_1-proper-names.95
$canadian_variant_1-upper.35
$canadian_variant_1-upper.80
$canadian_variant_1-words.35
$canadian_variant_1-words.95
$canadian_variant_2-abbreviations.70
$canadian_variant_2-contractions.50
$canadian_variant_2-upper.35
$canadian_variant_2-upper.80
$canadian_variant_2-words.35
$canadian_variant_2-words.80
$english-abbreviations.20
$english-abbreviations.80
$english-contractions.35
$english-contractions.80
$english-contractions.95
$english-proper-names.35
$english-proper-names.80
$english-upper.35
$english-upper.80
$english-words.80
$english-words.95
$special-hacker.50
$special-roman-numerals.35
$variant_1-abbreviations.55
$variant_1-abbreviations.95
$variant_1-contractions.35
$variant_1-proper-names.80
$variant_1-proper-names.95
$variant_1-upper.35
$variant_1-upper.80
$variant_1-words.20
$variant_1-words.80
$variant_2-abbreviations.70
$variant_2-abbreviations.95
$variant_2-contractions.50
$variant_2-contractions.70
$variant_2-upper.35
$variant_2-upper.95
$variant_2-words.35
$variant_2-words.95
$variant_3-abbreviations.40
$variant_3-abbreviations.95
$variant_3-words.35
$variant_3-words.95
```

See the [SCOWL Readme](https://github.com/neopass/wordlist/blob/master/scowl/README) for a description of SCOWL sources.

## Create a Custom Word List File

A custom word list from other sources can be assmbled with the `wordlist-gen` binary, or the `word-gen` utility in the [wordlist repo](https://github.com/neopass/wordlist).

From the `@neopass/wordlist` package:

```bash
npx wordlist-gen --sources <path1 path2 ...> [options]
```

From the [wordlist repo](https://github.com/neopass/wordlist):

```bash
git clone git@github.com:neopass/wordlist.git
cd wordlist
```

```bash
node bin/word-gen --sources <path1 path2 ...> [options]
```

First, set up a directory of book and/or word list files, for example:

```
root
  +-- data
    +-- books
    | +-- modern steam engine design.txt
    | +-- how to skin a rabbit.txt
    +-- lists
    | +-- names.txt
    | +-- animals.txt
    | +-- slang.txt
    +-- scowl
    | +-- english-words.10
    | +-- english-words.20
    | +-- english-words.35
    | +-- special-hacker.50
    +-- exclusions
    | +-- patterns.txt
```

The structure doesn't really matter. The format should be `utf-8` text, and can consist of one or more words per line. `exclusions` is optional.

```bash
npx wordlist-gen --sources data/books data/lists data/scowl --out my-words.txt
```

`sources` can specify multiple files and/or directories.

**Note**: only words consisting of letters `a-z` are added, and they're all lower-cased.

### Exclusions

Words can be _scrubbed_ by specifying `exclusions`:

```bash
node bin/word-gen <...> --exclude data/exclusions
```

Much like the sources, exclusions can consist of multiple files and/or directories in the following format:

```bash
# Exclude whole words (case insensitive):
spoon
fork
Tongs

# Exclude patterns (as regular expressions):
/^fudge/i   # words starting with 'fudge'
/crikey/i   # words containing 'crikey'
/shazam$/   # words ending in 'shazam'
/^BLASTED$/ # exact match for uppercase 'blasted'
```

### Using the Custom List

Use `path.resolve` or `path.join` to create an absolute path to your custom word list file:

```javascript
const path = require('path')
const { wordList } = require('@neopass/wordlist')

// Prefer british-english list.
const options = {
  paths: [
    // Use a path relative to the location of this module.
    path.resolve(__dirname, '../my-words.txt')
  ]
}

wordList(options)
  .then(list => console.log(list.length)) // 124030
```

## SCOWL License

```
Copyright 2000-2016 by Kevin Atkinson

Permission to use, copy, modify, distribute and sell these word
lists, the associated scripts, the output created from the scripts,
and its documentation for any purpose is hereby granted without fee,
provided that the above copyright notice appears in all copies and
that both that copyright notice and this permission notice appear in
supporting documentation. Kevin Atkinson makes no representations
about the suitability of this array for any purpose. It is provided
"as is" without express or implied warranty.
```

[Full License](https://github.com/neopass/wordlist/blob/master/scowl/Copyright)
[SCOWL](http://wordlist.aspell.net)
