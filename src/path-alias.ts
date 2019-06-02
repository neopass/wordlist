import path from 'path'

const aliasMap = new Map([
  ['$fallback', path.resolve(__dirname, '../fallback.txt')]
])

/**
 * Return a path alias if it exists, otherwise return the given path.
 */
export function pathAlias(path: string) {
  return aliasMap.get(path) || path
}
