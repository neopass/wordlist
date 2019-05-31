import { IListOptions } from './list-options'
import { listBuilder } from './list-builder'
import { IListInfo } from './list-info'

/**
 *
 */
export async function wordList(options?: IListOptions): Promise<IListInfo> {
  const builder = listBuilder(options)
  const list: string[] = []
  const isFallback = await builder(word => list.push(word))
  return { isFallback, list }
}
