const standard = require('./standard')

const LINTER_NAME = 'semistandard'

function API (semistandard) {
  const api = standard(semistandard)

  class Semistandard extends api.CLIEngine {
    constructor (options = {}) {
      if (options.withPrettier) {
        options.baseConfig.rules['prettierx/options'] = ['error', { semi: true }]
      }

      super(options)
    }
  }

  api.CLIEngine = Semistandard

  return api
}

API.binPath = LINTER_NAME

module.exports = API
