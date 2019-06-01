import { IListOptions, defaultOptions } from './list-options'
import { isFile } from './is-file'
import { readStreams } from './read-streams'
import { pathAlias } from './path-alias';

export type OnWord = (word: string) => void

export type ListBuilder = (onWord: OnWord) => Promise<void>

/**
 * Build a word list by combining files in `combined`.
 */
function buildCombined(combined: string[], onWord: OnWord): Promise<void> {
  // Take all paths that point to a file.
  const paths = combined
    .map(path => pathAlias(path))
    .filter(path => isFile(path))

  if (paths.length === 0) {
    Promise.reject(new Error('no files found in "combined"'))
  }

  return readStreams(paths, onWord)
}

/**
 * Build a word list from the first found file in `paths`.
 */
function buildSingle(paths: string[], onWord: OnWord): Promise<void> {
  // Take the first path that points to a file.
  const path = paths
    .map(path => pathAlias(path))
    .filter(path => isFile(path))[0]

  if (path == null) {
    return Promise.reject(new Error('no file found in "paths"'))
  }

  // return lineReader(path, onWord)
  return readStreams([path], onWord)
}

/**
 * Run a list builder by calling back every word in a list or lists.
 */
function builder(opts: IListOptions, onWord: OnWord): Promise<void> {
  if (Array.isArray(opts.combine) && opts.combine.length > 0) {
    return buildCombined(opts.combine, onWord)
  }

  if (Array.isArray(opts.paths) && opts.paths.length > 0) {
    return buildSingle(opts.paths, onWord)
  }

  return Promise.reject(new Error('no paths specified in options'))
}

/**
 * Configure and return a list builder function.
 */
export function listBuilder(options?: IListOptions): ListBuilder {
  const opts = {...defaultOptions, ...options}
  return builder.bind(null, opts)
}
