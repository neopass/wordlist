
export interface IListOptions {
  /**
   * Word list paths to search for in order. Only the first
   * one found is used. This option is ignored if 'combine'
   * is a non-empty array.
   *
   * default: [
   *  '/usr/share/dict/words'
   * ]
   */
  paths?: string[]
  /**
   * Word list paths to combine. All found files are used.
   */
  combine?: string[]
}

/**
 *
 */
export const defaultOptions: IListOptions = {
  paths: [
    '/usr/share/dict/words',
    '$fallback'
  ]
}
