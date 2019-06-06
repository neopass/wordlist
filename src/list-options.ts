
export type Mutator = (word: string) => string|string[]|boolean

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
   * Mutate the list by filtering on lower-case words, converting to
   * lower case, or applying a custom mutator function.
   */
  mutator?: 'only-lower'|'to-lower'|Mutator
}

/**
 *
 */
export const defaultOptions: IListOptions = {
  paths: [ '$default' ],
}
