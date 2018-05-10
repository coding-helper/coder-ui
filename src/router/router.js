import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home',
            title: {
                i18n: 'home'
            },
            name: 'home_index',
            component: () => import('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () => import('@/views/own-space/own-space.vue')
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () => import('@/views/message/message.vue')
        },
		{
            path: 'attrList/:fid',
            title: '属性管理',
            name: 'attr_list',
            component: () => import('@/views/attr/attrList.vue')
        },
        {
            path: 'optList/:fid',
            title: '操作管理',
            name: 'opt_list',
            component: () => import('@/views/opt/optList.vue')
        },
        {	
			path: 'optAttrList/:oid/:fid', 
			title: '操作属性管理', 
			name: 'opt_attr_list', 
			component: () => import('@/views/opt/optAttrList.vue')
		},
        {
            path: 'funcList/:id',
            title: '功能管理',
            name: 'func_list',
            component: () => import('@/views/func/funcList.vue')
        },
        {
            path: 'dictList/:id',
            title: '字典管理',
            name: 'dict_list',
            component: () => import('@/views/dict/dictList.vue')
        },
        {
            path: 'ifcList/:id',
            title: '接口管理',
            name: 'ifc_list',
            component: () => import('@/views/ifc/ifcList.vue')
        },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        access: '0',
        component: Main,
        children: [
            {
                path: 'index',
                title: '错误页面',
                name: 'errorpage_index',
                access: '0',
                component: () => import('@/views/error-page/error-page.vue'),
            },
        ]
    },
	{
        path: '/func',
        icon: 'android-sad',
        title: '功能管理',
        name: 'funcManagement',
        component: Main,
        children: [
            {
				path: 'funcManagement', 
				title: '功能管理', 
				name: 'func_management', 
				component: () => import('@/views/func/func.vue')
			}
        ]
    },
    {
        path: '/dict',
        icon: 'lock-combination',
        title: '字典',
        name: 'dict',
        component: Main,
        children: [
            {
                path: '/dictQuery1',
                title: '字典信息列表',
                name: 'dict_query1',
                component: () => import('@/views/dict/dictQuery1.vue')
            },
        ]
    },
    {
        path: '/project',
        icon: 'lock-combination',
        title: '项目管理',
        name: 'project',
        component: Main,
        children: [
            {
                path: '/projectList',
                title: '项目信息列表',
                name: 'project_list',
                component: () => import('@/views/project/projectList.vue')
            },
        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
