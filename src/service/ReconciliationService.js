import { AXIOS } from "../helper/http-commons"
import header from "../helper/auth-header"
export default {
    UploadT24(data) {
        return AXIOS.post('/reconcile/upload/core-data',data,header.Upload());
    },
    UploadiGate(data) {
        return AXIOS.post('/reconcile/upload/igate-data',data,"",header.HeaderUpload());
    }
}