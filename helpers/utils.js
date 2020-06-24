const { execSync } = require('child_process')

module.exports = {
    shouldUseYarn: () => {
        try {
            execSync('yarnpkg --version', { stdio: 'ignore' })
            return true
        } catch (err) {
            return false
        }
    }
}