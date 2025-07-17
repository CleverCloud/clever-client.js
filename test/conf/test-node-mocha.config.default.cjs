/**
 * @param {string} arg
 * @returns {boolean}
 */
function isTestFile(arg) {
  return arg.match(/\.js?$/) != null;
}

/**
 * @param {Array<string>} include
 */
function defaultConfig(include) {
  return {
    ignore: ['/test/**/*.browser.spec.js'],
    ui: 'bdd',
    'watch-files': ['esm/**/*.js', 'src/**/*.js', 'test/**/*.js'],
    ...(process.argv.some(isTestFile) ? {} : { spec: include }),
    asyncStackTrace: true,
  };
}

module.exports = { defaultConfig };
