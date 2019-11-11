const { lookup } = require('../utils')

// Order is important.
const APIs = [
  require('./semistandard'),
  require('./standard'),
  require('./eslint')
]

function findLint (cwd = process.cwd()) {
  let api
  let lintPath
  for (api of APIs) {
    lintPath = lookup(api.binPath, cwd)
    if (lintPath) {
      break
    }
  }

  if (!lintPath) {
    api = APIs.find(l => l.binPath === 'eslint')
    lintPath = lookup(api.binPath)
  }

  return api(require(lintPath))
}

module.exports = { APIs, findLint }
