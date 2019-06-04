'use strict'

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const fileStats = promisify(fs.stat)
const readDirectory = promisify(fs.readdir)

/**
 * @param {string} fileOrDir
 *
 * @returns {Promise<boolean>}
 */
async function isDirectory(fileOrDir) {
  const stats = await fileStats(fileOrDir)
  return stats.isDirectory()
}

/**
 * Return a list of paths for a file or directory.
 *
 * @param {string} name
 *
 * @returns {Promise<string[]>}
 */
async function resolvePath(name) {
  if (fs.existsSync(name)) {
    const isDir = await isDirectory(name)

    if (isDir) {
      const result = []
      const names = await readDirectory(name)

      // Recurse directories.
      for (const _name of names) {
        const paths = await resolvePath(path.join(name, _name))
        paths.forEach(p => result.push(p))
      }

      return result

    } else {
      return [name]
    }
  }

  return []
}

/**
 * Return a list of full paths for a list of files and directories.
 *
 * @param {string[]} paths
 *
 * @returns {Promise<string[]>}
 */
async function resolvePaths(paths) {
  /**
   * @type {string[]}
   */
  const fileList = []

  for (const _path of paths) {
    const pathList = await resolvePath(_path)
    pathList.forEach(p => fileList.push(p))
  }

  return fileList
}

module.exports = resolvePaths
