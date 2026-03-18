import express from 'express';
// import multer from 'multer';
import logger from '../logger/index.js';
import { getEnv } from "../utils/index.js";
import dayjs from "dayjs";

const app = express();
const PORT = getEnv('SERVER_PORT', '8000')

// === input params start
// const appID = getEnv('FEI_SHU_APP_ID'); // app_id, required, 应用 ID
// 应用唯一标识，创建应用后获得。有关app_id 的详细介绍。请参考通用参数https://open.feishu.cn/document/ukTMukTMukTM/uYTM5UjL2ETO14iNxkTN/terminology。
// const appSecret = getEnv('FEI_SHU_APP_SECRET'); // app_secret, required, 应用 secret
// 应用秘钥，创建应用后获得。有关 app_secret 的详细介绍，请参考https://open.feishu.cn/document/ukTMukTMukTM/uYTM5UjL2ETO14iNxkTN/terminology。
// === input params end

// const client = new Lark.Client({
//     appId: appID,
//     appSecret: appSecret,
//     disableTokenCache: false
// });

// 配置multer内存存储
// const storage = multer.memoryStorage();

// 创建multer实例
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB文件大小限制
//     },
//     fileFilter: function(req, file, cb) {
//         // 只允许markdown和excel类型的文件
//         const allowedTypes = [
//             'text/markdown',
//             'text/x-markdown',
//             'application/vnd.ms-excel',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//             'application/vnd.oasis.opendocument.spreadsheet'
//         ];
//
//         // 也可以通过文件扩展名判断
//         const allowedExtensions = ['.md', '.markdown', '.xls', '.xlsx', '.ods'];
//         const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();
//
//         if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
//             cb(null, true);
//         } else {
//             cb(new Error('只允许上传markdown和excel类型的文件'), false);
//         }
//     }
// });

// 解析JSON请求体
app.use(express.json());
// 解析URL编码的请求体
app.use(express.urlencoded({ extended: true }));

// 通用拦截器：校验请求header必须带token参数
// app.use((req, res, next) => {
//     // 健康检查接口不需要token校验
//     if (req.path === '/') {
//         return next();
//     }
//
//     const token = req.headers.token;
//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: '请求header中缺少token参数'
//         });
//     }
//
//     // 这里可以添加token有效性的验证逻辑
//     // 例如：验证token是否过期、是否有效等
//
//     next();
// });

// 健康检查接口
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
});

// // 单个文件上传接口
// app.post('/api/dispatch/file', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: '请选择要上传的文件'
//             });
//         }
//
//         // 上传飞书
//         const { file_key } = await client.im.file.create({
//             data: {
//                 file_type: 'stream',
//                 file_name: req.body?.file_name ?? req.file.originalname,
//                 file: req.file.buffer
//             },
//         });
//         logger.info(`文件上传成功: ${file_key}`);
//         // 推送飞书
//         const { code, msg } = await client.im.v1.message.create({
//                 params: {
//                     receive_id_type: 'union_id',
//                 },
//                 data: {
//                     receive_id: getEnv('FEI_SHU_UNION_ID'),
//                     msg_type: 'file',
//                     content: JSON.stringify({ file_key: file_key })
//                 },
//             }
//         )
//         if (code === 0) {
//             logger.info(`飞书推送文件成功`);
//         } else {
//             throw new Error(`飞书推送文件失败: ${msg}`);
//         }
//         res.status(200).json({
//             success: true,
//             message: '文件推送成功'
//         });
//     } catch (error) {
//         logger.error(`文件推送失败: ${error.message}`);
//         res.status(500).json({
//             success: false,
//             message: '文件推送失败',
//             error: error.message
//         })
//     }
// });


export function startServer() {
    app.listen(PORT, () => {
        logger.info(`服务器启动成功，监听端口: ${PORT}`);
    });
}