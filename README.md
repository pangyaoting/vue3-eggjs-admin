# Vue3 后台管理系统

基于 Vue 3 + TypeScript + egg.js 的前后端分离后台管理系统，内置用户、角色、权限（RBAC）三级权限体系，本地部署运行，已完成多项兼容性与逻辑修复。

> 本项目基于开源项目 [vue3-eggjs-admin](https://github.com/svenjia/vue3-eggjs-admin) 二次开发，在原项目基础上完成了部署兼容、逻辑修复与功能优化。

## 技术栈

- **前端**：Vue 3 + TypeScript + Vite 3 + Element Plus + Pinia + Vue Router
- **后端**：egg.js（Node.js）+ MySQL + Knex（SQL 构造器）
- **认证**：Session 会话 + 密码加盐哈希

## 功能模块

- 登录 / 登出
- 用户管理：新增、删除、封停/启用、重置密码、分配角色
- 角色管理：创建角色、给角色分配用户、给角色分配权限
- 权限管理：菜单 / 接口 / 按钮三级资源，RBAC 权限控制
- 系统布局配置（多布局、主题、暗黑模式）

## 本地运行

### 环境要求

- Node.js 16.x 或 18.x
- MySQL 5.7 或 8.0

### 1. 初始化数据库

```sql
CREATE DATABASE IF NOT EXISTS p11_permission DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;
```

导入表结构：

```bash
mysql -u root -p p11_permission < server/dbs/permission.sql
```

### 2. 配置后端数据库

编辑 `server/config/local/config.mysql.js`，填入你的 MySQL 账号密码：

```js
user: "root",            // 你的 MySQL 用户名
password: "你的密码",     // 你的 MySQL 密码
database: "p11_permission"
```

> 该配置文件已加入 .gitignore，不会提交到仓库。

### 3. 安装依赖并启动后端

```bash
cd server
npm install
npm run dev
# 启动成功：egg started on http://127.0.0.1:7211
```

### 4. 安装依赖并启动前端

```bash
cd client
npm install --legacy-peer-deps
npm run dev
# 启动成功：VITE ready, Local: http://localhost:4000
```

### 5. 登录

浏览器访问 `http://localhost:4000`

- 默认管理员账号：`admin123`
- 默认密码：`a1111111`（见 `server/config/config.default.js` 的 `defaultPassword`）

> 后端首次启动会自动创建 `admin123` 管理员账号。

## 修复与优化记录

### 部署兼容

- 锁定依赖版本（pinia 2.0.36、vue-router 4.1.6 等），解决新版依赖与 Vue 3.2 的兼容冲突
- 修复后端主从数据库配置缺失导致的接口 500（补全 slave 数据库连接）
- 处理构建工具与 ESLint 插件在开发时的干扰

### 业务逻辑

- **软删除逻辑统一**：注册查重、登录校验、角色用户列表均过滤已删除用户
- **用户名可复用**：通过数据库生成列（`active_username`，删除时置 NULL）保留活跃用户名的唯一约束，同时允许复用已删除的用户名
- **跨页面数据同步**：权限管理页使用 `onActivated` 生命周期，在页面切换回时自动刷新当前角色的用户列表

## 目录结构

```
├── client/               # 前端（Vue3 + TS + Vite）
│   ├── src/
│   │   ├── api/          # 接口封装
│   │   ├── views/        # 页面
│   │   ├── store/        # Pinia 状态管理
│   │   └── router/       # 路由与守卫
└── server/               # 后端（egg.js）
    ├── app/
    │   ├── controller/   # 控制器
    │   ├── service/      # 业务逻辑
    │   ├── model/        # 数据模型
    │   └── router/       # 路由
    └── config/           # 配置
```

## 说明

- 本项目为学习 / 求职用途的个人项目，基于开源项目二次开发
- 遵循原项目 MIT License