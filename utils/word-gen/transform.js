
const apostrophe = /’/gi
const remove = /'s$/

/**
 * @param {string} word
 *
 * @returns {string}
 */
function preTransform(word) {
  return word
    .replace(apostrophe, `'`)
    .replace(remove, '')
}

/**
 * @param {string} word
 *
 * @returns {string}
 */
function postTransform(word) {
  return word.toLowerCase()
}

module.exports = {
  preTransform,
  postTransform,
}
