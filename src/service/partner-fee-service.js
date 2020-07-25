import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getPartnerFee( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/partner/fee/', config);
    },
    createPartnerFee(data) {
        if(isNullOrUndefined(data.id)){
            return AXIOS.post('/partner/fee/', data, header.authHeader());
        }else{
            return AXIOS.put('/partner/fee/', data, header.authHeader());
        }
        
    },
    removePartnerFee(data){
        if(!isNullOrUndefined(data.id)){
            let config = {}
            config = header.authHeader();
            config.params = {
                    id : data.id
            }
            return AXIOS.delete('/partner/fee/', config);
        }
    }
}