import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import {nextTick} from "vue";
import Test from "@/pages/test.vue";

const routes = [
    {
        path: '/test',
        name: 'test',
        component: Test
    },
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        meta: {
            auth: true
        },
        component: () => import('../pages/AboutView.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {auth: false},
        component: () => import('../pages/LoginPage.vue')
    },
    {
        name : 'calendar',
        path: '/calendar',

        component: () => import('../pages/CalendarPage')

    }, {
        name : 'agenda',
        path: '/agenda',
        meta: {auth : true},
        component: () => import('../pages/AgendaPage.vue')

    },
    {
        path: '/signout',
        name: 'signout',
        meta: {
            auth: true
        },
        component: () => import('../pages/SignOutPage.vue')
    },{
        path: '/adminremovelessons',
        name: 'adminremovelessons',
        meta: {
            auth: true
        },
        component: () => import('../pages/AdminRemoveLessons.vue')
    },{
        path: '/addteachingspage',
        name: 'addteachingspage',
        meta: {
            auth: true
        },
        component: () => import('../pages/AddTeachingsPage.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to,from,next) => {
    if('auth' in to.meta && to.meta.auth && !localStorage.getItem('session')){
        next('/login');
    }else if('auth' in to.meta && !to.meta.auth && localStorage.getItem('session')){
        next('/about')
    }else{
        next();
    }
});

export default router
