#!/usr/bin/env node
const path = require('path');
const glob = require('glob');
const fs = require('fs')
const commander = require('commander');
const inquirer = require("inquirer");
const chalk = require('chalk');
const checkForUpdate = require('update-check')
const packageJson = require('./package.json')

const createApp = require('./create-app')
const log = require('./helpers/log')
const { shouldUseYarn } = require('./helpers/utils')
const templateConfig = require('./config/template.json')

let projectPath = ''

const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-name>')
    .usage(`${chalk.green('<project-name>')}`)
    .action(name => {
        projectPath = name
    })
    .allowUnknownOption()
    .parse(process.argv)


program.on('--help', () => {
    console.log(' Examples:')
    console.log()
    console.log(' $ webtpl-cli my-app')
    console.log()
})

if (!projectPath) return program.help()

async function run() {
    if (typeof projectPath === 'string') {
        projectPath = projectPath.trim()
    }

    if (checkDir(projectPath)) {
        log.error(`项目${projectPath}已存在`)
        process.exit(1)
    }

    let opt = await selectTemplate()
    await createApp(projectPath, { ...opt})
}

/**
 * 选择模版
 */
async function selectTemplate() {
    let choices = Object.values(templateConfig).map(item => ({
        value: item.value,
        name: item.name
    }))

    let promptConfig = {
        type: "list",
        message: "选择模版类型",
        name: "select",
        choices: [new inquirer.Separator("模板类型"), ...choices]
    }

    let { select } = await inquirer.prompt(promptConfig)
    let { git } = templateConfig[select]
    return { git, select }
}

/**
 * 检测路径是否合法
 * @param {*} projectPath 
 */
function checkDir(projectPath) {
    const list = glob.sync('*')
    if (list.length) {
        return list.filter(name => {
            const fileName = path.resolve(process.cwd(), name);
            const isDir = fs.statSync(fileName).isDirectory()
            return name.indexOf(projectPath) !== -1 && isDir
        }).length !== 0
    }
    return true
}

/**
 * 检测脚手架最新版本
 */
async function notifyUpdate() {
    try {
        const res = await checkForUpdate(packageJson).catch(() => null)
        if (res && res.latest) {
            const isYarn = shouldUseYarn()
            console.log()
            console.log(
                chalk.yellow.bold('A new version of `webtpl-cli` is available!')
            )
            console.log(
                'You can update by running: ' +
                chalk.cyan(
                    isYarn
                        ? 'yarn global add webtpl-cli'
                        : 'npm i -g webtpl-cli'
                )
            )
            console.log()
        }
    } catch {
        // ignore error
    }
}


run().then(notifyUpdate)
    .catch(async reason => {

    })