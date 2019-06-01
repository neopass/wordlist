import { IListOptions } from './list-options'
import { listBuilder } from './list-builder'

/**
 * Return a system word list or a fallback list, asynchronously.
 */
export async function wordList(options?: IListOptions): Promise<string[]> {
  const builder = listBuilder(options)
  const list: string[] = []
  await builder(word => list.push(word))
  return list
}
