import assert from 'assert'
import path from 'path'
import { wordList, wordListSync, IListOptions } from '../src'

const testWordsPath = path.resolve(__dirname, '../test/data/words.txt')

/**
 * Custom mutator function (splits hyphenated words).
 */
function splitMutator(word: string): string[] {
  return word.split('-').filter(word => word.length > 0)
}

/**
 * Custom mutator function (filters for upper-case words).
 */
function upperMutator(word: string): string|void {
  if (/^[A-Z]+$/.test(word)) {
    return word
  }
}

/**
 * Custom mutator function (makes words possessive).
 */
function possessiveMutator(word: string): string {
  return `${word}'s`
}

describe('wordList', () => {
  it('works with no configuration', async () => {
    const list = await wordList()
    assert.strictEqual(list.length, 86748)
  })

  it('allows paths overrides', async () => {
    const list = await wordList({paths: ['$special-hacker.50']})
    assert.strictEqual(list.length, 1649)
  })

  it('falls back when path not found', async () => {
    const list = await wordList({paths: ['/no/file/here', '$special-hacker.50']})
    assert.strictEqual(list.length, 1649)
  })

  it('combines files', async () => {
    const list = await wordList({combine: ['$special-hacker.50', '$variant_1-words.95']})
    assert.strictEqual(list.length, 2014)
  })

  it(`works with 'to-lower' mutator option`, async () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: 'to-lower', combine: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 8)

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 8)
  })

  it(`works with 'only-lower' mutator option`, async () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: 'only-lower', combine: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 2)

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 2)
  })

  it('works with a custom mutator function (boolean)', async () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: upperMutator, combine: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('ABC'))
    assert(list.includes('PQR'))
    assert(list.includes('YZ'))

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('ABC'))
    assert(list.includes('PQR'))
    assert(list.includes('YZ'))
  })

  it('works with a custom mutator function (string)', async () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: possessiveMutator, combine: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 8)
    assert(list.includes(`ABC's`))
    assert(list.includes(`Def's`))

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 8)
    assert(list.includes(`ABC's`))
    assert(list.includes(`Def's`))
  })

  it('works with a custom mutator function (string[])', async () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: splitMutator, combine: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 9)
    assert(list.includes('jkl'))
    assert(list.includes('mno'))

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = await wordList(options)
    assert.strictEqual(list.length, 9)
    assert(list.includes('jkl'))
    assert(list.includes('mno'))
  })
})

describe('wordListSync', () => {
  it('works with no configuration', () => {
    const list = wordListSync()
    assert.strictEqual(list.length, 86748)
  })

  it('allows paths overrides', () => {
    const list = wordListSync({paths: ['$special-hacker.50']})
    assert.strictEqual(list.length, 1649)
  })

  it('falls back when path not found', () => {
    const list = wordListSync({paths: ['/no/file/here', '$special-hacker.50']})
    assert.strictEqual(list.length, 1649)
  })

  it('combines files', () => {
    const list = wordListSync({combine: ['$special-hacker.50', '$variant_1-words.95']})
    assert.strictEqual(list.length, 2014)
  })

  it(`works with 'to-lower' mutator option`, () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: 'to-lower', combine: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 8)

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 8)
  })

  it(`works with 'only-lower' mutator option`, () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: 'only-lower', combine: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 2)

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 2)
  })

  it('works with a custom mutator function (boolean)', () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: upperMutator, combine: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('ABC'))
    assert(list.includes('PQR'))
    assert(list.includes('YZ'))

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('ABC'))
    assert(list.includes('PQR'))
    assert(list.includes('YZ'))
  })

  it('works with a custom mutator function (string)', () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: possessiveMutator, combine: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 8)
    assert(list.includes(`ABC's`))
    assert(list.includes(`Def's`))

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 8)
    assert(list.includes(`ABC's`))
    assert(list.includes(`Def's`))
  })

  it('works with a custom mutator function (string[])', () => {
    let options: IListOptions
    let list: string[]

    options = { mutator: splitMutator, combine: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 9)
    assert(list.includes('jkl'))
    assert(list.includes('mno'))

    options = { ...options, combine: undefined, paths: [testWordsPath] }
    list = wordListSync(options)
    assert.strictEqual(list.length, 9)
    assert(list.includes('jkl'))
    assert(list.includes('mno'))
  })
})
