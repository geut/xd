const path = require('path')
const fs = require('fs').promises

const { generateEnvironment, run } = require('./helpers')

module.exports = function runCommonTests (environment = 'eslint') {
  beforeAll(async () => {
    const fixture = path.resolve(`./tests/fixtures/${environment}`)
    this.cwd = await generateEnvironment(fixture, `xd-${environment}-test`)
    this.filename = `${this.cwd}/index.js`
    this.content = await fs.readFile(this.filename, 'utf8')
    console.log('beforeAll filename', this.filename)
    await run(this.cwd, 'stop')
  })

  describe(`${environment}: lint file`, () => {
    test('default lint', async () => {
      console.log('default lint filename', this.filename)
      const { stdout } = await run(this.cwd, this.filename)
      expect(stdout).toMatchSnapshot()
    })

    test('lint -f json', async () => {
      const { stdout } = await run(this.cwd, `${this.filename} -f json`)
      expect(stdout).toMatchSnapshot()
    })
  })

  describe(`${environment}: fix file`, () => {
    test('fix --fix-dry-run', async () => {
      const { stdout } = await run(this.cwd, `${this.filename} --fix-dry-run -f json`)
      expect(stdout).toMatchSnapshot()
    })

    test('fix --stdin --fix-dry-run -f json', async () => {
      const { stdout } = await run(this.cwd, `${this.filename} --stdin --fix-dry-run -f json`, this.content)
      expect(stdout).toMatchSnapshot()
    })

    test('fix --stdin --stdin-filename "filename" --fix-dry-run -f json', async () => {
      const { stdout } = await run(this.cwd, `--stdin --stdin-filename ${this.filename} --fix-dry-run -f json`, this.content)
      expect(stdout).toMatchSnapshot()
    })

    test('fix --fix -f json', async () => {
      const { stdout } = await run(this.cwd, `${this.filename} --fix -f json`)
      expect(stdout).toMatchSnapshot()
      expect(fs.readFile(this.filename, 'utf8')).resolves.toBe(JSON.parse(stdout)[0].output)
    })
  })
}
