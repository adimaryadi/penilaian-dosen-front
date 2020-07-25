import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getApiService( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/apiService/', config);
    },
    createApiService(data) {
            return AXIOS.post('/apiService/', data, header.authHeader());
    },
    removeApiService(data){
        if(!isNullOrUndefined(data.serviceName)){
            let config = {}
            config =  header.authHeader();
            config.params = {
                serviceName : data.serviceName
            }
            return AXIOS.delete('/apiService/', config);
        }
    },
    getService(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
    }
        return AXIOS.get('/apiService/selected',config);
    }
}