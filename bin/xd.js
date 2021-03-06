#!/usr/bin/env node

execute()

function execute () {
  const cmd = process.argv[2]

  if (cmd === '-v' || cmd === '--version') {
    console.log('v%s', require('eslint/package.json').version)
    return
  }

  if (cmd === 'version') {
    console.log('v%s', require('../package.json').version)
    return
  }

  if (cmd === '-h' || cmd === '--help') {
    const options = require('../lib/options')
    console.log(options.generateHelp())
    return
  }

  const args = process.argv.slice(2)

  process.env.CORE_D_TITLE = 'xd'
  process.env.CORE_D_DOTFILE = '.xd'
  process.env.CORE_D_SERVICE = require.resolve('../cli')

  if (process.env.NO_SERVER || args.includes('--no-server')) {
    prepareXD(args, (args, text) => {
      let result = require(process.env.CORE_D_SERVICE).invoke(process.cwd(), args, text, 0)
      let fail = false
      if (result.includes('# exit 1')) {
        fail = true
        result = result.replace('\n# exit 1', '')
      }
      process.stdout.write(result)
      process.exit(fail ? 1 : 0)
    })
    return
  }

  const coreD = require('core_d')

  if (cmd === 'start' ||
  cmd === 'stop' ||
  cmd === 'restart' ||
  cmd === 'status') {
    coreD[cmd]()
    return
  }

  prepareXD(args, (args, text) => {
    coreD.invoke(args, text)
  })
}

function prepareXD (args, cb) {
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
      cb(args, text)
    })
    return
  }

  cb(args)
}
