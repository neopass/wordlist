'use strict'

const fs = require('fs')
const spinner = require('./spinner')
const resolvePaths = require('./resolve-paths')
const listBuilder = require('./list-builder')
const accept = require('./accept')
const rejections = require('./rejections')
const options = require('./options')
const transform = require('./transform')

/**
 * @typedef {Object} IArguments
 * @property {string[]} sources
 * @property {string[]} exclude
 * @property {string} out
 */

/**
 * Run the list builder.
 */
async function wordGen() {
  const opts = options()

  /**
   * Resolve given sources (files or directories) to full paths.
   *
   * @type {string[]}
   */
  let sourcePaths

  try {
    sourcePaths = await resolvePaths(opts.sources)
  } catch (error) {
    console.error('error resolving sources')
    return console.error(error)
  }

  // Check that we've resolved at least one path.
  if (sourcePaths.length === 0) {
    if (opts.sources.length === 0) {
      return console.error('no sources given')
    }
    return console.error('no source files found in "' + opts.sources + '"')
  }

  // Get reject function.
  const reject = await rejections(opts.exclude)

  /**
   * Generate the word list.
   *
   * @type {string[]}
   */
  let wordList

  process.stdout.write('Generating word list... ')
  const spinId = spinner.start()

  const excludeSet = new Set()

  try {
    wordList = await listBuilder(sourcePaths, (word) => {
      word = transform(word)
      const accepted = accept(word)
      const rejected = reject(word)
      if (accepted && !rejected) {
        return word.toLowerCase()
      } else {
        excludeSet.add(word.toLowerCase())
      }
    })
    wordList.sort()

  } catch (error) {
    console.error('error building word list')
    return console.error(error)
  }

  spinner.stop(spinId)
  console.log('  words collected:', wordList.length)

  // Write the excluded file.
  if (excludeSet.size > 0)  {
    const excluded = [...excludeSet]
    const stream = fs.createWriteStream('excluded.txt')
    excluded.forEach(word => stream.write(word + '\n'))
    stream.close()
    console.log('  excluded words written to excluded.txt')
  }

  // Write the ouptut file.
  if (opts.out) {
    const outStream = fs.createWriteStream(opts.out)
    wordList.forEach(word => outStream.write(word + '\n'))
    outStream.close()
    console.log('  word list file written to ' + opts.out)
  }
}

module.exports = wordGen
