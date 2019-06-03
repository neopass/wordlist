'use strict'

/**
 * @typedef {(word: string) => void} WordCbk
 */

// Zero-width space.
const zSpace = '\u200b'
// Zero-width joiner.
const zJoin = '\u200d'
// Ascii 151 (0x97)
const z151 = '\u0097'

// Figure dash.
const figDash = '\u2012'
// Em dash.
const emDash = '\u2013'
// En dash.
const enDash = '\u2014'
// Horizontal bar.
const hBar = '\u2015'
// Swung dash.
const sDash = '\u2053'
// Hyphen.
const hyphen = '\u2010'

const dashes = `${figDash}${emDash}${enDash}${hBar}${sDash}${hyphen}`
const zero = `${zSpace}${zJoin}${z151}`

// Split on spaces and punctuation.
const reSplitter = new RegExp(String.raw`[\[\]\s/.?!,:;(){}~*_=│|…${dashes}-]+`)

const reZeroes = new RegExp(`[${zero}]`, 'g')

/**
 * @todo Move `'s` removal to a post-word transform step.
 */
const qMarks = `'’‘"“”`
const reRemove = new RegExp(`^[${qMarks}]+|[${qMarks}]+$|[${qMarks}]s$`, 'gi')

/**
 * @param {string} line
 * @param {WordCbk} onWord
 *
 * @returns {void}
 */
function eachWord(line, onWord) {
  let words = line.split(reSplitter)
  words = words.map((word) => word.replace(reZeroes, '').replace(reRemove, ''))
  words.forEach((word) => { if (word.length > 0) { onWord(word) } })
  // words.forEach(word => { if (word.startsWith('"')) { console.log(word) }})
}

module.exports = eachWord
