const { getFeProjectList } = require('../api/index');
const { log, commandPromptTextLog } = require('../utils/index');

module.exports = async () => {
    const templateList = await getFeProjectList();
    log('\n');
    commandPromptTextLog(templateList.map((item) => `${item.name}（${item.description}）`), '👉');
    log('\n');
};
