# Vue3 后台管理系统

基于 Vue 3 + TypeScript + egg.js 的前后端分离后台管理系统，内置 RBAC 三级权限体系，包含用户/角色/权限管理、公告管理、系统布局配置等功能。

> 本项目基于开源项目 [vue3-eggjs-admin](https://github.com/svenjia/vue3-eggjs-admin) 扩展而来，在原项目基础上完成了功能扩展与逻辑优化。

## 技术栈

- **前端**：Vue 3 + TypeScript + Vite 3 + Element Plus + Pinia + Vue Router
- **后端**：egg.js（Node.js）+ MySQL + Knex（SQL 构造器）
- **认证**：Session 会话 + 密码加盐哈希（PBKDF2）

## 功能模块

### 用户 / 角色 / 权限（RBAC）
- 登录 / 登出（Session + 加盐哈希认证）
- 用户管理：新增、删除、封停/启用、重置密码、分配角色
- 角色管理：创建角色、分配用户、分配权限
- 权限管理：菜单 / 接口 / 按钮三级资源，RBAC 权限控制

### 公告管理
- 公告列表：分页展示、标题模糊查询、状态标签、空状态提示
- 新增 / 编辑公告：弹窗表单 + 必填校验 + 显示/隐藏状态管理
- 删除公告：二次确认
- 后端 RESTful 接口（list / detail / create / update / delete）
- 数据库表设计：notices 表（标题、内容、状态、创建时间）

### 用户体系健壮性
- **软删除逻辑统一**：注册查重、登录校验、角色用户列表均过滤已删除用户
- **用户名可复用**：通过数据库生成列（active_username）保留活跃用户名的唯一约束，同时允许复用已删除的用户名
- **跨页面数据同步**：权限管理页使用 onActivated 生命周期，页面切换回时自动刷新当前角色的用户列表

### 系统布局
- 多布局、主题切换、暗黑模式

## 核心实现要点

- **查询能力定制**：NoticeService 重写 list 方法，基于 Knex 实现 `LIKE %keyword%` 模糊查询 + 分页 + 总数统计；明确"定位单条记录用精确查询（findOne）、列表搜索用模糊查询（LIKE）"的设计取舍
- **部分字段更新**：update 接口校验仅 id 必填，支持只改部分字段（RESTful PATCH 语义）
- **体验优化**：新增成功后重置搜索并回到第一页；修复单输入框表单回车触发的页面刷新（`@submit.prevent`）；创建时间统一用 formatTime 格式化为本地时间

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

公告表建表 SQL：

```sql
CREATE TABLE `notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL COMMENT '公告标题',
  `content` text COMMENT '公告内容',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1=显示 0=隐藏',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';
```

### 2. 配置后端数据库

编辑 `server/config/local/config.mysql.js`：

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

> 本项目依赖需锁定版本（pinia 2.0.36、vue-router 4.1.6、@intlify/shared 9.2.2 等），请勿直接升级，避免与 Vue 3.2 产生兼容冲突。

### 5. 登录

浏览器访问 `http://localhost:4000`

- 默认管理员账号：`admin123`
- 默认密码：`a1111111`（见 `server/config/config.default.js` 的 `defaultPassword`）

> 后端首次启动会自动创建 `admin123` 管理员账号。

## 目录结构

```
├── client/               # 前端（Vue3 + TS + Vite）
│   ├── src/
│   │   ├── api/
│   │   │   └── system/notice/   # 公告接口封装
│   │   ├── views/
│   │   │   └── system/notice/   # 公告管理页面
│   │   ├── store/        # Pinia 状态管理
│   │   └── router/       # 路由与守卫
└── server/               # 后端（egg.js）
    ├── app/
    │   ├── controller/system/notice.js   # 公告控制器
    │   ├── service/system/notice.js      # 公告服务
    │   ├── router/system/notice.js       # 公告路由
    │   └── config/resources.json         # 菜单权限资源
    └── config/           # 配置
```

## 说明

- 本项目为学习 / 求职用途的个人项目
- 遵循原项目 MIT License