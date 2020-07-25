import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'
import User from '@/components/User'
import Role from '@/components/Role'
import Action from '@/components/Action'
import Service from '@/components/Service'
import Parameter from '@/components/Parameter'
import ManageUserOApi from '@/components/ManageUserOApi'
import ApiService from '@/components/ApiService'
import AuditLog from '@/components/AuditLog'
import PartnerFee from '@/components/PartnerFee'
import CustomerLinkingInfo from '@/components/CustomerLinkingInfo'
import ChangePassword from '@/components/ChangePassword'
import BackendService from '@/components/BackendService'
import ReconUpload from '@/components/ReconUpload'
import ReconProcess from '@/components/ReconProcess'
import ReconList from '@/components/ReconList'
import ActivityHistory from '@/components/ActivityHistory'
import DaftarDosen from '@/components/section/DaftarDosen'
import VueRouter from 'vue-router'
// import store from './store'

Vue.use(Router);

const router = new VueRouter({
    mode: 'history', // uris without hashes #, see https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode
    routes: [
        { path: '/login', component: Login },
        {
            path: '/',
            component: Home,
            meta: {
                requiresAuth: true
            },
            children: [{
                    path: '/dashboard',
                    component: Dashboard,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/user',
                    component: User,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/role',
                    component: Role,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/action',
                    component: Action,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/service',
                    component: Service,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/parameter',
                    component: Parameter,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/manage-user-oapi',
                    component: ManageUserOApi,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/api-service',
                    component: ApiService,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/partner-fee',
                    component: PartnerFee,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/customerlinkinginfo',
                    component: CustomerLinkingInfo,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/changepw',
                    component: ChangePassword,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/auditlog',
                    component: AuditLog,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/backend-service',
                    component: BackendService,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/upload-recon',
                    component: ReconUpload,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/process-recon',
                    component: ReconProcess,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/list-recon',
                    component: ReconList,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/activity',
                    component: ActivityHistory,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: '/daftar-dosen',
                    component: DaftarDosen,
                    meta: {
                        requiresAuth: true
                    }
                }
            ]
        },
        // otherwise redirect to home
        { path: '*', redirect: '/' }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const session = localStorage.getItem('session');
    // window.console.log(session);
    if (authRequired && session == null) {
        return next({
            path: '/login',
            query: { returnUrl: to.path }
        });
    }
    next(); // make sure to always call next()!
});

export default router;