import fs from 'fs'
import { pathAlias } from './path-alias'

/**
 * Return true if the given path points to a file.
 */
function isFile(path: string): boolean {
  if (fs.existsSync(path)) {
    const stats = fs.statSync(path)
    return stats.isFile()
  }
  return false
}

/**
 * Return the first path in the list that points to a file.
 */
export function listPath(paths: string[]): string|undefined {
  for (let i = 0; i < paths.length; i++) {
    const path = pathAlias(paths[i])
    if (isFile(path)) { return path }
  }
}
