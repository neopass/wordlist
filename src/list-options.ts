
export interface IListOptions {
  /**
   * Word list paths to search for in order. Only the first
   * one found is used. This option is ignored if 'combine'
   * is a non-empty array.
   *
   * default: [
   *  '$default',
   * ]
   */
  paths?: string[]
  /**
   * Word list paths to combine. All found files are used.
   */
  combine?: string[]
  /**
   *
   */
  lowerCaseOnly?: boolean
  /**
   *
   */
  toLowerCase?: boolean
}

/**
 *
 */
export const defaultOptions: IListOptions = {
  paths: [ '$default' ],
  lowerCaseOnly: false,
  toLowerCase: false,
}
