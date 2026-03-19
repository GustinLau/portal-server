# Portal Server

一个基于Express的轻量级API服务器，提供文件上传和推送功能。

## 功能特点

- 基于Express框架构建
- 支持文件上传（markdown和excel文件）
- 健康检查接口
- 分析接口（转发到分析服务器）
- 请求token校验
- 完善的日志记录

## 技术栈

- Node.js
- Express
- Multer（文件上传）
- Winston（日志）
- dotenv（环境变量）

## 目录结构

```
portal-server/
├── src/
│   ├── feishu/         # 飞书客户端配置
│   ├── logger/         # 日志配置
│   ├── server/         # 服务器配置和路由
│   └── utils/          # 工具函数
├── .env                # 环境变量配置
├── index.js            # 应用入口
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制`.env.example`文件为`.env`，并填写相关配置：

```bash
# 服务器端口
SERVER_PORT=18285

# 分析服务器地址（分析接口转发目标）
ANALYSIS_SERVER=http://localhost:8080
```

### 3. 启动服务器

```bash
npm start
```

服务器启动后会监听配置的端口，默认端口为18285。

## API接口

### 健康检查

- **URL**: `/`
- **方法**: GET
- **描述**: 检查服务器是否正常运行
- **响应**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-03-18 22:27:12"
  }
  ```

### 文件上传

- **URL**: `/api/dispatch/file`
- **方法**: POST
- **描述**: 上传文件并推送至飞书
- **请求体**:
  - `file`: 要上传的文件（支持markdown和excel文件）
  - `file_name`: 可选，文件名
- **响应**:
  ```json
  {
    "success": true,
    "message": "文件推送成功"
  }
  ```

### 分析接口

- **URL**: `/api/analysis/analyze`
- **方法**: POST
- **描述**: 将请求转发到API服务器进行分析
- **请求体**: 与API服务器要求的格式一致
- **响应**: API服务器的响应结果

## 请求校验

所有API请求（除了健康检查）都需要在请求header中携带`token`参数，否则会返回401错误：

```json
{
  "success": false,
  "message": "token错误"
}
```

## 开发指南

### 添加新路由

在`src/server/index.js`文件中添加新的路由：

```javascript
app.get('/api/new-route', (req, res) => {
  res.status(200).json({
    success: true,
    message: '新路由响应'
  });
});
```

### 配置日志

日志配置位于`src/logger/index.js`文件中，可以根据需要调整日志级别和输出格式。

### 工具函数

工具函数位于`src/utils/index.js`文件中，包含环境变量获取等通用功能。

## 许可证

ISC