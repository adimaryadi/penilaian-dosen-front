import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getRole( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/role/', config);
    },
    getRoles(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
    }
        return AXIOS.get('/role/selected',config);
    }
    ,
    inserOrUpdateRole(data) {
        if(isNullOrUndefined(data.roleId)){
            return AXIOS.post('/role/', data, header.authHeader());
        }else{
            return AXIOS.put('/role/', data, header.authHeader());
        }
        
    },
    removeRole(data){
        if(!isNullOrUndefined(data.roleId)){
            let config = {}
            config = header.authHeader();
            config.params = {
                    id : data.roleId
            }
            return AXIOS.delete('/role/', config);
        }
    }
}