const chalk = require('chalk');
const { getVersions } = require('../api/modules/versions');
const { log, commandPromptTextLog } = require('../utils/index');
const { version } = require('../../package.json');

module.exports = async (e) => {
    const { tagName } = await getVersions();
    let updateMsg = () => log(' ');
    // if (typeof e === 'undefined') return updateMsg;
    const currentVer = version.replace(/\D/g, '');
    const proVer = tagName.replace(/\D/g, '');

    if (currentVer < proVer) {
        updateMsg = () => {
            log(' ');
            commandPromptTextLog([
                `发现的版本啦 -> ${chalk.yellow(tagName)} , 请及时更新哦！`,
                `更新日志说明：https://github.com/zhaoxm469/fast-template-cli/releases/tag/${tagName}`,
                '输入命令更新 -> npm install fast-template-cli -g',
            ], '**');

            log(' ');
        };
        if (typeof e === 'object') updateMsg();
    } else {
        log('当前暂无最新版本');
    }
    return updateMsg;
};
