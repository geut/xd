const { execFile } = require('child_process')
const { promisify } = require('util')
const crypto = require('crypto')
const path = require('path')
const cpy = require('cpy')
const tempDir = require('temp-dir')

function npmInstall (cwd) {
  return promisify(execFile)('npm', ['install'], { cwd })
}

exports.generateEnvironment = async function generateEnvironment (fixture, tmp = crypto.randomBytes(32).toString('hex')) {
  const cwd = path.join(tempDir, tmp)
  await cpy([`${fixture}/*`, `${fixture}/.eslintrc.js`], cwd)
  await npmInstall(cwd)
  return cwd
}

exports.run = async function run (cwd, args, text) {
  const bin = path.join(process.cwd(), 'bin/xd.js')

  let _resolve
  let _reject
  const p = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  const child = execFile(bin, args.split(' '), { cwd }, (err, stdout = '', stderr) => {
    if (err) {
      err.stdout = stdout
      err.stderr = stderr
      return _reject(err)
    }

    _resolve({ stdout, stderr })
  })

  try {
    if (text) {
      child.stdin.write(text)
      child.stdin.end()
    }

    const result = await p
    return { stdout: result.stdout.trim(), stderr: result.stderr }
  } catch (err) {
    return { stdout: err.stdout.trim(), stderr: err.stderr }
  }
}
