const { run } = require('./helpers')

module.exports = async () => {
  console.log('\n\n*** Starting xd ***\n')
  await run(process.cwd(), 'start')
}
