const LRU = require('nanolru')
const resolve = require('resolve')
const options = require('./options')
const path = require('path')

const engines = require('./lib/engines')

const lintCache = new LRU(10)

function fail (message) {
  return `${message}\n# exit 1`
}

function lookup (lint, cwd) {
  try {
    return resolve.sync(lint, { basedir: cwd })
  } catch (e) {
    // module not found
    return null
  }
}

function createCache (cwd) {
  let engine
  let lintPath
  for (engine of engines) {
    lintPath = lookup(engine.name, cwd)
    if (lintPath) {
      break
    }
  }

  if (!lintPath) {
    engine = engines.find(l => l.name === 'eslint')
    lintPath = resolve.sync(engine.name)
  }

  return lintCache.set(cwd, {
    lint: require(lintPath),
    engine,
    // use chalk from eslint
    chalk: require(resolve.sync('chalk', {
      basedir: path.dirname(lintPath)
    }))
  })
}

function clearRequireCache (cwd) {
  Object.keys(require.cache)
    .filter(key => key.startsWith(cwd))
    .forEach((key) => {
      delete require.cache[key]
    })
}

/*
 * The core_d service entry point.
 */
exports.invoke = function (cwd, args, text, mtime) {
  return 'hola'

  process.chdir(cwd)

  let cache = lintCache.get(cwd)
  if (!cache) {
    cache = createCache(cwd)
  } else if (mtime > cache.last_run) {
    clearRequireCache(cwd)
    cache = createCache(cwd)
  }
  cache.last_run = Date.now()

  const currentOptions = options.parse([0, 0].concat(args))
  cache.chalk.enabled = currentOptions.color
  const files = currentOptions._
  const stdin = currentOptions.stdin
  if (!files.length && (!stdin || typeof text !== 'string')) {
    return `${options.generateHelp()}\n`
  }

  const engineOptions = cache.engine.translateOptions(currentOptions, cwd)
  engineOptions.cwd = path.resolve(cwd)

  // eslint-disable-next-line
  const engine = new cache.engine(cache.lint, engineOptions)

  if (currentOptions.printConfig) {
    if (files.length !== 1) {
      return fail('The --print-config option requires a ' +
        'single file as positional argument.')
    }
    if (text) {
      return fail('The --print-config option is not available for piped-in ' +
        'code.')
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
    // No results will be returned if the file is ignored
    // No output will be returned if there are no fixes
    return (report.results[0] && report.results[0].output) || text
  }

  if (currentOptions.fix) {
    engine.outputFixes(report)
  }

  if (currentOptions.quiet) {
    report.results = engine.getErrorResults(report.results)
  }

  const format = currentOptions.format
  const formatter = engine.getFormatter(format)
  const output = formatter(report.results)
  const maxWarnings = currentOptions.maxWarnings
  if (report.errorCount ||
      (maxWarnings >= 0 && report.warningCount > maxWarnings)) {
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
