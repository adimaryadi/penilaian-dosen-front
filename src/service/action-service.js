import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getActions( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/action/', config);
    },
    getActionsByTerm(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
    }
        return AXIOS.get('/action/selected',config);
    }
    ,
    inserOrUpdateAction(data) {
        if(isNullOrUndefined(data.actionId)){
            return AXIOS.post('/action/', data, header.authHeader());
        }else{
            return AXIOS.put('/action/', data, header.authHeader());
        }
        
    },
    removeAction(data){
        if(!isNullOrUndefined(data.actionId)){
            let config = {}
            config = header.authHeader();
            config.params = {
                    id : data.actionId
            }
            return AXIOS.delete('/action/', config);
        }
    }
}