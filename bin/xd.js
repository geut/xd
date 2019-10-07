#!/usr/bin/env node

execute()

function execute () {
  const cmd = process.argv[2]

  if (cmd === '-v' || cmd === '--version') {
    console.log('v%s', require('eslint/package.json').version)
    return
  }

  if (cmd === '-h' || cmd === '--help') {
    const options = require('../lib/options')
    console.log(options.generateHelp())
    return
  }

  process.env.CORE_D_TITLE = 'xd'
  process.env.CORE_D_DOTFILE = '.xd'
  process.env.CORE_D_SERVICE = require.resolve('..')

  const coreD = require('core_d')

  if (cmd === 'start' ||
  cmd === 'stop' ||
  cmd === 'restart' ||
  cmd === 'status') {
    coreD[cmd]()
    return
  }

  const args = process.argv.slice(2)

  if (process.env.PRETTIER) {
    args.push('--prettier')
  }

  if (args.indexOf('--stdin') > -1) {
    let text = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => {
      text += chunk
    })
    process.stdin.on('end', () => {
      coreD.invoke(args, text)
    })
    return
  }

  coreD.invoke(args)
}
