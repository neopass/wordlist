import fs from 'fs'
import { IListOptions, defaultOptions } from './list-options'
import { pathAlias } from './path-alias'
import { isFile } from './is-file'
import { reAlpha } from './constants'
import { mutatorResult } from './mutator-result'

/**
 *
 */
function transform(list: string[]) {
  const _list: string[] = []
  list.forEach((word) => {
    if (word.length > 0) {
      _list.push(word.toLowerCase())
    }
  })
  return _list
}

/**
 *
 */
function getList(options: IListOptions, path: string) {
  const buffer = fs.readFileSync(path)
  const list = buffer.toString().split('\n')
  const mutator = options.mutator

  // Run the custom mutator for every word.
  if (typeof mutator === 'function') {
    return list.reduce((list, word) => {
      // Ignore zero-length words.
      if (word.length === 0) { return list }

      // Run the custom mutator.
      const result = mutatorResult(mutator, word)

      if (Array.isArray(result)) {
        list.push.apply(list, result)
      }

      return list
    }, [] as string[])
  }

  // Only allow lower-case words of characters [a-z].
  if (mutator === 'only-lower') {
    return list.filter(word => reAlpha.test(word))
  }

  // Convert words to lower case.
  if (mutator === 'to-lower') {
    return transform(list)
  }

  // Filter out zero-length words.
  return list.filter((word => word.length > 0))
}

/**
 * Build a word list by combining files in `combined`.
 */
function buildCombined(options: IListOptions): string[] {
  const combine = <string[]>options.combine

  // Take all paths that point to a file.
  const paths = combine
    .map(path => pathAlias(path))
    .filter(path => isFile(path))

  if (paths.length === 0) {
    throw new Error('no files found in "combined"')
  }

  // Comine all files into a single list.
  const list = paths.reduce((_list, path) => {
    const words = getList(options, path)
    words.forEach(word => _list.push(word))
    return _list
  }, [] as string[])

  return list
}

/**
 * Build a word list from the first found file in `paths`.
 */
function buildSingle(options: IListOptions): string[] {
  const paths = <string[]>options.paths

  // Take the first path that points to a file.
  const path = paths
    .map(path => pathAlias(path))
    .filter(path => isFile(path))[0]

  if (path == null) {
    throw new Error('no file found in "paths"')
  }

  return getList(options, path)
}

/**
 * Return a system word list or a fallback list, synchronously.
 */
export function wordListSync(options?: IListOptions): string[] {
  const opts = {...defaultOptions, ...options}

  if (Array.isArray(opts.combine) && opts.combine.length > 0) {
    return buildCombined(opts)
  }

  if (Array.isArray(opts.paths) && opts.paths.length > 0) {
    return buildSingle(opts)
  }

  throw new Error('no paths specified in options')
}
