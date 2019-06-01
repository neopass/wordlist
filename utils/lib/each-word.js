'use strict'

const { regexEach } = require('regex-each')

/**
 * @typedef {(word: string) => void} WordCbk
 */

const dia = 'àáâäæãåāçćčèéêëēėęîïíīįìłñńôöòóœøōõßśšûüùúūÿžźż'
const other = '’'
const reWord = new RegExp(`[a-z-'${dia}${other}]+`, 'gi')

/**
 * @param {string} word
 *
 * @returns {string}
 */
function transform(word) {
  return word
    // Single quote.
    .replace(/[’]/, '\'')
}

/**
 * @param {string} line
 * @param {WordCbk} onWord
 *
 * @returns {void}
 */
function eachWord(line, onWord) {
  regexEach(reWord, line, (match) => {
    onWord(transform(match[0]))
  })
}

module.exports = eachWord
