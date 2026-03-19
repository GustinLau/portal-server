import express from 'express';
import multer from 'multer';
import logger from '../logger/index.js';
import { getEnv } from "../utils/index.js";
import dayjs from "dayjs";
import { client } from '../feishu/index.js';

const app = express();
const PORT = getEnv('SERVER_PORT', '18285')
const TOKEN = getEnv('TOKEN', '')
const ANALYSIS_SERVER = getEnv('ANALYSIS_SERVER', 'http://127.0.0.1:8000');
const FEI_SHU_UNION_ID = getEnv('FEI_SHU_UNION_ID', '');

// 配置multer内存存储
const storage = multer.memoryStorage();
// 创建multer实例
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB文件大小限制
    },
    fileFilter: function(req, file, cb) {
        // 只允许markdown和excel类型的文件
        const allowedTypes = [
            'text/markdown',
            'text/x-markdown',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.oasis.opendocument.spreadsheet'
        ];

        // 也可以通过文件扩展名判断
        const allowedExtensions = ['.md', '.markdown', '.xls', '.xlsx', '.ods'];
        const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();

        if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传markdown和excel类型的文件'), false);
        }
    }
});

// 解析JSON请求体
app.use(express.json());
// 解析URL编码的请求体
app.use(express.urlencoded({ extended: true }));
// 通用拦截器：校验请求header必须带token参数
app.use((req, res, next) => {
    // 健康检查接口不需要token校验
    if (req.path === '/') {
        return next();
    }
    const token = req.headers.authorization;
    if (!token || token !== TOKEN) {
        return res.status(401).json({
            success: false,
            message: 'token错误'
        });
    }
    next();
});

// 健康检查接口
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
});

// 单个文件上传接口
app.post('/api/dispatch/file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的文件'
            });
        }

        // 上传飞书
        const { file_key } = await client.im.file.create({
            data: {
                file_type: 'stream',
                file_name: req.body?.file_name ?? req.file.originalname,
                file: req.file.buffer
            },
        });
        logger.info(`文件上传成功: ${file_key}`);
        // 推送飞书
        const { code, msg } = await client.im.v1.message.create({
                params: {
                    receive_id_type: 'union_id',
                },
                data: {
                    receive_id: FEI_SHU_UNION_ID,
                    msg_type: 'file',
                    content: JSON.stringify({ file_key: file_key })
                },
            }
        )
        if (code === 0) {
            logger.info(`飞书推送文件成功`);
        } else {
            throw new Error(`飞书推送文件失败: ${msg}`);
        }
        res.status(200).json({
            success: true,
            message: '文件推送成功'
        });
    } catch (error) {
        logger.error(`文件推送失败: ${error.message}`);
        res.status(500).json({
            success: false,
            message: '文件推送失败',
            error: error.message
        })
    }
});

// 分析接口：转发到API_SERVER
app.post('/api/analysis/analyze', async (req, res) => {
    try {
        // 转发请求
        const response = await fetch(`${ANALYSIS_SERVER}/api/v1/analysis/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        logger.error(`分析接口转发失败: ${error.message}`);
        res.status(500).json({
            success: false,
            message: '分析接口转发失败',
            error: error.message
        });
    }
});

export function startServer() {
    app.listen(PORT, () => {
        logger.info(`服务器启动成功，监听端口: ${PORT}`);
        logger.info('健康检查接口: /');
        logger.info('文件上传接口: /api/dispatch/file');
        logger.info('股票分析接口: /api/analysis/analyze');
    });
}