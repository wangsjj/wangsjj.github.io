# 部署指南 - Cloudflare Workers + D1 数据库

本项目使用 Cloudflare Workers 作为后端 API，Cloudflare D1 作为数据库存储。

## 前置条件

1. 拥有 Cloudflare 账号
2. 安装 Node.js (v16+)
3. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

## 部署步骤

### 1. 登录 Cloudflare

```bash
wrangler login
```

### 2. 创建 D1 数据库

```bash
cd workers
wrangler d1 create person-db
```

执行后会输出类似以下内容：

```
✅ Successfully created DB 'person-db' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended
for production workloads, but backs up your data via replication to other nodes.

[[d1_databases]]
binding = "DB"
database_name = "person-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 3. 更新 wrangler.toml

将上一步得到的 `database_id` 复制到 `workers/wrangler.toml` 文件中：

```toml
[[d1_databases]]
binding = "DB"
database_name = "person-db"
database_id = "你的实际数据库ID"
```

### 4. 初始化数据库表

```bash
# 远程数据库初始化
wrangler d1 execute person-db --file=./schema.sql

# 或本地测试环境初始化
wrangler d1 execute person-db --local --file=./schema.sql
```

### 5. 部署 Workers

```bash
wrangler deploy
```

部署成功后会输出 Workers 的 URL，例如：
```
Published person-api (xxx ms)
  https://person-api.你的子域名.workers.dev
```

### 6. 更新前端 API 地址

编辑 `docs/person.js` 文件，将 `API_BASE_URL` 修改为你的 Workers URL：

```javascript
const API_BASE_URL = 'https://person-api.你的子域名.workers.dev';
```

### 7. 部署前端到 Cloudflare Pages

1. 在 Cloudflare Dashboard 中进入 "Pages"
2. 创建新项目，连接你的 GitHub 仓库
3. 设置构建配置：
   - 构建命令：留空（静态网站）
   - 输出目录：`docs`

## 本地开发测试

```bash
cd workers

# 安装依赖
npm install

# 本地启动 Workers（会自动创建本地 D1 数据库）
npm run dev
```

本地开发时，Workers 默认运行在 `http://localhost:8787`。

## API 接口说明

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/persons | 获取所有记录 |
| POST | /api/persons | 新增单条记录 |
| POST | /api/persons/batch | 批量新增记录 |
| PUT | /api/persons/:id | 更新记录（备注） |
| DELETE | /api/persons/:id | 删除单条记录 |
| DELETE | /api/persons | 清空所有记录 |

### 请求示例

**新增记录**
```json
POST /api/persons
{
  "name": "张三",
  "idCardNo": "110101199001011234",
  "mobile": "13800138000",
  "bankCardNo": "6221001234567890123",
  "plateNo": "京A12345",
  "vin": "LVSHFFAN1234567890",
  "address": "北京市朝阳区xxx",
  "note": "测试备注"
}
```

**更新备注**
```json
PUT /api/persons/1
{
  "note": "新的备注内容"
}
```

## 数据库表结构

```sql
CREATE TABLE persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,              -- 姓名
    id_card_no TEXT NOT NULL,        -- 身份证号
    mobile TEXT NOT NULL,            -- 手机号
    bank_card_no TEXT NOT NULL,      -- 银行卡号
    plate_no TEXT NOT NULL,          -- 车牌号
    vin TEXT NOT NULL,               -- 车架号
    address TEXT NOT NULL,           -- 地址
    note TEXT DEFAULT '',            -- 备注
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 常见问题

### Q: 数据库查询报错？
A: 确保已经执行了数据库初始化命令 `wrangler d1 execute person-db --file=./schema.sql`

### Q: CORS 错误？
A: Workers 已配置 CORS，确保前端请求的是正确的 Workers URL

### Q: 如何查看数据库内容？
A: 可以使用以下命令：
```bash
wrangler d1 execute person-db --command="SELECT * FROM persons"
```

## 免费额度说明

Cloudflare Workers 和 D1 都有免费额度：

- **Workers**: 每天 100,000 次请求
- **D1**: 
  - 5GB 存储空间
  - 每天 500 万次读取
  - 每天 10 万次写入

对于个人项目来说，免费额度完全足够使用。
