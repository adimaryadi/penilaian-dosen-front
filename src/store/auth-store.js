import Vue from 'vue'
import Vuex from 'vuex'
import api from '../service/authenticated-service'
import config from '../helper/auth-header'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loginSuccess: false,
        loginError: false,
        session: null
    },
    mutations: {
        login_success(state, session) {
            state.loginSuccess = true;
            state.loginError = false;
            state.session = session;
        },
        login_error(state, session) {
            state.loginError = true;
            state.session = session;
        },
        get_profile(state, data) {
            state.data = data;
        }
    },
    actions: {
        login({ commit }, { user, password }) {
            return new Promise((resolve, reject) => {
                api.createSession(user, password)
                    .then(response => {
                        if (response.status == 200) {
                            // place the loginSuccess state into our vuex store
                            localStorage.setItem('session', response.data.token);
                            commit('login_success', response.data.session_id);
                            config.authHeader(response.data.token);
                            // window.console.log(response.data.token);
                            // localStorage.setItem('basic-auth', JSON.stringify(token));
                        }

                        resolve(response)
                    })
                    .catch(error => {
                        // place the loginError state into our vuex store
                        commit('login_error', error.response)
                        reject(error.response);
                    })
            })
        },

        logout() {
            localStorage.removeItem('session');
            localStorage.removeItem('basic-auth');
            // return new Promise((resolve, reject) => {
            //     api.removeSession()
            //         .then(response => {
            //             if (response.status == 200) {
            //                 localStorage.removeItem('session');
            //                 localStorage.removeItem('basic-auth');
            //             }
            //             resolve(response)
            //         })
            //         .catch(() => {
            //             localStorage.removeItem('session');
            //             localStorage.removeItem('basic-auth');
            //             reject("Invalid credentials!")
            //         })
            // })
        },
        getProfile() {
            return new Promise((resolve, reject) => {
                api.getProfile()
                    .then(response => {
                        resolve(response)
                    })
                    .catch(() => {
                        localStorage.removeItem('session');
                        localStorage.removeItem('basic-auth');
                        reject("Invalid credentials!")
                    })
            })
        }
    },
    getters: {
        isLoggedIn: state => state.loginSuccess,
        hasLoginErrored: state => state.loginError,
        session: state => state.session,
    }
})