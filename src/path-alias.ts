import path from 'path'

const pathMap = new Map([
  ['$fallback', path.resolve(__dirname, '../words.txt')]
])

/**
 * Return a path alias if it exists, otherwise return the given path.
 */
export function pathAlias(path: string) {
  return pathMap.get(path) || path
}
