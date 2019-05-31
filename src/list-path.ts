import fs from 'fs'

interface IPathInfo {
  isFallback: boolean
  path: string
}

/**
 *
 */
export function listPath(paths: string[], fallback: string, force: boolean): IPathInfo {
  if (force) {
    return { path: fallback, isFallback: true }
  }

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    if (fs.existsSync(path)) {
      const stats = fs.statSync(path)
      if (stats.isFile()) {
        return { path, isFallback: false }
      } else {
        throw new Error('given path does not point to a file:' + path)
      }
    }
  }

  return { path: fallback, isFallback: true }
}
