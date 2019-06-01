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
 * @param {string} fileOrDir
 *
 * @returns {Promise<string[]>}
 */
async function resolvePath(fileOrDir) {
  const isDir = await isDirectory(fileOrDir)

  if (isDir) {
    const names = await readDirectory(fileOrDir)
    return names.map(n => path.join(fileOrDir, n))
  }

  return [fileOrDir]
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

  for (const p of paths) {
    const pathList = await resolvePath(p)
    fileList.push.apply(fileList, pathList)
  }

  return fileList
}

module.exports = resolvePaths
