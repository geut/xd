const waitFor = require('p-wait-for')
const { run } = require('./helpers')

module.exports = async () => {
  console.log('\n\n>Closing xd.')
  await run(process.cwd(), 'stop')
  await waitFor(async () => {
    const { stdout } = await run(process.cwd(), 'status')
    console.log(stdout)
    return stdout.includes('Not running')
  }, { interval: 1500, timeout: 5000 })
  console.log('>Closed xd.\n')
}
