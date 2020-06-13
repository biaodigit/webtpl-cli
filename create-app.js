const path = require('path')
const makeDir = require('make-dir')
const cpy = require('cpy')

module.exports = async function createApp(appPath, opt) {
    const { framework } = opt
    const root = path.resolve(appPath)
    const appName = path.basename(root)

    await makeDir(root)

    await cpy('**', root, {
        parents: true,
        cwd: path.join(__dirname, 'templates', framework),
        rename: name => {
            switch (name) {
                case 'gitignore': {
                    return '.'.concat(name)
                }
                default: {
                    return name
                }
            }
        }
    })
}