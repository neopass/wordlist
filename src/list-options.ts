
export interface IListOptions {
  /**
   * Force use of the fallback word list (default: false)
   */
  forceFallback?: boolean
  /**
   * Word list paths to search for in order.
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
  forceFallback: false,
  paths: [
    '/usr/share/dict/words',
  ]
}
