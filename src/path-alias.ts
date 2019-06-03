import path from 'path'
import { addScowlAliases } from './add-scowl-aliases'

const aliasMap = new Map([
  ['$default', path.resolve(__dirname, '../fallback.txt')],
])

addScowlAliases(aliasMap)

/**
 * Return a path alias if it exists, otherwise return the given path.
 */
export function pathAlias(path: string) {
  return aliasMap.get(path) || path
}
