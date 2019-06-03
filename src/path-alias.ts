import fs from 'fs'
import path from 'path'

/**
 * Add SCOWL source aliases to the map.
 */
function addScowlAliases(map: Map<string, string>) {
  const scowlPath = path.resolve(__dirname, '../scowl/words')

  if (!fs.existsSync(scowlPath)) {
    return console.error('could not find SCOWL words at ' + scowlPath)
  }

  const names = fs.readdirSync(scowlPath)
  names.forEach(name => map.set(`$${name}`, path.resolve(__dirname, `../scowl/words/${name}`)))
}

// Create a map of { alias => path }.
const aliasMap = new Map([
  ['$default', path.resolve(__dirname, '../default.txt')],
])

// Add SCOWL aliases.
addScowlAliases(aliasMap)

/**
 * Return a path alias if it exists, otherwise return the given path.
 */
export function pathAlias(path: string) {
  return aliasMap.get(path) || path
}
