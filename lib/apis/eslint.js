const LINTER_NAME = 'eslint'

function API (lint) {
  function translateOptions (cliOptions, cwd) {
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
      fix: cliOptions.fix || cliOptions.fixToStdout || cliOptions.fixDryRun,
      allowInlineConfig: cliOptions.inlineConfig,
      printConfig: cliOptions.printConfig,
      resolvePluginsRelativeTo: cwd,
      cwd
    }
  }

  return { translateOptions, CLIEngine: lint.CLIEngine, _xdLinter: LINTER_NAME }
}

API.binPath = LINTER_NAME

module.exports = API
