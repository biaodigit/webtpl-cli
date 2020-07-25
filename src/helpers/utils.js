const { execSync } = require('child_process')

const cssSuffixMap = new Map([
    ['sass', 'scss'],
    ['less', 'less'],
    ['stylus', 'styl']
])

module.exports = {
    formatPrompt: {
        react: (answer) => {
            const { css_pre, use_csspre, typescript } = answer
            const react_suffix = typescript ? 'tsx' : 'js'
            const js_suffix = typescript ? 'ts' : 'js'
            return {
                ...answer,
                react_suffix,
                js_suffix,
                css_suffix: use_csspre ? cssSuffixMap.get(css_pre) : 'css',
                [css_pre || 'css']: true
            }
        },
        rollup: (answer) => {
            const { typescript } = answer
            const js_suffix = typescript ? 'ts' : 'js'
            return {
                ...answer,
                js_suffix
            }
        }
    },
    shouldUseYarn: () => {
        try {
            execSync('yarnpkg --version', { stdio: 'ignore' })
            return true
        } catch (err) {
            return false
        }
    }
}