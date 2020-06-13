#!/usr/bin/env node
const { program } = require('commander');
const prompts = require('prompts')
const chalk = require('chalk');
const packageJson = require('./package.json')

const createApp = require('./create-app')
const { getQuestions } = require('./helpers/config')

let projectPath = ''

program.name(packageJson.name)
    .version(packageJson.version)
    .arguments('[project-name]')
    .usage(`${chalk.green('[project-name]')}`)
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

    const res = await prompts(getQuestions(projectPath))

    const { name, framework } = res
    if (name === 'string') {
        projectPath = name.trim()
    }

    await createApp(projectPath, { framework })
}

run()