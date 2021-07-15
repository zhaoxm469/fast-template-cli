/*
 * @Author: zhaoxingming
 * @Date: 2021-07-15 16:08:04
 * @LastEditTime: 2021-07-15 18:26:28
 * @LastEditors: vscode
 * @Description:npm发布命令，自动修改程序版本号
 *
 * 大概流程如下：
 * 1. 首先修改pack的版本号
 * 2. 打印出版本号变更情况，并询问是否oK
 * 3. 如果N终止操作 ---- 不往下走了
 * 4. 如果Y，执行 npm publish 命令，进行发布
 * 5. 发布成功 执行 git commit , 提交代码到远程
 * 6. 输出成功信息
 *
 */

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');
const { version, name: pkgName } = require('./package.json');

const pkgPath = path.resolve(__dirname, './package.json');

const pkg = fs.readFileSync(pkgPath, 'utf-8');
const newVersion = (`${version.replace(/\D/g, '') - '' + 1}`).padStart(3, '0').split('').join('.');
const newPkg = pkg.replace(version, newVersion);

const loading = {
    spinner: ora(''),
    show(msg = 'Loading') {
        this.spinner.text = msg;
        this.spinner.start();
    },
    hide() {
        this.spinner.stop();
    },
};

(async () => {
    const { updateVer } = await inquirer.prompt({
        type: 'confirm',
        name: 'updateVer',
        message: `版本号即将从 ${chalk.yellow(`v${version}`)} 变更为 -> ${chalk.yellow(`v${newVersion}`)} ，是否继续\n`,
    });

    if (updateVer) {
        fs.writeFileSync(pkgPath, newPkg);
        try {
            await execa('npm', ['publish']);
        } catch (err) {
            console.log(err.stdout);
        }
    }

    const { autoGitCommit } = await inquirer.prompt({
        type: 'confirm',
        name: 'autoGitCommit',
        message: '自动提交package.json文件到远程仓库？\n',
    });

    if (autoGitCommit) {
        loading.show('执行命令中...\n');
        try {
            const { stdout: branchName } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
            await execa('git', ['add', 'package.json']);
            await execa('git', ['commit', '-m', '"feat: 版本号修改" ']);
            await execa('git', ['push', 'origin', branchName]);

            loading.hide();
            console.log(`\n🎉 ${chalk.green('npm发布成功!!')} `);
            console.log(`\n👉 输入命令 ${chalk.green(`npm install -g ${pkgName}`)} 更新至最新版本 ${chalk.yellow(`v${newVersion}`)} \n`);
        } catch (err) {
            console.log(err.stdout);
        }
    }
})();
