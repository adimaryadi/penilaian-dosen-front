import header from '../helper/auth-header'
import { AXIOS } from '../helper/http-commons';

export default {
    GetBackendService( offset , maxResult , term ) {
        let config          =       {}
        config              =       header.authHeader();
        config.params       =       {
                offset:         offset,
                maxResult:      maxResult,
                term:           term
        }
        return AXIOS.get('/service/backend', config);
    },
    GetApiService(term) {
        let config          =       {}
        config              =       header.authHeader();
        config.params       =       {
                term:           term
        }
        return AXIOS.get('/apiService/selected', config);
    },
    SendDataBackEndService(data,status) {
        if (status ==  "add") {
            return AXIOS.post('/service/backend',data,header.authHeader());
        } else if (status == "edit") {
            return AXIOS.put('/service/backend',data,header.authHeader());
        } else if (status == "delete") {
            let config       =       {};
            config           =       header.authHeader();
            config.params    =       {
                serviceName:        data.serviceName
            };
            return AXIOS.delete('/service/backend',config);
        }
    }
}