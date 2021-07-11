const { execSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const fs = require('fs');

exports.execSync = execSync;
exports.path = path;

exports.log = (msg) => console.log(msg);

// 是否有git
exports.hasGit = () => {
    try {
        execSync('git --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
};

// 是否有yarn
exports.hasYarn = () => {
    try {
        execSync('yarn --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
};

// 删除目录
const rmDeepDir = (targetDir) => {
    try {
        const stat = fs.statSync(targetDir);
        if (stat.isFile()) {
            fs.unlinkSync(targetDir);
        } else {
            const files = fs.readdirSync(targetDir);
            files
                .map((file) => path.join(targetDir, file))
                .forEach((item) => rmDeepDir(item));
            fs.rmdirSync(targetDir);
        }
    } catch (e) {
        console.log('删除失败!');
    }
};

// 判断目录是否存在
exports.isExistDir = (targetDir) => {
    try {
        return fs.existsSync(targetDir);
    } catch (err) {
        console.log(`判断目录是否存在，出现了错误:${err}`);
        return false;
    }
};

// 判断文件是否存在
exports.isExistFile = (targetDir) => {
    try {
        return fs.existsSync(path.resolve(__dirname, `../${targetDir}`));
    } catch (err) {
        console.log(`判断文件是否存在，出现了错误:${err}`);
        return false;
    }
};

// 终端loading
exports.loading = {
    spinner: ora(''),
    show(msg = 'Loading') {
        this.spinner.text = msg;
        this.spinner.start();
    },
    hide() {
        this.spinner.stop();
    },
};

/**
 * 终端命令提示log
 * @author zxm
 * @desc 传入字符串数组，终端输出一行一行的命令提示log
 * @param { String } [ leftText ] - 左侧文字
 * @param { Array } [ textList ]  - 字符串数组
 * */
exports.commandPromptTextLog = (textList, leftText = '$') => {
    if (!Array.isArray(textList)) {
        throw new Error('textList is not array');
    }
    textList.forEach((text) => {
        exports.log(chalk.cyan(`${chalk.gray(leftText)} ${text}`));
    });
};

exports.rmDeepDir = rmDeepDir;
