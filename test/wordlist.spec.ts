import assert from 'assert'
import { wordList, wordListSync } from '../src'

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
})
