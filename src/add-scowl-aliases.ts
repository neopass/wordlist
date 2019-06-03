import fs from 'fs'
import path from 'path'

export function addScowlAliases(map: Map<string, string>) {
  const scowlPath = path.resolve(__dirname, '../scowl/words')

  if (!fs.existsSync(scowlPath)) {
    return console.error('could not find scowl words at ' + scowlPath)
  }

  const names = fs.readdirSync(scowlPath)
  names.forEach(name => map.set(`$${name}`, path.resolve(__dirname, `../scowl/words/${name}`)))
}
