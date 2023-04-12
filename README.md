# MMGC-frontent 黄金祭赛事官网前端

本项目基于Nuxt3建立而成

## 项目功能点

- 由Nuxt3带来的服务端渲染

- 支持了三语国际化 中文英文和日文

- 对elementPlus 做了主题定制

- 采用Videojs/vue 进行视频播放

- 动态背景化

## 可改进点

- 支持移动端

- 支持主题样式自定义

- 支持更加正确的路由跳转动画（to be solved : Nuxt3-Bug）

## 项目运行&启动

确保你需要拥有nodejs 16.0以上的环境

```bash
yarn install
```
安装依赖

- 正常启动
```bash
yarn run dev
```
- pm2 直接启动 请确保你的PM2已被安装
```bash
yarn run build && yarn run start
```

- node 直接启动 
```bash
yarn run build && yarn run start:node
```
