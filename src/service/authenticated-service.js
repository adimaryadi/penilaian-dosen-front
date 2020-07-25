import { AXIOS } from '../helper/http-commons'
import config from '../helper/auth-header'

export default {
    // data() {
    //     var auth = null;
    //     if(localStorage.getItem('session') != null){
    //         auth = localStorage.getItem('session')
    //     }
    //     return {
    //         authHeader: auth
    //     }
    // },
    createSession(user, password) {
        // let token            =      localStorage.getItem("session");
        // const auth = config.authHeader(token);
        // this.data.authHeader = auth;
        // window.console.log(token);
        return AXIOS.post('/authentication/session', {
            email: user,
            password: password
        });
    },
    removeSession() {
        return AXIOS.delete('/authentication/session', config.authHeader());
    },
    getProfile() {
        // window.console.log(this.data());
        // config.authHeader(this.data().authHeader);
        // window.console.log(config.authHeader());

        return AXIOS.get('/authentication/my-profile', config.authHeader());
    }
}