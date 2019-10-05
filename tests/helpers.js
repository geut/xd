const { spawn } = require('child_process')
const crypto = require('crypto')
const path = require('path')
const cpy = require('cpy')
const tempDir = require('temp-dir')

function npmInstall (cwd) {
  return new Promise((resolve, reject) => {
    const ps = spawn('npm', ['ci'], {
      stdio: [0, 'pipe', 'pipe'],
      cwd,
      env: {
        FORCE_COLOR: true,
        npm_config_color: 'always',
        npm_config_progress: true
      }
    })

    ps.on('close', code => {
      resolve({ code })
    })

    ps.on('error', reject)
  })
}

exports.generateEnvironment = async function generateEnvironment (fixture, tmp = crypto.randomBytes(32).toString('hex')) {
  const cwd = path.join(tempDir, tmp)
  await cpy([`${fixture}/*`, `${fixture}/.eslintrc.js`], cwd)
  await npmInstall(cwd)
  return cwd
}
