import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    createData(data) {
        // window.console.log(data);
        if(isNullOrUndefined(data.id)){
            return AXIOS.post('/partner/create', data, header.authHeader());
        }else{
            return AXIOS.put('/partner/update', data, header.authHeader());
        }
        
    },
    getPartner(term) {
        let config = {}
        config = header.authHeader();
        config.params = {
            term : term
        }
        return AXIOS.get('/partner/selected',config);
    },
    resendEmail(data){
        if(!isNullOrUndefined(data.umUserId)){
            let config = {}
            config = header.authHeader();
            // window.console.log(config);
            return AXIOS.post('/partner/resendEmail/'+data.umUserId,"", config);
        }
    }
}