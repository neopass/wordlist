const readStreams = require('../lib/read-streams')
const eachWord = require('./each-word')

/**
 * @typedef {(word: string) => boolean|string} OnWord
 */

/**
 * @param {string[]} files
 * @param {OnWord} onWord
 *
 * @returns {Promise<string[]>}
 */
async function listBuilder(files, onWord) {
  /**
   * @type {Set<string>}
   */
  const wordSet = new Set()

  await readStreams(files, (line) => {
    eachWord(line, (word) => {
      const result = onWord(word)

      // If the result is true, add the word to the set.
      if (result === true) {
        return wordSet.add(word)
      }

      // If the result is a string, assume it's a word and add it to the set.
      if (typeof result === 'string' && result.length > 0) {
        return wordSet.add(result)
      }
    })
  })

  return Array.from(wordSet)
}

module.exports = listBuilder
