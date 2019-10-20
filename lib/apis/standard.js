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
    const options = {
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

    return options
  }

  class CLIEngine extends lint.CLIEngine {
    constructor (options) {
      const withPrettier = options.prettier || !!prettierx.resolveConfigFile.sync(options.cwd || process.cwd())

      let eslintOptions = Object.assign({}, standard.parseOpts().eslintConfig, options)

      // Add prettier config.
      if (withPrettier) {
        eslintOptions = assignPrettierxConfig(eslintOptions)
      }

      super(eslintOptions)

      // Add prettier plugin.
      if (withPrettier) {
        this.addPlugin('eslint-plugin-prettierx', require('eslint-plugin-prettierx'))
      }
    }
  }

  return { translateOptions, CLIEngine, _xdLinter: LINTER_NAME }
}

API.binPath = LINTER_NAME

module.exports = API
