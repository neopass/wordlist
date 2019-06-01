import { lineReader, OnWord } from './line-reader'
import { IListOptions, defaultOptions } from './list-options'
import { listPath } from './list-path'

export { OnWord }

export type ListBuilder = (onWord: OnWord) => Promise<void>

/**
 *
 */
async function builder(opts: IListOptions, onWord: OnWord): Promise<void> {
  const paths = Array.isArray(opts.paths) ? opts.paths : []

  const path = listPath(paths)

  if (path == null) {
    throw new Error('no file found in paths')
  }

  await lineReader(path, onWord)
}

/**
 *
 */
export function listBuilder(options?: IListOptions): ListBuilder {
  const opts = {...defaultOptions, ...options}
  return builder.bind(null, opts)
}
