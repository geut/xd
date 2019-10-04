const path = require('path')
const resolve = require('resolve')
const Eslint = require('./eslint')

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

  constructor (lint, options) {
    const eslintOptions = Object.assign({}, lint.parseOpts().eslintConfig, options)

    // Add prettier config.
    if (options.prettierPath) {
      const config = require(eslintOptions.configFile)
      eslintOptions.configFile = null
      config.extends.push(resolve.sync('eslint-config-prettier'))
      config.extends.push(resolve.sync('eslint-config-prettier/babel'))
      config.extends.push(resolve.sync('eslint-config-prettier/react'))
      config.extends.push(resolve.sync('eslint-config-prettier/standard'))
      config.plugins = ['prettier']
      config.rules = {
        'prettier/prettier': ['error', require('prettier-config-standard')]
      }
      eslintOptions.baseConfig = config
    }

    super(lint.eslint, eslintOptions)

    // Add prettier plugin.
    if (options.prettierPath) {
      this._engine.addPlugin('eslint-plugin-prettier', require('eslint-plugin-prettier'))
    }

    this._options = eslintOptions
  }
}

Standard.binPath = 'standard'

module.exports = Standard
