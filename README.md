# 安装依赖

## 使用npm
```sh
#全局安装@vue/cli
npm install @vue/cli -g
#设置镜像为taobao
npm config set registry https://registry.npm.taobao.org
#install dependency
npm install

```
## 使用cnpm
```sh
#安装cnpm
npm install cnpm -g
#安装依赖
cnpm install
```

# 启动
## 开发环境
### 设置hosts
```
101.52.252.56 api.xcmdb.od.com
```
### 启动
```sh
npm run dev
#This will automatically open http://localhost:9527
```

# 构建

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

