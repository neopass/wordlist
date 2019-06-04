'use strict'

const resolvePaths = require('./resolve-paths')
const readStreams = require('./read-streams')

const reExp = /\/(.+)\/([a-z]*)/
const reComment = /(?: |^)#.+$/

/**
 *
 * @param {string[]} paths
 *
 * @returns {Promise<[string[], RegExp[]]>}
 */
async function getExcludeData(paths) {
  /**
   * @type {string[]}
   */
  const words = []

  /**
   * @type {RegExp[]}
   */
  const patterns = []

  const excludePaths = await resolvePaths(paths)
  await readStreams(excludePaths, (line) => {
    // Handle comments.
    const pattern = line.replace(reComment, '').trim()
    if (pattern.length === 0) { return }

    if (reExp.test(pattern)) {
      // The 'word' is given as a pattern, e.g., /<pattern>/i.
      const [, exp, flags] = reExp.exec(pattern)
      patterns.push(new RegExp(exp, flags))
    } else {
      words.push(pattern)
    }
  })

  return [words, patterns]
}

/**
 * @param {string[]} paths
 *
 * @returns {Promise<(word: string) => boolean>}
 */
async function rejections(paths) {
  const [words, patterns] = await getExcludeData(paths)

  // Create a word matcher, e.g., /^(?:abc|def|ghi)$/i.
  const reWord = new RegExp(`^(?:${words.join('|')})$`, 'i')

  /**
   * @param {string} word
   */
  function reject(word) {
    return reWord.test(word) || patterns.some((pattern) => pattern.test(word))
  }

  return reject
}

module.exports = rejections
