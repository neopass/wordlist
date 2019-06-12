import { Mutator } from './list-options'

export function mutatorResult(mutator: Mutator, word: string): string[]|void {
  const result = mutator(word)

  // If the result is a string, add it to the list.
  if (typeof result === 'string' && result.length > 0) {
    return [result]
  }

  // If the result is an array, conditionally add all words.
  if (Array.isArray(result)) {
    return result.filter(word => typeof word === 'string' && word.length > 0)
  }
}
