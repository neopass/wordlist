'use strict'

const yargs = require('yargs')

/**
 * @typedef {Object} IArguments
 * @property {string[]} sources
 * @property {string[]} exclude
 * @property {string} out
 */

/**
 * @returns {IArguments}
 */
function options() {
  /**
   * @type {IArguments}
   */
  // @ts-ignore
  const argv = yargs
    .usage('Usage: node $0 --sources <path1 path2 ...> [options]')

    .describe('sources', 'word source files or directories to load')
    .demandOption('sources')
    .array('sources')
    .alias('sources', 's')

    .describe('exclude', 'exclude pattern files or directories to load')
    .array('exclude')
    .alias('exclude', 'e')

    .describe('out', 'out file path')
    .alias('out', '0')
    .alias('out', 'o')
    .argv

  const sources = argv.sources || []
  const exclude = argv.exclude || []
  const out = argv.out

  return {
    sources,
    exclude,
    out,
  }
}



// if (sources.length === 0) {
//   yargs.showHelp()
// }

// module.exports = {
//   sources,
//   exclude,
//   outPath,
// }

module.exports = options
