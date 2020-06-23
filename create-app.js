const path = require('path')
const makeDir = require('make-dir')
const download = require('./helpers/download')

module.exports = async function createApp(appPath, opt) {
    const { git } = opt
    const root = path.resolve(appPath)
    const appName = path.basename(root)

    await makeDir(root)

    await download(root,git)
}