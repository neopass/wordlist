import assert from 'assert'
import path from 'path'
import { wordList, wordListSync, IListOptions } from '../src'

const testWordsPath = path.resolve(__dirname, '../test/data/words.txt')

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

  it('works with toLowerCase option', async () => {
    let options: IListOptions = {
      toLowerCase: true,
      combine: [testWordsPath],
    }

    let list = await wordList(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('abc'))
    assert(list.includes('def'))
    assert(list.includes('ghi'))

    options = {...options, ...{ combine: undefined, paths: [testWordsPath]}}

    list = await wordList(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('abc'))
    assert(list.includes('def'))
    assert(list.includes('ghi'))
  })

  it('works with lowerCaseOnly option', async () => {
    let options: IListOptions = {
      lowerCaseOnly: true,
      combine: [testWordsPath],
    }

    let list = await wordList(options)
    assert.strictEqual(list.length, 1)
    assert(list.includes('ghi'))

    options = {...options, ...{ combine: undefined, paths: [testWordsPath]}}

    list = await wordList(options)
    assert.strictEqual(list.length, 1)
    assert(list.includes('ghi'))
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

  it('works with toLowerCase option', () => {
    let options: IListOptions = {
      toLowerCase: true,
      combine: [testWordsPath],
    }

    let list = wordListSync(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('abc'))
    assert(list.includes('def'))
    assert(list.includes('ghi'))

    options = {...options, ...{ combine: undefined, paths: [testWordsPath]}}

    list = wordListSync(options)
    assert.strictEqual(list.length, 3)
    assert(list.includes('abc'))
    assert(list.includes('def'))
    assert(list.includes('ghi'))
  })

  it('works with lowerCaseOnly option', () => {
    let options: IListOptions = {
      lowerCaseOnly: true,
      combine: [testWordsPath],
    }

    let list = wordListSync(options)
    assert.strictEqual(list.length, 1)
    assert(list.includes('ghi'))

    options = {...options, ...{ combine: undefined, paths: [testWordsPath]}}

    list = wordListSync(options)
    assert.strictEqual(list.length, 1)
    assert(list.includes('ghi'))
  })
})
