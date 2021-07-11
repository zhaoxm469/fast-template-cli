const { get } = require('../common');

// 获取最新版本
exports.getVersions = () => get('http://npm.nucarf.cn/-/verdaccio/sidebar/nucarf-cli');
