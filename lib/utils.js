const resolve = require('resolve')

exports.lookup = function lookup (module, basedir) {
  try {
    return resolve.sync(module, { basedir })
  } catch (e) {
    // module not found
    return null
  }
}
