import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getServices( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/service/', config);
    },
    getServicesByTerm(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
    }
        return AXIOS.get('/service/selected',config);
    },
    updateRole(data) {
        if(!isNullOrUndefined(data.id)){
            return AXIOS.put('/service/', data, header.authHeader());
        }
        
    }
}