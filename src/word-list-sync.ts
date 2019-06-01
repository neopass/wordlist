import fs from 'fs'
import { IListOptions, defaultOptions } from './list-options'
import { listPath } from './list-path'

/**
 *
 */
export function wordListSync(options?: IListOptions): string[] {
  const opts = {...defaultOptions, ...options}
  const paths = Array.isArray(opts.paths) ? opts.paths : []

  const path = listPath(paths)

  if (path == null) {
    throw new Error('no file found in paths')
  }

  const buffer = fs.readFileSync(path)
  const list = buffer.toString().split('\n').filter(w => w.length > 0)

  return list
}
