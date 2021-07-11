/* cSpell:disable */
const download = require('download-git-repo');
const pify = require('pify');
const inquirer = require('inquirer');
const chalk = require('chalk');
// const execa = require('execa');
const { getFeProjectList } = require('../api/modules/index');

const {
    log, isExistDir, rmDeepDir, path, hasYarn, loading, commandPromptTextLog,
} = require('../utils/index');

let packageManager = 'npm';
// const pageInstall = '--registry https://registry.npm.taobao.org install ';

if (!hasYarn()) {
    packageManager = 'yarn';
    // pageInstall = '--registry=https://registry.npmjs.org/';
}

const downLoadLogMsg = {
    yarn: ['yarn'],
    npm: ['npm run install'],
};

async function downLoadTemplate({ appName }) {
    const templateList = await getFeProjectList();

    const { url } = await inquirer.prompt([
        {
            message: '请选择您要使用的脚手架模板',
            name: 'url',
            type: 'list',
            choices: templateList,
        },
    ]);
    const { zipDownLoadUrl } = templateList.find((item) => item.name === url);
    const gitDownPath = /.com\/repos(.*)/.exec(zipDownLoadUrl)[1].replace('zipball', 'zip');
    loading.show('拉取模板中...\n');
    try {
        await pify(download)(`direct:https://codeload.github.com${gitDownPath}`, appName);

        loading.hide();

        log('项目模板拉成功\n');
        log('👉 开始使用以下命令：\n');
        commandPromptTextLog([`cd ${appName}`, ...downLoadLogMsg[packageManager]]);
        log('\n');

        // loading.show('安装依赖中...\n');

        // execa(packageManager, pageInstall.split(' '), {
        //     cwd: appName,
        // }).then(() => {
        //     loading.hide();
        //     log('  依赖安装成功 \n');

        //     log(chalk.green('\n🎉 项目脚手架模版创建成功'));

        //     if (url.includes('uniapp')) {
        //         log(`👉 点击查看运行教程文档:${chalk.cyan('https://uniapp.dcloud.io/quickstart?id=%E8%BF%90%E8%A1%8Cuni-app')}\n\n`);
        //     } else {
        //         log('👉 开始使用以下命令：\n');
        //         commandPromptTextLog([`cd ${appName}`, ...downLoadLogMsg[packageManager]]);
        //         log('\n');
        //     }
        // }).catch((err) => {
        //     loading.hide();
        //     log('\n\n  依赖安装失败 请手动执行命令安装！', err);
        // });
    } catch (err) {
        log(`\n\n  项目拉取失败拉取失败:${url}`);
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
