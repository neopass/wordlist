# wordlist

Create a word list from a system dictionary. `wordlist` looks for a system dictionary at `/usr/share/dict/words`, and uses a built-in fallback list if the dictionary is not found. Additional dictionary/wordlist paths can be configured via the [options](#options).

```bash
npm install @neopass/wordlist
```

## Usage

There are three functions available for getting words: `wordList`, `wordListSync`, and `listBuilder`.

```javascript
const { wordList, wordListSync, listBuilder } = require('@neopass/wordlist')

// Build the list asynchronously.
wordList().then(li => console.log('list length:', li.list.length))

// Build the list synchronously.
const listInfo = wordListSync()
console.log('isFallback:', listInfo.isFallback)

// Use the list builder.
const builder = listBuilder()
const set = new Set()
builder((word) => set.add(word.toLowerCase()))
  .then(() => console.log('set size:', set.size))
```

Output:

```
isFallback: false
list length: 235886
set size: 234371
```

The size of the dictionary is system-dependent.

## Options

```typescript
export interface IListOptions {
  /**
   * Force use of the fallback word list (default: false)
   */
  forceFallback?: boolean
  /**
   * Word list paths to search for in order. If no file is
   * found, the fallback is used.
   *
   * default: [
   *  '/usr/share/dict/words'
   * ]
   */
  paths?: string[]
}
```

Force the use of the fallback dictionary:

```javascript
const { wordList } = require('@neopass/wordlist')

wordList({forceFallback: true})
  .then(li => console.log(li.isFallback)) // true
```

Specify another system dictionary/dictionaries:

```javascript
const { wordList } = require('@neopass/wordlist')

// Prefer british-english list.
const options = {
  paths: [
    '/usr/share/dict/british-english',
    '/usr/share/dict/american-english',
  ]
}

wordList(options)
  .then(li => console.log(li.list.length)) // 101825
```

## Fallback List

The fallback list is a ~100,000-word, PG-13 list taken from ancient and classic literature, with some other additions such as slang, neologisms, and geography.

Suggestions for additions to the fallback list are welcome by [submitting an issue](https://github.com/neopass/wordlist/issues). Whole lists are definitely preferred to single-word suggestions, e.g., `"notable extraterrestrials"`, `"insects of upper polish honduras"`, or `"names of horses in modern literature"`.

## Creating a Custom Fallback List

You can use the `word-gen` tool in the [wordlist repo](https://github.com/neopass/wordlist) to assemble a custom list:

```bash
git clone git@github.com:neopass/wordlist.git
cd wordlist
```

Set up a directory of book and/or word list files, for example:

```
root
  +-- data
    +-- books
    | +-- modern ship building.txt
    | +-- how to skin a rabbit.txt
    +-- lists
    | +-- names.txt
    | +-- animals.txt
    | +-- slang.txt
```

The structure doesn't really matter. The format should be `utf-8` text, and can consist of one or more words per line.

```
node utils/word-gen --sources data/books data/lists --out my-words.txt
```

`sources` can specify multiple files or directories.

**Note**: only words consisting of letters `a-z` are added, and they're all lower-cased.

### Exclusions

Words can be _scrubbed_ by specifying `exclusions`:

```
node utils/word-gen <...> --exclude data/exclusions
```

Much like the sources, exclusions can consist of multiple files and/or directories in the following format:

```bash
# Exclude whole words (case insensitive):
spoon
fork
tongs

# Exclude patterns (as regular expressions):
/^fudge/i   # words starting with 'fudge'
/crikey/i   # words containing 'crikey'
/shazam$/   # words ending in 'shazam'
/^BLASTED$/ # exact match for uppercase 'blasted'
```
