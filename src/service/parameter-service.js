import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getParameters( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/parameter/', config);
    },
    inserOrUpdateAction(data) {
        if(isNullOrUndefined(data.id)){
            return AXIOS.post('/parameter/', data, header.authHeader());
        }else{
            return AXIOS.put('/parameter/', data, header.authHeader());
        }
        
    },
    getParameterByTerm(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
    }
        return AXIOS.get('/parameter/selected',config);
    },
    removeAction(data){
        if(!isNullOrUndefined(data.id)){
            let config = {}
            config = header.authHeader();
            config.params = {
                    id : data.id
            }
            return AXIOS.delete('/parameter/', config);
        }
    }
}