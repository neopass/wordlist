
const apostrophe = /’/gi
const remove = /'s$/

/**
 * @param {string} word
 *
 * @returns {string}
 */
function transform(word) {
  return word
    .replace(apostrophe, `'`)
    .replace(remove, '')
}

module.exports = transform
