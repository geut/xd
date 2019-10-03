module.exports = {
  name: 'prettier-standard',
  translateOptions (cliOptions, cwd) {
    return {
      envs: cliOptions.env,
      extensions: cliOptions.ext,
      rules: cliOptions.rule,
      plugins: cliOptions.plugin,
      globals: cliOptions.global,
      ignore: cliOptions.ignore,
      ignorePath: cliOptions.ignorePath,
      ignorePattern: cliOptions.ignorePattern,
      configFile: cliOptions.config,
      rulePaths: cliOptions.rulesdir,
      useEslintrc: cliOptions.eslintrc,
      parser: cliOptions.parser,
      cache: cliOptions.cache,
      cacheFile: cliOptions.cacheFile,
      cacheLocation: cliOptions.cacheLocation,
      fix: cliOptions.fix || cliOptions.fixToStdout,
      allowInlineConfig: cliOptions.inlineConfig,
      printConfig: cliOptions.printConfig,
      cwd
    }
  }
}
