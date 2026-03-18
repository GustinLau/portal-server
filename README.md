# Portal Server

一个基于Express的轻量级API服务器，提供文件上传和推送功能。

## 功能特点

- 基于Express框架构建
- 支持文件上传（markdown和excel文件）
- 健康检查接口
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
SERVER_PORT=8000
```

### 3. 启动服务器

```bash
npm start
```

服务器启动后会监听配置的端口，默认端口为8000。

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

### 文件上传（已注释）

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

## 请求校验

所有API请求（除了健康检查）都需要在请求header中携带`token`参数，否则会返回401错误：

```json
{
  "success": false,
  "message": "请求header中缺少token参数"
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