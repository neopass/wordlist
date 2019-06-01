
export interface IListOptions {
  /**
   * Word list paths to search for in order. Only the first
   * one found is used.
   *
   * default: [
   *  '/usr/share/dict/words'
   * ]
   */
  paths?: string[]
}

/**
 *
 */
export const defaultOptions: IListOptions = {
  paths: [
    '/usr/share/dict/words',
  ]
}
