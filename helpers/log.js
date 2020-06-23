const logSymbols = require("log-symbols");
const chalk = require("chalk");
const log = console.log

module.exports = {
    success: (...str) => {
        log(logSymbols.success, chalk.green(...str))
    },
    info: (...str) => {
        log(logSymbols.info, chalk.blue(...str))
    },
    warn: (...str) => {
        log(logSymbols.warning, chalk.yellow(...str))
    },
    error: (...str) => {
        log(logSymbols.error, chalk.red(...str))
    }
}