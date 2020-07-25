import header from '../helper/auth-header'
import { AXIOS } from '../helper/http-commons';
export default {
    GetActivityService(term) {
        let config    =  {}
        config        =   header.authHeader();
        config.params =   {
            term:    term
        }
        return AXIOS.get('/activity/', config);
    }
}