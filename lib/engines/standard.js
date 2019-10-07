const Eslint = require('./eslint')

const { lookup } = require('../utils')

class Standard extends Eslint {
  static translateOptions (cliOptions, cwd) {
    return {
      envs: cliOptions.env,
      plugins: cliOptions.plugin,
      globals: cliOptions.global,
      fix: cliOptions.fix || cliOptions.fixToStdout || cliOptions.fixDryRun,
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

  static extends (standardDir) {
    return [
      lookup('eslint-config-standard', standardDir),
      lookup('eslint-config-standard-jsx', standardDir)
    ]
  }

  static assignPrettierxConfig (options) {
    const { configFile } = options
    const { configs: { standardx, babel, react, vue, standard } } = require('eslint-plugin-prettierx')

    return Object.assign({}, options, {
      parser: lookup('babel-eslint'),
      configFile: null,
      baseConfig: {
        extends: Standard.extends(configFile),
        parserOptions: standardx.parserOptions,
        settings: standardx.settings,
        plugins: ['prettierx'],
        rules: Object.assign({}, standardx.rules,
          babel.rules,
          react.rules,
          vue.rules,
          standard.rules
        )
      }
    })
  }

  constructor (lint, options) {
    let eslintOptions = Object.assign({}, lint.parseOpts().eslintConfig, options)

    // Add prettier config.
    if (eslintOptions.prettier) {
      eslintOptions = Standard.assignPrettierxConfig(eslintOptions)
    }

    super(lint.eslint, eslintOptions)

    // Add prettier plugin.
    if (eslintOptions.prettier) {
      this._engine.addPlugin('eslint-plugin-prettierx', require('eslint-plugin-prettierx'))
    }

    this._options = eslintOptions
  }
}

Standard.binPath = 'standard'

module.exports = Standard
