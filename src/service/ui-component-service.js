import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getComponents( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/ui-component/', config);
    },
    getComponentByTerm(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
    }
        return AXIOS.get('/ui-component/selected',config);
    },
    updateComponent(data) {
        if(!isNullOrUndefined(data.id)){
            return AXIOS.put('/ui-component/', data, header.authHeader());
        }
        
    }
}