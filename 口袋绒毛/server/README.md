# 口袋绒毛后端服务

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件：

```env
PORT=3000
JWT_SECRET=你的JWT密钥（生产环境请使用复杂的随机字符串）
DEEPSEEK_API_KEY=你的DeepSeek API密钥（可选，本地AI模式需要）
NODE_ENV=development
```

### 3. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器启动后运行在 `http://localhost:3000`

## API 接口

### 认证接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/auth/register` | POST | 注册用户 |
| `/api/auth/login` | POST | 用户登录 |

### 数据接口（需要认证）

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/gamedata` | GET | 获取用户游戏数据 |
| `/api/gamedata` | POST | 保存用户游戏数据 |
| `/api/gamedata/merge` | POST | 合并本地和服务器数据 |

### AI 接口（需要认证）

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/ai/chat` | POST | 通过后端代理调用 DeepSeek API |

## 前端配置

前端默认连接 `http://localhost:3000`。如果需要修改，请编辑 `口袋绒毛.html` 中的：

```javascript
const API_BASE_URL = 'http://localhost:3000';
```

## 功能说明

1. **用户系统**：注册/登录后数据绑定到账号，换设备也能同步
2. **数据云端化**：所有游戏数据自动同步到服务器
3. **AI回复**：有 DeepSeek API Key 时通过后端代理调用，否则使用预设回复
