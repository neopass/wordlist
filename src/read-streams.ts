import fs from 'fs'
import readline from 'readline'

type LineCbk = (line: string) => void

/**
 * Map paths to read streams.
 */
function createStreams(paths: string[]): fs.ReadStream[] {
  return paths.map(path => fs.createReadStream(path))
}

/**
 * Issue a callback for each line of the given stream.
 */
function lineReader(stream: fs.ReadStream, onLine: LineCbk): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const lineReader = readline.createInterface(stream)
      lineReader.on('line', onLine)
      lineReader.on('close', resolve)

    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Read the files for all given paths and call back each line.
 */
export async function readStreams(paths: string[], onLine: LineCbk) {
  const streams = createStreams(paths)
  await Promise.all(streams.map(stream => lineReader(stream, onLine)))
}
