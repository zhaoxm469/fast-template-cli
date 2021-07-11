# 说明

用于快速拉取 基础项目模板的 命令行工具.

## 当前支持的 基础项目模板

1. （vue-admin）PC端 vue2.6 + element-ui 的后台管理项目
2. ([npm-ts-template-starter](https://github.com/zhaoxm469/npm-ts-template-starter))快速 构建库 或者插件的 项目基础模板

## 版本要求

* 需要 [Node.js](https://nodejs.org/) 8.9 或更高版本 (推荐 8.11.0+).  
* 你可以使用 [nvm](https://github.com/creationix/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本.

## 使用

npm全局安装fast-template-cli  

* npm install -g fast-template-cli
  
终端运行命令, 校验是否安装成功

* fast-template-cli -V  

创建一个 构建npm包的 基础项目模板. 终端输入

* fast-template create h5-confirm-environment  

## 命令行参数设计

```BASH
fast-template -h, --help          输出使用帮助信息
fast-template -v, --version       版本号
fast-template create < app-name > 创建脚手架项目  
fast-template list                列出所有项目脚手架模板  
```
