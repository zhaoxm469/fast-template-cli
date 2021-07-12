const axios = require('axios');
const { loading } = require('../utils/index');

const baseURL = 'https://gitee.com';

let needLoadingRequestCount = 0;
function showLoading() {
    if (needLoadingRequestCount === 0) {
        loading.show();
    }
    needLoadingRequestCount += 1;
}

function hideLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount -= 1;
    if (needLoadingRequestCount === 0) {
        loading.hide();
    }
}

const instance = axios.create({
    baseURL,
    timeout: 5000,
});

instance.interceptors.request.use((config) => {
    showLoading();
    return config;
});

// 添加响应拦截器
instance.interceptors.response.use((response) => {
    hideLoading();
    return response.data;
},
(error) => {
    hideLoading();
    return Promise.reject(error);
});

module.exports = instance;
