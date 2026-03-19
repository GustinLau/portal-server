import { getEnv } from "../utils/index.js";
import Lark from '@larksuiteoapi/node-sdk'

const FEI_SHU_APP_ID = getEnv('FEI_SHU_APP_ID');
const FEI_SHU_APP_SECRET = getEnv('FEI_SHU_APP_SECRET');

export const client = new Lark.Client({
    appId: FEI_SHU_APP_ID,
    appSecret: FEI_SHU_APP_SECRET,
    disableTokenCache: false
});

