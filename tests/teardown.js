const { run } = require('./helpers')

module.exports = async () => {
  console.log('\n\n*** Closing xd ***\n')
  await run(process.cwd(), 'stop')
}
