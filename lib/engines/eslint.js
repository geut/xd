class Eslint {
  static translateOptions (cliOptions, cwd) {
    return {
      envs: cliOptions.env,
      extensions: cliOptions.ext,
      rules: cliOptions.rule,
      plugins: cliOptions.plugin,
      globals: cliOptions.global,
      ignore: cliOptions.ignore || true,
      ignorePath: cliOptions.ignorePath,
      ignorePattern: cliOptions.ignorePattern,
      configFile: cliOptions.config,
      rulePaths: cliOptions.rulesdir,
      useEslintrc: cliOptions.eslintrc || true,
      parser: cliOptions.parser,
      cache: cliOptions.cache || false,
      cacheFile: cliOptions.cacheFile,
      cacheLocation: cliOptions.cacheLocation,
      fix: cliOptions.fix || cliOptions.fixToStdout,
      allowInlineConfig: cliOptions.inlineConfig,
      printConfig: cliOptions.printConfig,
      cwd
    }
  }

  constructor (lint, options) {
    this._lint = lint
    this._options = options
    this._engine = new lint.CLIEngine(options)
  }

  getConfigForFile (file) {
    return this._engine.getConfigForFile(file)
  }

  executeOnText (text, filename) {
    return this._engine.executeOnText(text, filename)
  }

  executeOnFiles (files) {
    return this._engine.executeOnFiles(files)
  }

  getFormatter (format) {
    return this._engine.getFormatter(format)
  }

  outputFixes (report) {
    return this._lint.CLIEngine.outputFixes(report)
  }

  getErrorResults (results) {
    return this._lint.CLIEngine.getErrorResults(results)
  }
}

Eslint.binPath = 'eslint'

module.exports = Eslint
