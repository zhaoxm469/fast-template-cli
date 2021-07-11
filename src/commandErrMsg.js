const chalk = require('chalk');
const { log } = require('./utils/index');

module.exports = (program) => {
    if (!process.argv.slice(2).length) return;

    function errFn(cmd, type = 'option') {
        this.outputHelp();
        log('\n');
        log(chalk.red(`  Unknown ${type} : ${chalk.yellow(cmd)}`));
        log('\n');
        process.exit();
    }

    // eslint-disable-next-line no-param-reassign
    program.Command.prototype.unknownOption = (...arg) => {
        errFn.call(program, arg);
    };

    program
        .arguments('<command>')
        .action((cmd) => errFn.call(program, cmd, 'command'));
};
