/* cSpell:disable */
const download = require('download-git-repo');
const pify = require('pify');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { getFeProjectList } = require('../api/modules/index');

const {
    log, isExistDir, rmDeepDir, path, hasYarn, loading, commandPromptTextLog,
} = require('../utils/index');

const packageManager = !hasYarn() ? 'yarn' : 'npm';

const downLoadLogMsg = {
    yarn: ['yarn'],
    npm: ['npm install'],
};

async function downLoadTemplate({ appName }) {
    const templateList = await getFeProjectList();
    const { name } = await inquirer.prompt([
        {
            message: '请选择您要使用的脚手架模板',
            name: 'name',
            type: 'list',
            choices: templateList,
        },
    ]);
    const currentData = templateList.find((item) => item.name === name);

    try {
        let { gitZipDownLoadUrl } = currentData;

        // 如果有二级菜单的话
        if (currentData.options) {
            log('\n');
            const choices = currentData.options.child;
            const { name: childName } = await inquirer.prompt([
                {
                    message: currentData.options.title,
                    name: 'name',
                    type: 'list',
                    choices,
                },
            ]);
            const childCurrentData = choices.find((item) => item.name === childName);
            gitZipDownLoadUrl = childCurrentData.gitZipDownLoadUrl;
        }

        loading.show('创建模板中...\n');
        await pify(download)(`direct:${gitZipDownLoadUrl}`, appName);

        loading.hide();

        log('\n🎉 项目模板创建成功\n');
        log('👉 开始使用以下命令：\n');
        commandPromptTextLog([`cd ${appName}`, ...downLoadLogMsg[packageManager]]);
        log('\n');
    } catch (err) {
        log(`\n\n  项目拉取失败拉取失败:${name}`);
        log(`  ${chalk.red(err)}\n`);
        loading.hide();
    }
}

module.exports = async (appName) => {
    const cwd = process.cwd();
    const targetDir = path.resolve(cwd, appName);
    // 如果目录存在
    if (isExistDir(targetDir)) {
        const { action } = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                message: `${chalk.cyan(targetDir)} 目录已经存在. 请您选择一个动作:`,
                choices: [
                    { name: '覆盖', value: 'overwrite' },
                    { name: '取消', value: false },
                ],
            },
        ]);
        // 覆盖
        if (action === 'overwrite') {
            // 先删除目录
            rmDeepDir(targetDir);
            downLoadTemplate({
                targetDir,
                appName,
            });
        }
    } else {
        downLoadTemplate({
            targetDir,
            appName,
        });
    }
};
