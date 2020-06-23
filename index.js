#!/usr/bin/env node
const path = require('path');
const glob = require('glob');
const fs = require('fs')
const commander = require('commander');
const inquirer = require("inquirer");
const chalk = require('chalk');
const packageJson = require('./package.json')

const createApp = require('./create-app')
const log = require('./helpers/log')
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

    let git = await selectTemplate()
    await createApp(projectPath, { git })
}

/**
 * 选择模版
 */
async function selectTemplate() {
    let choices = Object.values(templateConfig).map(item => ({
        value: item.value,
        name: item.name
    }))

    let config = {
        type: "list",
        message: "选择模版类型",
        name: "select",
        choices: [new inquirer.Separator("模板类型"), ...choices]
    }

    let { select } = await inquirer.prompt(config)
    let { git } = templateConfig[select]
    return git
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
  // todo
}


run().then(notifyUpdate)