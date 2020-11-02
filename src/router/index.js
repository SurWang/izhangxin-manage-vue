import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

console.log(Vue)
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'dashboard', affix: true }
        }]
    }
]

export const routes404 = { path: '*', redirect: '/404', hidden: true }
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        name: 'System',
        meta: { title: '系统管理', icon: 'setting', permissionId: 100000 },
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/system/userManage'),
                meta: {
                    title: '用户管理',
                    icon: 'user',
                    permissionId: 100100
                }
            },
            {
                path: 'role',
                name: 'RolePermission',
                component: () => import('@/views/system/role'),
                meta: {
                    title: '角色管理',
                    icon: 'framework',
                    permissionId: 100200
                }
            }/*,
            {
                path: 'loginLog',
                name: 'LoginLog',
                component: () => import('@/views/system/loginLog'),
                meta: {
                    title: '登录日志',
                    icon: 'payroll',
                    permissionId: 100300
                }
            }*/
        ]
    },

    {
        path: '/app',
        component: Layout,
        redirect: '/app/channel',
        name: 'App',
        meta: { title: '应用管理', icon: 'project', permissionId: 200000 },
        children: [
            {
                path: 'info',
                name: 'AppInfo',
                component: () => import('@/views/app/info'),
                meta: {
                    title: '应用管理',
                    icon: 'app',
                    permissionId: 200100
                }
            },
            {
                path: 'channel',
                name: 'ChannelInfo',
                component: () => import('@/views/app/channel'),
                meta: {
                    title: '渠道管理',
                    icon: 'attendance',
                    permissionId: 200200
                }
            },
            {
                path: 'online/param',
                name: 'OnlineParams',
                component: () => import('@/views/app/onlineParams'),
                meta: {
                    title: '在线参数',
                    icon: 'attendance',
                    permissionId: 200300
                }
            },
            {
                path: 'error/info',
                name: 'Errorinfo',
                component: () => import('@/views/app/errorInfo'),
                meta: {
                    title: '错误信息',
                    icon: 'attendance',
                    permissionId: 200400
                }
            }
        ]
    },
    {
        path: '/account',
        component: Layout,
        redirect: '/account/accountDetail',
        name: 'Account',
        meta: { title: '账号信息', icon: 'account', permissionId: 300000 },
        children: [
            {
                path: 'accountDetail',
                name: 'AccountDetail',
                component: () => import('@/views/account/accountDetail'),
                meta: {
                    title: '账号详情',
                    icon: 'account',
                    permissionId: 300100
                }
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/account/accountChange'),
                meta: {
                    title: '账变信息',
                    icon: 'account',
                    permissionId: 300200
                }
            },
            {
                path: 'newAccountChange',
                name: 'NewAccountChange',
                component: () => import('@/views/account/newAccountChange'),
                meta: {
                    title: '新账变信息',
                    icon: 'account',
                    permissionId: 300300
                }
            },
            {
                path: 'exe/account',
                name: 'ExeAccount',
                component: () => import('@/views/account/exeAccount'),
                meta: {
                    title: '解绑-修改昵称',
                    icon: 'account',
                    permissionId: 300300
                }
            },

            {
                path: 'account/thm',
                name: 'AccountThm',
                component: () => import('@/views/account/thm'),
                meta: {
                    title: '特惠码查询',
                    icon: 'account',
                    permissionId: 300300
                }
            }
        ]
    },
    {
        path: '/pay',
        component: Layout,
        redirect: '/pay/log',
        name: 'Exchange',
        meta: { title: '充值查询', icon: 'infull', permissionId: 400000 },
        children: [
            {
                path: 'payLog',
                name: 'PayLog',
                component: () => import('@/views/pay/payLog'),
                meta: {
                    title: '充值明细',
                    icon: 'infull',
                    permissionId: 400100
                }
            },
            {
                path: 'method',
                name: 'Method',
                component: () => import('@/views/pay/method'),
                meta: {
                    title: '支付方式',
                    icon: 'infull',
                    permissionId: 400200
                }
            }
        ]
    },

    {
        path: '/operate',
        component: Layout,
        redirect: '/operate/msg',
        name: 'Operate',
        meta: { title: '运营管理', icon: 'operate', permissionId: 500000 },
        children: [
            {
                path: 'msg',
                name: 'Msg',
                component: () => import('@/views/operate/msg'),
                meta: {
                    title: '定时消息',
                    icon: 'adInfo',
                    permissionId: 500100
                }
            },
            {
                path: 'reg/limit',
                name: 'RegLimit',
                component: () => import('@/views/operate/regLimit'),
                meta: {
                    title: '掌心注册限制',
                    icon: 'adInfo',
                    permissionId: 500200
                }
            },
            {
                path: 'phone/code',
                name: 'PhoneCode',
                component: () => import('@/views/operate/phoneCode'),
                meta: {
                    title: '手机验证码查询  ',
                    icon: 'adTemp',
                    permissionId: 500300
                }
            },
            {
                path: 'upload/file',
                name: 'UploadFile',
                component: () => import('@/views/operate/uploadFile'),
                meta: {
                    title: '上传文件图片',
                    icon: 'record',
                    permissionId: 500400
                }
            },
            {
                path: 'create/folder',
                name: 'CreateFolder',
                component: () => import('@/views/operate/createFolder'),
                meta: {
                    title: '创建文件夹',
                    icon: 'record',
                    permissionId: 500500
                }
            }
        ]
    },


    {
        path: '/kefu',
        component: Layout,
        redirect: '/kefu/gift',
        name: 'Account',
        meta: { title: '客服管理', icon: 'operate', permissionId: 600000 },
        children: [
            {
                path: 'gift',
                name: 'Gift',
                component: () => import('@/views/kefu/gift'),
                meta: {
                    title: '新礼包管理',
                    icon: 'param',
                    permissionId: 600100
                }
            },
            {
                path: 'gift/key',
                name: 'GiftKey',
                component: () => import('@/views/kefu/giftKey'),
                meta: {
                    title: '新礼包领取情况',
                    icon: 'adInfo',
                    permissionId: 600200
                }
            }
        ]
    },

    {
        path: '/pyq',
        component: Layout,
        redirect: '/pyq/box',
        name: 'Exchange',
        meta: { title: '牌友圈系统设置', icon: 'exchange', permissionId: 700000 },
        children: [
           /* {
                path: 'box',
                name: 'box',
                component: () => import('@/views/pyq/box'),
                meta: {
                    title: '商品编辑',
                    icon: 'goods',
                    permissionId: 700100
                }
            },*/
            {
                path: 'box',
                name: 'box',
                component: () => import('@/views/pyq/box'),
                meta: {
                    title: '商店',
                    icon: 'box',
                    permissionId: 700100
                }
            },
            {
                path: 'xinge',
                name: 'Xinge',
                component: () => import('@/views/pyq/xinge'),
                redirect: '/pyq/xinge/app/config',
                meta: {title: '信鸽配置',icon: 'box',permissionId: 700300},
                children: [
                    {
                        path: 'app/config',
                        name: 'AppConfig',
                        component: () => import('@/views/pyq/xinge/appConfig'),
                        meta: {
                            title: '信鸽应用配置',
                            icon: 'box',
                            permissionId: 700300,
                        }
                    },
                    {
                        path: 'push/config',
                        name: 'PushConfig',
                        component: () => import('@/views/pyq/xinge/pushConfig'),
                        meta: {
                            title: '信鸽推送配置',
                            icon: 'box',
                            permissionId: 700300,
                        }
                    }
                ]
            },
            {
                path: 'game/config',
                name: 'gameConfig',
                component: () => import('@/views/pyq/gameConfig'),
                meta: {
                    title: '牌友圈游戏管理',
                    icon: 'box',
                    permissionId: 700400
                }
            },
            {
                path: 'activity',
                name: 'Activity',
                component: () => import('@/views/pyq/activity'),
                meta: {
                    title: '牌友圈活动管理',
                    icon: 'box',
                    permissionId: 700500
                }
            },
            {
                path: 'goods',
                name: 'Goods',
                component: () => import('@/views/pyq/goods'),
                meta: {title: '商品兑换配置',icon: 'box',permissionId: 700600},
                redirect: '/pyq/goods/item',
                children: [
                    {
                        path: 'item',
                        name: 'item',
                        component: () => import('@/views/pyq/goods/item'),
                        meta: {
                            title: '兑换道具配置',
                            icon: 'box',
                            permissionId: 700600,
                        }
                    },
                    {
                        path: 'config',
                        name: 'Config',
                        component: () => import('@/views/pyq/goods/config'),
                        meta: {
                            title: '道具兑换配置',
                            icon: 'box',
                            permissionId: 700600,
                        }
                    }
                ]
            },
            {
                path: 'userinfo',
                name: 'Userinfo',
                component: () => import('@/views/pyq/userInfo'),
                meta: {
                    title: '俱乐部账号信息',
                    icon: 'box',
                    permissionId: 700700
                }
            },
            {
                path: 'clubinfo',
                name: 'Clubinfo',
                component: () => import('@/views/pyq/clubInfo'),
                meta: {
                    title: '俱乐部信息',
                    icon: 'box',
                    permissionId: 700800
                }
            },
            {
                path: 'user/vip',
                name: 'UserVip',
                component: () => import('@/views/pyq/userVip'),
                meta: {
                    title: '个人VIP配置',
                    icon: 'box',
                    permissionId: 700900
                }
            },
            {
                path: 'xinge/push',
                name: 'XingePush',
                component: () => import('@/views/pyq/xingePush'),
                meta: {
                    title: '信鸽推送',
                    icon: 'box',
                    permissionId: 701000
                }
            },
            {
                path: 'sysmsg',
                name: 'SysMsg',
                component: () => import('@/views/pyq/sysMsg'),
                meta: {
                    title: '发送系统消息',
                    icon: 'box',
                    permissionId: 701800
                }
            },
            {
                path: 'club/vip',
                name: 'ClubVip',
                component: () => import('@/views/pyq/clubvip'),
                meta: {title: '俱乐部VIP配置',icon: 'box',permissionId: 701100
                },
                redirect: '/pyq/vip/price',
                children: [
                    {
                        path: 'privi',
                        name: 'Privi',
                        component: () => import('@/views/pyq/clubvip/privi'),
                        meta: {
                            title: '权限配置',
                            icon: 'box',
                            permissionId: 701100,
                        }
                    },
                    {
                        path: 'config',
                        name: 'Config',
                        component: () => import('@/views/pyq/clubvip/config'),
                        meta: {
                            title: '俱乐部VIP配置',
                            icon: 'box',
                            permissionId: 701100,
                        }
                    }
                ]
            },
            {
                path: 'charge',
                name: 'Charge',
                component: () => import('@/views/pyq/charge'),
                meta: {
                    title: '收费功能点',
                    icon: 'box',
                    permissionId: 701600
                }
            },


            {
                path: 'spread/bind',
                name: 'SpreadBind',
                component: () => import('@/views/pyq/spreadBind'),
                meta: {
                    title: '推广员绑定',
                    icon: 'box',
                    permissionId: 701200
                }
            },
            {
                path: 'spread/rebate',
                name: 'SpreadRebate',
                component: () => import('@/views/pyq/spreadRebate'),
                meta: {
                    title: '推广员返利',
                    icon: 'box',
                    permissionId: 701300
                }
            },
            {
                path: 'vip',
                name: 'VipPrice',
                component: () => import('@/views/pyq/vip'),
                meta: {title: 'VIP',icon: 'box',permissionId: 701400},
                redirect: '/pyq/vip/price',
                children: [
                    {
                        path: 'price',
                        name: 'Price',
                        component: () => import('@/views/pyq/vip/price'),
                        meta: {
                            title: 'VIP单价配置',
                            icon: 'box',
                            permissionId: 701400,
                        }
                    },
                    {
                        path: 'statics',
                        name: 'Statics',
                        component: () => import('@/views/pyq/vip/statics'),
                        meta: {
                            title: 'VIP数据统计',
                            icon: 'box',
                            permissionId: 701400,
                        }
                    },
                    {
                        path: 'info',
                        name: 'Info',
                        component: () => import('@/views/pyq/vip/info'),
                        meta: {
                            title: 'VIP个人数据',
                            icon: 'box',
                            permissionId: 701400,
                        }
                    },
                    {
                        path: 'record',
                        name: 'Record',
                        component: () => import('@/views/pyq/vip/record'),
                        meta: {
                            title: 'VIP个人记录',
                            icon: 'box',
                            permissionId: 701400,
                        }
                    }
                ]
            },
            {
                path: 'rebate/rate',
                name: 'Rebaterate',
                component: () => import('@/views/pyq/rebateRate'),
                meta: {
                    title: '推广员返利比例',
                    icon: 'box',
                    permissionId: 701500
                }
            },
            {
                path: 'googlepay',
                name: 'Googlepay',
                component: () => import('@/views/pyq/googlepay'),
                meta: {
                    title: 'google支付校验',
                    icon: 'box',
                    permissionId: 701700
                }
            },
            {
                path: 'withdraw',
                name: 'Withdraw',
                component: () => import('@/views/pyq/withdraw'),
                meta: {
                    title: '取现配置',
                    icon: 'box',
                    permissionId: 701900
                }
            },
            {
                path: 'upi/bank',
                name: 'upiBank',
                component: () => import('@/views/pyq/upiBank'),
                meta: {
                    title: 'upi银行列表配置',
                    icon: 'box',
                    permissionId: 702000
                }
            }
        ]
    },

    {
        path: '/hallGame',
        component: Layout,
        redirect: '/hallGame/game',
        name: 'Account',
        meta: { title: '大厅游戏管理', icon: 'operate', permissionId: 800000 },
        children: [
            {
                path: 'game',
                name: 'Game',
                component: () => import('@/views/hallGame/game'),
                meta: {
                    title: '大厅游戏管理',
                    icon: 'param',
                    permissionId: 800100
                }
            },
            {
                path: 'item',
                name: 'Item',
                component: () => import('@/views/hallGame/gameItem'),
                meta: {
                    title: '游戏道具管理',
                    icon: 'param',
                    permissionId: 800200
                }
            },
            {
                path: 'sub/game',
                name: 'SubGame',
                component: () => import('@/views/hallGame/subGame'),
                meta: {
                    title: '子游戏管理',
                    icon: 'param',
                    permissionId: 800300
                }
            }
        ]
    }
]

const createRouter = () => new Router({
    mode: 'history', // require service support hash
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
