const LRU = require('nanolru')
const path = require('path')

const options = require('./lib/options')
const { findLint } = require('./lib/apis')

const lintCache = new LRU(10)

function fail (message) {
  return `${message}\n# exit 1`
}

function clearRequireCache (cwd) {
  Object.keys(require.cache)
    .filter(key => key.startsWith(cwd))
    .forEach((key) => {
      delete require.cache[key]
    })
}

exports.invoke = function (cwd, args, text, mtime) {
  process.chdir(cwd)

  let lint = lintCache.get(cwd)
  if (!lint) {
    lint = findLint(cwd)
  } else if (mtime > lint.lastRun) {
    clearRequireCache(cwd)
    lint = findLint(cwd)
  }
  lint.lastRun = Date.now()
  lintCache.set(cwd, lint)

  const currentOptions = options.parse([0, 0].concat(args))
  const files = currentOptions._
  const stdin = currentOptions.stdin
  if (!files.length && (!stdin || typeof text !== 'string')) {
    return `${options.generateHelp()}\n`
  }

  const engineOptions = lint.translateOptions(currentOptions, path.resolve(cwd))

  let engine
  try {
    engine = new lint.CLIEngine(engineOptions)
  } catch (err) {
    return fail(err.message)
  }

  if (currentOptions.printConfig) {
    if (files.length !== 1) {
      return fail('The --print-config option requires a single file as positional argument.')
    }
    if (text) {
      return fail('The --print-config option is not available for piped-in code.')
    }

    const fileConfig = engine.getConfigForFile(files[0])
    return JSON.stringify(fileConfig, null, '  ')
  }

  if (currentOptions.fixToStdout && !stdin) {
    return fail('The --fix-to-stdout option must be used with --stdin.')
  }

  let report
  if (stdin) {
    report = engine.executeOnText(text, currentOptions.stdinFilename)
  } else {
    report = engine.executeOnFiles(files)
  }

  if (currentOptions.fixToStdout) {
    return (report.results[0] && report.results[0].output) || text
  }

  if (currentOptions.fix && !currentOptions.fixDryRun) {
    lint.CLIEngine.outputFixes(report)
  }

  if (currentOptions.quiet) {
    report.results = lint.CLIEngine.getErrorResults(report.results)
  }

  const format = currentOptions.format
  const formatter = engine.getFormatter(format)
  const output = formatter(report.results)

  const maxWarnings = currentOptions.maxWarnings
  if (report.errorCount || (maxWarnings >= 0 && report.warningCount > maxWarnings)) {
    return fail(output)
  }

  return output
}

exports.cache = lintCache

/*
 * The core_d status hook.
 */
exports.getStatus = function () {
  const { keys } = lintCache

  if (keys.length === 0) {
    return 'No instances cached.'
  }

  if (keys.length === 1) {
    return 'One instance cached.'
  }

  return `${keys.length} instances cached.`
}
