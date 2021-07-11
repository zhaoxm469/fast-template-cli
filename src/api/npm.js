const axios = require('./config');

// 获取最新版本
exports.getVersions = () => axios.get('http://npm.nucarf.cn/-/verdaccio/sidebar/nucarf-cli');
