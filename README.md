# 掌阅图书馆管理系统

前端：Vue 3 + Vite + Element Plus + Pinia  
后端：Node.js + Express + MySQL（mysql2）

---

## 一、本地启动

### 1. 环境要求

- Node.js 18+
- MySQL 8.0+（已创建数据库 `librarydb`、用户 `librarydb_user` 并授权）

### 2. 后端

```bash
cd backend
cp .env.example .env   # 编辑 .env 填写 DB_PASSWORD 等
npm install
npm run db:seed        # 首次或重置数据时执行：建表 + 写入 mock 数据
npm run dev             # 开发：http://localhost:3000
# 或
npm start               # 生产：node src/index.js
```

`.env` 示例：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=librarydb_user
DB_PASSWORD=你的密码
DB_DATABASE=librarydb
PORT=3000
```

### 3. 前端

```bash
# 在项目根目录
npm install
npm run dev             # 开发：默认请求 http://localhost:3000
```

若后端地址不是 `http://localhost:3000`，在根目录新建 `.env`：

```env
VITE_API_BASE_URL=http://你的后端地址:端口
```

---

## 二、Docker 部署

### 1. 仅后端 + MySQL（推荐用于部署后端服务）

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: librarydb
      MYSQL_USER: librarydb_user
      MYSQL_PASSWORD: "111111"
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: librarydb_user
      DB_PASSWORD: "111111"
      DB_DATABASE: librarydb
      PORT: 3000
    depends_on:
      mysql:
        condition: service_healthy

volumes:
  mysql_data:
```

在 `backend` 目录创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY db ./db
EXPOSE 3000
# 启动时先执行 seed（可改为在 CI 中单独执行）
CMD node db/seed.js 2>/dev/null; node src/index.js
```

启动：

```bash
docker compose up -d
# 后端: http://localhost:3000
# MySQL: localhost:3306（库 librarydb，用户 librarydb_user / 111111）
```

### 2. 前端构建后由 Nginx 托管（可选）

前端先本地构建：

```bash
npm run build
```

将 `dist` 部署到任意静态服务器或 Nginx，并配置接口代理到后端（如 `http://backend:3000`）。  
若前后端同域，设置 `VITE_API_BASE_URL` 为后端路径即可。

---

## 三、后端 API 说明

基础地址：`http://localhost:3000/api`（或部署后的后端地址 + `/api`）

### 认证（Auth）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/login | 登录。Body: `{ "username": "xxx", "password": "xxx" }`。成功返回 `{ "user": { id, username, name, role, email, borrowedBooks } }` |
| POST | /auth/logout | 注销（服务端仅返回成功，前端需清除本地 user） |
| POST | /auth/register | 注册。Body: `{ "username", "password", "name?", "email?" }`。成功 201，用户名已存在 409 |

### 用户（Users）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /users | 用户列表（管理员用） |
| PATCH | /users/:id | 更新当前用户资料。Body: `{ "name?", "email?", "password?" }` |

### 书籍（Books）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /books | 书籍列表 |
| GET | /books/:id | 书籍详情 |
| POST | /books | 新增书籍（管理员） |
| PUT | /books/:id | 更新书籍（管理员） |
| DELETE | /books/:id | 删除书籍（管理员，且无在借记录） |

### 借阅（Borrowings）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /borrowings | 借阅记录。Query: `userId` 可选，不传则返回全部 |
| POST | /borrowings | 借书。Body: `{ "userId", "bookId" }` |
| PUT | /borrowings/:id/return | 还书（将指定借阅记录标记为已还） |

---

## 四、测试账号（执行 `npm run db:seed` 后）

- 管理员：`admin` / `admin123`
- 普通用户：`user1` / `user123`
