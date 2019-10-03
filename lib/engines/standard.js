const path = require('path')
const Eslint = require('./eslint')

class Standard extends Eslint {
  static translateOptions (cliOptions, cwd) {
    return {
      envs: cliOptions.env,
      plugins: cliOptions.plugin,
      globals: cliOptions.global,
      fix: cliOptions.fix || cliOptions.fixToStdout,
      ignore: cliOptions.ignore || false,
      ignorePath: cliOptions.ignorePath,
      ignorePattern: cliOptions.ignorePattern,
      parser: cliOptions.parser,
      cache: cliOptions.cache || true,
      cacheFile: cliOptions.cacheFile,
      cacheLocation: cliOptions.cacheLocation,
      printConfig: cliOptions.printConfig,
      prettier: cliOptions.prettier || false,
      cwd
    }
  }

  constructor (lint, options) {
    const eslintOptions = Object.assign({}, lint.parseOpts().eslintConfig, options)

    if (options.prettier) {
      eslintOptions.configFile = null
      eslintOptions.baseConfig = {
        extends: [require.resolve('eslint-config-prettier-standard/eslint-file')]
      }
      eslintOptions.resolvePluginsRelativeTo = path.resolve(path.join(__dirname, '../..'))
    }

    super(lint.eslint, eslintOptions)

    this._options = eslintOptions
  }
}

Standard.binPath = 'standard'

module.exports = Standard
