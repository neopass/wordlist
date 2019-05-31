const reAlpha = /^[a-z]+$/i

/**
 * @param {string} word
 *
 * @returns {boolean}
 */
function accept(word) {
  return reAlpha.test(word)
}

module.exports = accept
