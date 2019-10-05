const path = require('path')

const { generateEnvironment } = require('./helpers')
const { invoke } = require('..')

beforeAll(async () => {
  const fixture = path.resolve('./tests/fixtures/eslint')
  this.cwd = await generateEnvironment(fixture, 'xd-eslint-test')
})

test('lint file', () => {
  const args = [`${this.cwd}/index.js`]
  let result = invoke(this.cwd, args, null, 0)
  expect(result).toMatchSnapshot()
  args.push('-f')
  args.push('json')
  result = invoke(this.cwd, args, null, 0)
  expect(result).toMatchSnapshot()
})
