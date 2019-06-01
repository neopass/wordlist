import fs from 'fs'

/**
 * Return true if the given path points to a file.
 */
export function isFile(path: string): boolean {
  if (fs.existsSync(path)) {
    const stats = fs.statSync(path)
    return stats.isFile()
  }
  return false
}
