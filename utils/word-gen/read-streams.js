'use strict'

const fs = require('fs')
const readline = require('readline')

/**
 * @typedef {(onLine: string) => void} LineCbk
 */

/**
 * @param {string[]} paths
 *
 * @returns {fs.ReadStream[]}
 */
function createStreams(paths) {
  return paths.map(path => fs.createReadStream(path))
}

/**
 * @param {fs.ReadStream} stream
 * @param {LineCbk} onLine
 *
 * @returns {Promise<void>}
 */
function lineStream(stream, onLine) {
  return new Promise((resolve, reject) => {
    try {
      const lineReader = readline.createInterface(stream)
      lineReader.on('line', onLine)
      lineReader.on('close', resolve)

    } catch (e) {
      reject(e)
    }
  })
}

/**
 * @param {string[]} paths
 * @param {LineCbk} onLine
 *
 * @returns {Promise<void>}
 */
async function readStreams(paths, onLine) {
  const streams = createStreams(paths)
  await Promise.all(streams.map(stream => lineStream(stream, onLine)))
}

module.exports = readStreams
