const { version } = require('../../package.json');
const { log, commandPromptTextLog } = require('./index');
const { getVersions } = require('../api/npm');

module.exports = async () => {
    const data = await getVersions();
    let updateMsg = () => log(' ');
    if (data.latest.version !== version) {
        updateMsg = () => {
            log(' ');
            commandPromptTextLog([`有新的版本啦->v${data.latest.version}`, '更新说明日志：https://git.nucarf.cn/frontend/n-p-m/nucarf-cli/blob/master/history.md', '当前最新版本 -> ', '输入命令更新 -> npm update nucarf-cli -g'], '**');
            log(' ');
        };
    }
    return updateMsg;
};
