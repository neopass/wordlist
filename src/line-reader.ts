import fs from 'fs'
import readline from 'readline'

export type OnWord = (word: string) => void

/**
 *
 */
export function lineReader(path: string, onWord: OnWord): Promise<void> {

  return new Promise((resolve, reject) => {
    try {
      const stream = fs.createReadStream(path)
      const reader = readline.createInterface(stream)

      if (typeof onWord !== 'function') {
        throw new Error('onWord is not a function')
      }

      reader.on('line', onWord)
      reader.on('close', resolve)

    } catch (error) {
      reject(error)
    }
  })
}
