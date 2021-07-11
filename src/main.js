/* eslint-disable global-require */
const { program } = require('commander');
const commandList = require('./commandList');
const { version } = require('../package.json');

// 判断是否输出 更新提示
const isUpdateMs = require('./utils/update');

require('./commandErrMsg')(program);

commandList.forEach((item) => {
    const actionfn = require(`./commandMethods/${item.commandFileName}`);
    program
        .command(item.command)
        .description(item.description)
        .action(actionfn);
});

(async () => {
    const isUpdate = await isUpdateMs();

    program
        // 在commder 选项里， 不显示help 帮助信息
        .addHelpCommand(false)
        .on('--help', isUpdate);

    program
        .version(version)
        .parse(process.argv);
})();
