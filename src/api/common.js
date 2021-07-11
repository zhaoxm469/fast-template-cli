const axios = require('./config');

exports.get = (apiUrl) => axios.get(apiUrl);
exports.post = (apiUrl) => axios.post(apiUrl);
