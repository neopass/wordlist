import { IListOptions, defaultOptions } from './list-options'
import { isFile } from './is-file'
import { readStreams } from './read-streams'
import { pathAlias } from './path-alias'
import { reAlpha } from './constants'

export type OnWord = (word: string) => void

export type ListBuilder = (onWord: OnWord) => Promise<void>

/**
 * Process read streams depending on options.
 */
function processStreams(options: IListOptions, paths: string[], onWord: OnWord): Promise<void> {
  // const transform = options.transform

  // if (typeof transform === 'function') {
  //   return readStreams(paths, (word) => {
  //     const result = transform(word)

  //     if (typeof result === 'string') {
  //       return onWord(result)
  //     }

  //     if (result === true) {
  //       return onWord(word)
  //     }
  //   })
  // }

  if (options.lowerCaseOnly) {
    return readStreams(paths, (word) => {
      if (reAlpha.test(word)) { onWord(word) }
    })
  }

  if (options.toLowerCase) {
    return readStreams(paths, (word) => {
      onWord(word.toLowerCase())
    })
  }

  return readStreams(paths, onWord)
}

/**
 * Build a word list by combining files in `combined`.
 */
function buildCombined(options: IListOptions, onWord: OnWord): Promise<void> {
  const combine = <string[]>options.combine
  // Take all paths that point to a file.
  const paths = combine
    .map(path => pathAlias(path))
    .filter(path => isFile(path))

  if (paths.length === 0) {
    Promise.reject(new Error('no files found in "combined"'))
  }

  return processStreams(options, paths, onWord)
}

/**
 * Build a word list from the first found file in `paths`.
 */
function buildSingle(options: IListOptions, onWord: OnWord): Promise<void> {
  const paths = <string[]>options.paths
  // Take the first path that points to a file.
  const path = paths
    .map(path => pathAlias(path))
    .filter(path => isFile(path))[0]

  if (path == null) {
    return Promise.reject(new Error('no file found in "paths"'))
  }

  // return lineReader(path, onWord)
  return processStreams(options, [path], onWord)
}

/**
 * Run a list builder by calling back every word in a list or lists.
 */
function builder(opts: IListOptions, onWord: OnWord): Promise<void> {
  if (Array.isArray(opts.combine) && opts.combine.length > 0) {
    return buildCombined(opts, onWord)
  }

  if (Array.isArray(opts.paths) && opts.paths.length > 0) {
    return buildSingle(opts, onWord)
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
