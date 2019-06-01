'use strict'

const readline = require('readline')

const hideCursor = '\x1B[?25l'
const showCursor = '\x1B[?25h'
const spinner = ['|', '/', '—', '\\']

/**
 * @typedef {Object} IOptions
 * @property {number} interval
 */

 /**
  * @type {IOptions}
  */
const defaultOptions = {
  interval: 100
}

/**
 * @param {IOptions} [options]
 *
 * @returns {NodeJS.Timeout}
 */
function start(options) {
  const opts = {...defaultOptions, ...options}
  process.stdout.write(hideCursor)

  let count = 0
  const timer = setInterval(() => {
    process.stdout.write(spinner[count++ % spinner.length])
    readline.moveCursor(process.stdout, -1, 0)
  }, opts.interval)

  // Handles CTRL+C.
  process.on('SIGINT', () => {
    this.stop(timer)
    process.exit()
  })

  return timer
}

/**
 * @param {NodeJS.Timeout} timer
 *
 * @returns {void}
 */
function stop(timer) {
  clearInterval(timer)
  process.stdout.write(' \n' + showCursor)
}

module.exports = {
  start,
  stop,
}
