import fs from 'fs'
import { IListOptions, defaultOptions } from './list-options'
import { listPath } from './list-path'
import { FALLBACK_PATH } from './constants'
import { IListInfo } from './list-info'

/**
 *
 */
export function wordListSync(options?: IListOptions): IListInfo {
  const opts = {...defaultOptions, ...options}
  const paths = opts.paths || []
  const forceFallback = opts.forceFallback || false

  const pathInfo = listPath(paths, FALLBACK_PATH, forceFallback)
  const buffer = fs.readFileSync(pathInfo.path)
  const list = buffer.toString().split('\n').filter(w => w.length > 0)

  return { list, isFallback: pathInfo.isFallback }
}
