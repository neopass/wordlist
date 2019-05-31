import { lineReader, OnWord } from './line-reader'
import { IListOptions, defaultOptions } from './list-options'
import { listPath } from './list-path'
import { FALLBACK_PATH } from './constants'

export { OnWord }

export type ListBuilder = (onWord: OnWord) => Promise<boolean>

/**
 *
 */
async function builder(opts: IListOptions, fb: string, onWord: OnWord): Promise<boolean> {
  const paths = opts.paths || []
  const forceFallback = opts.forceFallback || false

  const pathInfo = listPath(paths, fb, forceFallback)
  await lineReader(pathInfo.path, onWord)

  return pathInfo.isFallback
}

/**
 *
 */
export function listBuilder(options?: IListOptions): ListBuilder {
  const opts = {...defaultOptions, ...options}
  return builder.bind(null, opts, FALLBACK_PATH)
}
