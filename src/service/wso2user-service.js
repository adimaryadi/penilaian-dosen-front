import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'

export default {
    getUser( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/wso2/', config);
    }
}