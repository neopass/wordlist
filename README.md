# wordlist

Generate a word list from various sources, including [SCOWL](http://wordlist.aspell.net). Includes a default list of ~140,000 english words. Additional dictionary/wordlist paths can be configured via the [options](#options).

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
- [Creating a Custom Word List File](#creating-a-custom-word-list-file)
  - [Exclusions](#exclusions)
  - [Using the Custom List](#using-the-custom-list)
- [SCOWL License](#scowl-license)

## Usage

There are three functions available for creating word lists: `wordList`, `wordListSync`, and `listBuilder`. The [default list](#the-default-list) is included by default, so no configuration of [options](#options) is required.

```javascript
const { wordList, wordListSync, listBuilder } = require('@neopass/wordlist')

// Build the list asynchronously.
wordList().then(list => console.log(list.length)) // 142446

// Build the list synchronously.
const list = wordListSync()
console.log(list.length) // 142446

// Use the list builder.
const builder = listBuilder()
const set = new Set()

// Convert words to lower case.
builder((word) => set.add(word))
  .then(() => console.log(set.size)) // 142446
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
}
```

`paths`: Allows [alternate](#specify-alternate-word-lists), fallback lists to be used.

`combine`: Allows multiple lists to be [combined](#combine-lists) into one.

### Specify Alternate Word Lists

The `paths` specified in `options` are searched in order. The first list found is used. This allows for the use of system word lists with different names and/or locations on various platforms. A common location for the system word list is `/usr/share/dict/words`.

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

Lists can be combined with the `combine` option:

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

The default list is a ~140,000-word, PG-13, lower-case list taken from english [SCOWL](http://wordlist.aspell.net) sources, with some other additions including slang.

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
    '$english-words.80',
    '$special-hacker.50',
    'variant_1-words.95',
    'variant_2-words.95',
    'variant_3-words.95',
  ]
}

// Create a list builder.
const builder = listBuilder(options)

// Create a set to avoid duplicate words.
const set = new Set()

// Run the builder.
builder(word => set.add(word))
  .then(() => console.log(set.size)) // 140749
```

**Note:** SCOWL sources contain some words with apostrophes `'s` and also unicode characters. Care should be taken to deal with these depending on your needs. For example:

```javascript
const { listBuilder } = require('@neopass/wordlist')

/**
 * Determine if a word should be added.
 */
function accepted(word) {
  // Only accept words with characters a-z.
  return (/^[a-z]+$/i).test(word)
}

// Combine multiple lists from scowl.
const options = {
  combine: [
    '$english-words.80',
    '$special-hacker.50',
    'variant_1-words.95',
    'variant_2-words.95',
    'variant_3-words.95',
  ]
}

// Create a list builder.
const builder = listBuilder(options)

// Create a set to avoid duplicate words.
const set = new Set()

// Run the builder.
builder((word) => { if (accepted(word)) { set.add(word) } })
  .then(() => console.log(set.size)) // 128368
```

### Scowl Aliases

See the [SCOWL Readme](https://github.com/neopass/wordlist/blob/master/scowl/README) for a description of SCOWL sources. The below is a representative sample of the [available source aliases](https://github.com/neopass/wordlist/blob/master/scowl/words).

```
$american-abbreviations.70
$american-abbreviations.95
$american-proper-names.80
$american-proper-names.95
$american-upper.50
$american-upper.80
$american-upper.95
$american-words.10
$american-words.20
$american-words.35
$american-words.80
$american-words.95
$australian-abbreviations.35
$australian-abbreviations.80
$australian-abbreviations.95
$australian-contractions.35
$australian-proper-names.35
$australian-proper-names.80
$australian-proper-names.95
$australian-upper.50
$australian-upper.60
$australian-upper.70
$australian-upper.80
$australian-upper.95
$australian-words.10
$australian-words.20
$australian-words.35
$australian-words.40
$australian-words.50
$australian-words.55
$australian-words.60
$australian-words.70
$australian-words.80
$australian-words.95
$australian_variant_1-abbreviations.95
$australian_variant_1-contractions.60
$australian_variant_1-proper-names.80
$australian_variant_1-proper-names.95
$australian_variant_1-upper.80
$australian_variant_1-upper.95
$australian_variant_1-words.10
$australian_variant_1-words.80
$australian_variant_1-words.95
$australian_variant_2-abbreviations.80
$australian_variant_2-abbreviations.95
$australian_variant_2-contractions.50
$australian_variant_2-contractions.70
$australian_variant_2-proper-names.95
$australian_variant_2-upper.80
$australian_variant_2-words.10
$australian_variant_2-words.55
$australian_variant_2-words.95
$british-abbreviations.35
$british-abbreviations.80
$british-abbreviations.95
$british-proper-names.80
$british-proper-names.95
$british-upper.50
$british-upper.80
$british-upper.95
$british-words.10
$british-words.20
$british-words.35
$british-words.80
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
$british_variant_2-words.10
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
$english-abbreviations.10
$english-abbreviations.20
$english-abbreviations.35
$english-abbreviations.80
$english-abbreviations.95
$english-contractions.35
$english-contractions.80
$english-contractions.95
$english-proper-names.35
$english-proper-names.80
$english-upper.10
$english-upper.35
$english-upper.50
$english-upper.80
$english-upper.95
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
$variant_1-upper.95
$variant_1-words.10
$variant_1-words.20
$variant_1-words.80
$variant_2-abbreviations.70
$variant_2-abbreviations.95
$variant_2-contractions.50
$variant_2-contractions.70
$variant_2-upper.35
$variant_2-upper.95
$variant_2-words.20
$variant_2-words.35
$variant_2-words.95
$variant_3-abbreviations.40
$variant_3-abbreviations.95
$variant_3-words.10
$variant_3-words.35
$variant_3-words.95
```

SCOWL aliases consist of the `$` character followed by the [source file name](https://github.com/neopass/wordlist/blob/master/scowl/words).

## Creating a Custom Word List File

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
    | +-- modern ship building.txt
    | +-- how to skin a rabbit.txt
    +-- lists
    | +-- names.txt
    | +-- animals.txt
    | +-- slang.txt
    +-- scowl
    | +-- english-words.80
    | +-- special-hacker.50
    | +-- variant_1-words.95
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
The collective work is Copyright 2000-2016 by Kevin Atkinson as well
as any of the copyrights mentioned below:

  Copyright 2000-2016 by Kevin Atkinson

  Permission to use, copy, modify, distribute and sell these word
  lists, the associated scripts, the output created from the scripts,
  and its documentation for any purpose is hereby granted without fee,
  provided that the above copyright notice appears in all copies and
  that both that copyright notice and this permission notice appear in
  supporting documentation. Kevin Atkinson makes no representations
  about the suitability of this array for any purpose. It is provided
  "as is" without express or implied warranty.

Alan Beale <biljir@pobox.com> also deserves special credit as he has,
in addition to providing the 12Dicts package and being a major
contributor to the ENABLE word list, given me an incredible amount of
feedback and created a number of special lists (those found in the
Supplement) in order to help improve the overall quality of SCOWL.

The 10 level includes the 1000 most common English words (according to
the Moby (TM) Words II [MWords] package), a subset of the 1000 most
common words on the Internet (again, according to Moby Words II), and
frequently class 16 from Brian Kelk's "UK English Wordlist
with Frequency Classification".

The MWords package was explicitly placed in the public domain:

    The Moby lexicon project is complete and has
    been place into the public domain. Use, sell,
    rework, excerpt and use in any way on any platform.

    Placing this material on internal or public servers is
    also encouraged. The compiler is not aware of any
    export restrictions so freely distribute world-wide.

    You can verify the public domain status by contacting

    Grady Ward
    3449 Martha Ct.
    Arcata, CA  95521-4884

    grady@netcom.com
    grady@northcoast.com

The "UK English Wordlist With Frequency Classification" is also in the
Public Domain:

  Date: Sat, 08 Jul 2000 20:27:21 +0100
  From: Brian Kelk <Brian.Kelk@cl.cam.ac.uk>

  > I was wondering what the copyright status of your "UK English
  > Wordlist With Frequency Classification" word list as it seems to
  > be lacking any copyright notice.

  There were many many sources in total, but any text marked
  "copyright" was avoided. Locally-written documentation was one
  source. An earlier version of the list resided in a filespace called
  PUBLIC on the University mainframe, because it was considered public
  domain.

  Date: Tue, 11 Jul 2000 19:31:34 +0100

  > So are you saying your word list is also in the public domain?

  That is the intention.

The 20 level includes frequency classes 7-15 from Brian's word list.

The 35 level includes frequency classes 2-6 and words appearing in at
least 11 of 12 dictionaries as indicated in the 12Dicts package.  All
words from the 12Dicts package have had likely inflections added via
my inflection database.

The 12Dicts package and Supplement is in the Public Domain.

The WordNet database, which was used in the creation of the
Inflections database, is under the following copyright:

  This software and database is being provided to you, the LICENSEE,
  by Princeton University under the following license.  By obtaining,
  using and/or copying this software and database, you agree that you
  have read, understood, and will comply with these terms and
  conditions.:

  Permission to use, copy, modify and distribute this software and
  database and its documentation for any purpose and without fee or
  royalty is hereby granted, provided that you agree to comply with
  the following copyright notice and statements, including the
  disclaimer, and that the same appear on ALL copies of the software,
  database and documentation, including modifications that you make
  for internal use or for distribution.

  WordNet 1.6 Copyright 1997 by Princeton University.  All rights
  reserved.

  THIS SOFTWARE AND DATABASE IS PROVIDED "AS IS" AND PRINCETON
  UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR
  IMPLIED.  BY WAY OF EXAMPLE, BUT NOT LIMITATION, PRINCETON
  UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES OF MERCHANT-
  ABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
  LICENSED SOFTWARE, DATABASE OR DOCUMENTATION WILL NOT INFRINGE ANY
  THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.

  The name of Princeton University or Princeton may not be used in
  advertising or publicity pertaining to distribution of the software
  and/or database.  Title to copyright in this software, database and
  any associated documentation shall at all times remain with
  Princeton University and LICENSEE agrees to preserve same.

The 40 level includes words from Alan's 3esl list found in version 4.0
of his 12dicts package.  Like his other stuff the 3esl list is also in the
public domain.

The 50 level includes Brian's frequency class 1, words appearing
in at least 5 of 12 of the dictionaries as indicated in the 12Dicts
package, and uppercase words in at least 4 of the previous 12
dictionaries.  A decent number of proper names is also included: The
top 1000 male, female, and Last names from the 1990 Census report; a
list of names sent to me by Alan Beale; and a few names that I added
myself.  Finally a small list of abbreviations not commonly found in
other word lists is included.

The name files form the Census report is a government document which I
don't think can be copyrighted.

The file special-jargon.50 uses common.lst and word.lst from the
"Unofficial Jargon File Word Lists" which is derived from "The Jargon
File".  All of which is in the Public Domain.  This file also contain
a few extra UNIX terms which are found in the file "unix-terms" in the
special/ directory.

The 55 level includes words from Alan's 2of4brif list found in version
4.0 of his 12dicts package.  Like his other stuff the 2of4brif is also
in the public domain.

The 60 level includes all words appearing in at least 2 of the 12
dictionaries as indicated by the 12Dicts package.

The 70 level includes Brian's frequency class 0 and the 74,550 common
dictionary words from the MWords package.  The common dictionary words,
like those from the 12Dicts package, have had all likely inflections
added.  The 70 level also included the 5desk list from version 4.0 of
the 12Dics package which is in the public domain.

The 80 level includes the ENABLE word list, all the lists in the
ENABLE supplement package (except for ABLE), the "UK Advanced Cryptics
Dictionary" (UKACD), the list of signature words from the YAWL package,
and the 10,196 places list from the MWords package.

The ENABLE package, mainted by M\Cooper <thegrendel@theriver.com>,
is in the Public Domain:

  The ENABLE master word list, WORD.LST, is herewith formally released
  into the Public Domain. Anyone is free to use it or distribute it in
  any manner they see fit. No fee or registration is required for its
  use nor are "contributions" solicited (if you feel you absolutely
  must contribute something for your own peace of mind, the authors of
  the ENABLE list ask that you make a donation on their behalf to your
  favorite charity). This word list is our gift to the Scrabble
  community, as an alternate to "official" word lists. Game designers
  may feel free to incorporate the WORD.LST into their games. Please
  mention the source and credit us as originators of the list. Note
  that if you, as a game designer, use the WORD.LST in your product,
  you may still copyright and protect your product, but you may *not*
  legally copyright or in any way restrict redistribution of the
  WORD.LST portion of your product. This *may* under law restrict your
  rights to restrict your users' rights, but that is only fair.

UKACD, by J Ross Beresford <ross@bryson.demon.co.uk>, is under the
following copyright:

  Copyright (c) J Ross Beresford 1993-1999. All Rights Reserved.

  The following restriction is placed on the use of this publication:
  if The UK Advanced Cryptics Dictionary is used in a software package
  or redistributed in any form, the copyright notice must be
  prominently displayed and the text of this document must be included
  verbatim.

  There are no other restrictions: I would like to see the list
  distributed as widely as possible.

The 95 level includes the 354,984 single words, 256,772 compound
words, 4,946 female names and the 3,897 male names, and 21,986 names
from the MWords package, ABLE.LST from the ENABLE Supplement, and some
additional words found in my part-of-speech database that were not
found anywhere else.

Accent information was taken from UKACD.

The VarCon package was used to create the American, British, Canadian,
and Australian word list.  It is under the following copyright:

  Copyright 2000-2016 by Kevin Atkinson

  Permission to use, copy, modify, distribute and sell this array, the
  associated software, and its documentation for any purpose is hereby
  granted without fee, provided that the above copyright notice appears
  in all copies and that both that copyright notice and this permission
  notice appear in supporting documentation. Kevin Atkinson makes no
  representations about the suitability of this array for any
  purpose. It is provided "as is" without express or implied warranty.

  Copyright 2016 by Benjamin Titze

  Permission to use, copy, modify, distribute and sell this array, the
  associated software, and its documentation for any purpose is hereby
  granted without fee, provided that the above copyright notice appears
  in all copies and that both that copyright notice and this permission
  notice appear in supporting documentation. Benjamin Titze makes no
  representations about the suitability of this array for any
  purpose. It is provided "as is" without express or implied warranty.

  Since the original words lists come from the Ispell distribution:

  Copyright 1993, Geoff Kuenning, Granada Hills, CA
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions
  are met:

  1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
  3. All modifications to the source code must be clearly marked as
     such.  Binary redistributions based on modified source code
     must be clearly marked as modified versions in the documentation
     and/or other materials provided with the distribution.
  (clause 4 removed with permission from Geoff Kuenning)
  5. The name of Geoff Kuenning may not be used to endorse or promote
     products derived from this software without specific prior
     written permission.

  THIS SOFTWARE IS PROVIDED BY GEOFF KUENNING AND CONTRIBUTORS ``AS IS'' AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED.  IN NO EVENT SHALL GEOFF KUENNING OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
  OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
  SUCH DAMAGE.
```
