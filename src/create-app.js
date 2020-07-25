const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir')
const inquirer = require('inquirer')
const download = require('./helpers/download')
const generator = require('./helpers/generator')
const { formatPrompt } = require('./helpers/utils')
const getPrompts = require('./config/getPrompts')

module.exports = async function createApp(projectName, opt) {
    const { git, select } = opt
    const root = path.resolve(projectName)

    await makeDir(root)

    let tplPath = await download(root, git)

    const promptConfig = getPrompts(projectName, select)

    const type = select.replace(/template-/, '')
    const answer = await inquirer.prompt(promptConfig)

    let genParam = {
        metadata: { ...formatPrompt(answer) },
        src: tplPath,
        dest: root
    }

    await generator(genParam)
}