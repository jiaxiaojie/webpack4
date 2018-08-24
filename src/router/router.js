import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
import app from '../App.vue'

import crowd from '../view/crowd/page.vue'
import crowdList from '../view/crowd/items/list.vue'
import crowdCreate from '../view/crowd/items/create.vue'

import message from '../view/message/page.vue'
import msgList from '../view/message/items/list.vue'
import msgCreate from '../view/message/items/create.vue'
import msgDetail from '../view/message/items/detail.vue'
import bill from '../view/message/items/bill.vue'

import config from '../view/config/page.vue'
import user from '../view/config/items/user.vue'
import customer from '../view/config/items/customer.vue'
import department from '../view/config/items/department.vue'

import login from '../view/login/login.vue'
import updatePwd from '../view/password/password.vue'
import _global from "../components/common/global/variables";

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name:'app',
        component: app,
        // redirect: '/crowd/list'
        redirect: '/login'
    },
    // 人群管理模块
    {
        path:"/crowd",
        component: crowd,
        name:'人群管理',
        redirect: '/crowd/list',
        children: [
            {
                path: 'list',
                name:'人群管理列表',
                component: crowdList,
            },
            {
                path: 'create',
                name:'新增人群',
                component: crowdCreate,
            }
        ]
    },
    // 短信管理模块
    {
        path:"/message",
        component: message,
        name:'短信项目管理',
        redirect: '/message/list',
        children: [
            {
                path: 'list',
                name:'短信项目列表',
                component: msgList,
            },
            {
                path: 'create',
                name:'创建短信',
                component: msgCreate,
            } ,
            {
                path: 'edit',
                name:'编辑短信',
                component: msgCreate,
            } ,
            {
                path: 'detail',
                name:'短信详情',
                component: msgDetail,
            } ,
            {
                path: 'bill',
                name:'短信账单',
                component: bill,
            }
        ]
    },
    // 配置管理模块
    {
        path: '/user',
        name:'用户管理',
        component: user,
    },
    {
        path: '/customer',
        name:'客户管理',
        component: customer,
    },
    {
        path: '/department',
        name:'部门管理',
        component: department,
    },
    {
        path:"/login",
        name:'login',
        component: login
    },
    {
        path:'/updatePwd',
        name:'修改密码',
        component: updatePwd

    },
    {
        path: "*",
        redirect: "/"
    }
]

var router =  new VueRouter({
    mode: 'history',
    routes
})
router.beforeEach(function (to, from, next) {
    let permission = _global.permission
    let roleId = localStorage.getItem('roleId')
    //已经登录
    if(roleId){

        if((permission[to.path].findIndex(n => n==roleId)) == -1){
            next({
                path: '/crowd/list'
            })
        }
    }
    next()
});
export default router;