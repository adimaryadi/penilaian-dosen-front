import { AXIOS } from '../helper/http-commons'
import header from '../helper/auth-header'
import { isNullOrUndefined } from 'util';

export default {
    getUser( offset, maxResult, term) {
        let config = {}
        config = header.authHeader();
        config.params = {
                offset : offset,
                maxResult : maxResult,
                term : term
        }
        return AXIOS.get('/user/', config);
    },
    createUser(data) {
        if(isNullOrUndefined(data.userId)){
            return AXIOS.post('/user/', data, header.authHeader());
        }else{
            return AXIOS.put('/user/', data, header.authHeader());
        }
        
    },
    removeUser(data){
        if(!isNullOrUndefined(data.userId)){
            let config = {}
            config = header.authHeader();
            config.params = {
                    id : data.userId
            }
            return AXIOS.delete('/user/', config);
        }
    },
    generatePwd(data){
        if(!isNullOrUndefined(data.userId)){
            let config = {}
            config = header.authHeader();
            return AXIOS.post('/user/generatePasswd/'+data.userId,"", config);
        }
    },
    changePw(data){
            let config = {}
            config = header.authHeader();
            config.params = {
                password : data.newPassword,
                oldpassword : data.oldPassword
            }
            return AXIOS.post('/user/changepw', data, header.authHeader());
    }
}


