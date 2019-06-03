import { IListOptions, defaultOptions } from './list-options'
import { pathAlias } from './path-alias'
import { isFile } from './is-file'

/**
 * Determine if the fallback dictionary will be used
 * given the provided options.
 */
export function willUseFallback(options: IListOptions) {
  const opts = {...defaultOptions, ...options}
  const paths = opts.paths || []
  const path = paths
    .map(path => pathAlias(path))
    .filter(path => isFile(path))[0]

  return path === pathAlias('$default')
}
