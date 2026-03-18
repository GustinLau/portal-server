import winston from "winston";

// 创建日志器
const logger = winston.createLogger({
  // 日志级别（error > warn > info > http > verbose > debug > silly）
  level: 'info',
  // 日志格式
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 添加时间戳
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  // 日志输出目标（传输方式）
  transports: [
    // 控制台输出
    new winston.transports.Console()
  ]
})

export default logger
