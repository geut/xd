const path = require('path')
const fs = require('fs').promises

const { generateEnvironment } = require('./helpers')
const { invoke } = require('..')

module.exports = function runCommonTests (environment = 'eslint') {
  beforeAll(async () => {
    const fixture = path.resolve(`./tests/fixtures/${environment}`)
    this.cwd = await generateEnvironment(fixture, `xd-${environment}-test`)
  })

  test(`${environment}: lint file`, () => {
    const args = [`${this.cwd}/index.js`]

    let result = invoke(this.cwd, args, null, 0)
    expect(result).toMatchSnapshot()

    args.push('-f')
    args.push('json')
    result = invoke(this.cwd, args, null, 0)
    expect(result).toMatchSnapshot()
  })

  test(`${environment}: fix file`, async () => {
    const filename = `${this.cwd}/index.js`
    const content = await fs.readFile(filename, 'utf8')

    let result = invoke(this.cwd, `${filename} --fix-dry-run -f json`.split(' '), null, 0)
    expect(result).toMatchSnapshot()

    result = invoke(this.cwd, '--stdin --fix-dry-run -f json'.split(' '), content, 0)
    expect(result).toMatchSnapshot()

    result = invoke(this.cwd, `--stdin --stdin-filename ${filename} --fix-dry-run -f json`.split(' '), content, 0)
    expect(result).toMatchSnapshot()

    result = invoke(this.cwd, `${filename} --fix -f json`.split(' '), null, 0)
    expect(result).toMatchSnapshot()
    console.log(result)
    expect(fs.readFile(filename, 'utf8')).resolves.toBe(JSON.parse(result)[0].output)
  })
}
