const waitFor = require('p-wait-for')
const { run } = require('./helpers')

module.exports = async () => {
  console.log('\n\n> Starting xd.')
  await run(process.cwd(), 'start')
  await waitFor(async () => {
    const { stdout } = await run(process.cwd(), 'status')
    console.log(stdout)
    return stdout.includes('Running.')
  }, { interval: 1500, timeout: 5000 })
  console.log('> Started xd.\n')
}
