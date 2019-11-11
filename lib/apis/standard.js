const prettierx = require('prettierx')

const { lookup } = require('../utils')

const LINTER_NAME = 'standard'

const assignPrettierxConfig = (options) => {
  const { configFile } = options
  const { configs: { default: _default, standardx, babel, react, vue, standard } } = require('eslint-plugin-prettierx')

  return Object.assign({}, options, {
    parser: lookup('babel-eslint'),
    configFile: null,
    baseConfig: {
      extends: [
        lookup('eslint-config-standard', configFile),
        lookup('eslint-config-standard-jsx', configFile)
      ],
      parserOptions: standardx.parserOptions,
      settings: {
        prettierx: {
          preset: 'standardx',
          usePrettierrc: true
        }
      },
      plugins: ['prettierx'],
      rules: Object.assign({},
        _default.rules,
        babel.rules,
        react.rules,
        vue.rules,
        standard.rules
      )
    }
  })
}

function API (standard) {
  const lint = standard.eslint

  function translateOptions (cliOptions, cwd) {
    let options = {
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
      prettier: cliOptions.prettier,
      cwd
    }

    // Clean options.
    Object.keys(options).forEach(key => options[key] === undefined && delete options[key])

    options = Object.assign({}, standard.parseOpts().eslintConfig, options)

    options.withPrettier = options.prettier || !!prettierx.resolveConfigFile.sync(options.cwd || process.cwd())

    if (options.withPrettier) {
      options = assignPrettierxConfig(options)
    }

    return options
  }

  class Standard extends lint.CLIEngine {
    static withPrettier (options = {}) {
      return options.prettier || !!prettierx.resolveConfigFile.sync(options.cwd || process.cwd())
    }

    constructor (options) {
      super(options)

      // Add prettier plugin.
      if (options.withPrettier) {
        this.addPlugin('eslint-plugin-prettierx', require('eslint-plugin-prettierx'))
      }
    }
  }

  return { translateOptions, CLIEngine: Standard, _xdLinter: LINTER_NAME }
}

API.binPath = LINTER_NAME

module.exports = API
