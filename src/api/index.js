const axios = require('./config');

// 从gitlab获取脚手架项目列表数据
exports.getFeProjectList = (params) => axios.get('/groups/266/projects?search=-template', params);
