# Library 后端

基于 Express + mysql2，数据存储在 MySQL 数据库 `librarydb` 下。

## 环境要求

- Node.js 18+
- MySQL 已启动，并已创建数据库 `librarydb`、用户 `librarydb_user` 且对该库有权限

## 配置

复制 `.env.example` 为 `.env` 并填写数据库密码等：

```bash
cp .env.example .env
```

`.env` 示例：

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=librarydb_user
DB_PASSWORD=你的密码
DB_DATABASE=librarydb
PORT=3000
```

## 安装与运行

```bash
cd backend
npm install
```

### 初始化数据库表与 mock 数据

首次使用前执行（会先执行 `db/schema.sql` 建表，再写入 seed 数据）：

```bash
npm run db:seed
```

### 启动服务

```bash
npm run dev
```

服务默认运行在 `http://localhost:3000`。前端通过环境变量 `VITE_API_BASE_URL`（默认 `http://localhost:3000`）请求该地址。

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 登录，body: `{ username, password }` |
| PATCH | /api/users/:id | 更新用户资料（name, email, password） |
| GET | /api/users | 用户列表（管理员） |
| GET | /api/books | 书籍列表 |
| GET | /api/books/:id | 书籍详情 |
| POST | /api/books | 新增书籍 |
| PUT | /api/books/:id | 更新书籍 |
| DELETE | /api/books/:id | 删除书籍 |
| GET | /api/borrowings | 借阅记录（可选 query: userId） |
| POST | /api/borrowings | 借书，body: `{ userId, bookId }` |
| PUT | /api/borrowings/:id/return | 还书 |
