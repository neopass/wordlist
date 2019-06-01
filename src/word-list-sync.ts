import fs from 'fs'
import { IListOptions, defaultOptions } from './list-options'
import { pathAlias } from './path-alias'
import { isFile } from './is-file'

/**
 * Build a word list by combining files in `combined`.
 */
function buildCombined(combined: string[]): string[] {
  // Take all paths that point to a file.
  const paths = combined
    .map(path => pathAlias(path))
    .filter(path => isFile(path))

  if (paths.length === 0) {
    throw new Error('no files found in "combined"')
  }

  // Comine all files into a single list.
  const list = paths.reduce((_list, path) => {
    const buffer = fs.readFileSync(path)
    const words = buffer.toString().split('\n').filter(w => w.length > 0)
    words.forEach(word => _list.push(word))
    return _list
  }, [] as string[])

  return list
}

/**
 * Build a word list from the first found file in `paths`.
 */
function buildSingle(paths: string[]): string[] {
  // Take the first path that points to a file.
  const path = paths
    .map(path => pathAlias(path))
    .filter(path => isFile(path))[0]

  if (path == null) {
    throw new Error('no file found in "paths"')
  }

  const buffer = fs.readFileSync(path)
  const list = buffer.toString().split('\n').filter(w => w.length > 0)

  return list
}

/**
 * Return a system word list or a fallback list, synchronously.
 */
export function wordListSync(options?: IListOptions): string[] {
  const opts = {...defaultOptions, ...options}

  if (Array.isArray(opts.combine) && opts.combine.length > 0) {
    return buildCombined(opts.combine)
  }

  if (Array.isArray(opts.paths) && opts.paths.length > 0) {
    return buildSingle(opts.paths)
  }

  throw new Error('no paths specified in options')
}
