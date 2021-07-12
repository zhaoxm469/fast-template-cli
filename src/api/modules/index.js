/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { get } = require('../common');

exports.getFeProjectList = async (params) => {
    try {
        const data = await get('/api/v5/users/izhaoxm/repos', params);
        // const data = await get('/users/zhaoxm469/repos', params);
        // 获取所有 项目基础脚手架模板 的列表
        const starterList = data.filter((item) => item.name.includes('starter'));
        for (const item of starterList) {
            item.name = `${item.name}（${item.description}）`;
            try {
                const [{ name }] = await get(item.tags_url);
                item.tagName = name;
            } catch (err) {
                console.error(`请检查${item.name}项目模板git上是否有tag标签`);
            }
        }
        console.log(starterList.length);
        return starterList;
    } catch (err) {
        console.error('从github拉取项目失败，请重新尝试');
    }
};
