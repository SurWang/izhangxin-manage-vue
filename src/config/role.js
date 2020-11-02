const RolePermissionConfig = [
    {
        permissionId: 100000,
        permissionName: '系统管理',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 100100,
                permissionName: '用户管理',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 100101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 100102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 100103,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 100104,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 100200,
                permissionName: '角色管理',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 100201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 100202,
                        permissionName: '新增',
                    },
                    {
                        permissionId: 100203,
                        permissionName: '修改',
                    },
                    {
                        permissionId: 100204,
                        permissionName: '删除',
                    }
                ]
            }/*,
            {
                permissionId: 100300,
                permissionName: '登录日志',
                routeName: 'loginLog',
                children: []
            }*/
        ]
    },
    {
        permissionId: 200000,
        permissionName: '应用管理',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 200100,
                permissionName: '应用创建',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 200101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 200102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 200103,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 200104,
                        permissionName: '删除'
                    },
                    {
                        permissionId: 200105,
                        permissionName: '新增子渠道'
                    }
                ]
            },
            {
                permissionId: 200200,
                permissionName: '渠道创建',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 200201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 200202,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 200203,
                        permissionName: '修改',
                    },
                    {
                        permissionId: 200204,
                        permissionName: '删除',
                    }
                ]
            },
            {
                permissionId: 200300,
                permissionName: '在线参数',
                routeName: 'onlineParams',
                children: [
                    {
                        permissionId: 200301,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 200302,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 200303,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 200304,
                        permissionName: '删除',
                    }
                ]
            },
            {
                permissionId: 200400,
                permissionName: '错误信息',
                routeName: 'errorInfo',
                children: [
                    {
                        permissionId: 200401,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 200402,
                        permissionName: '编辑'
                    },
                    {
                        permissionId: 200403,
                        permissionName: '刷新缓存'
                    }
                ]
            }
        ]
    },

    {
        permissionId: 300000,
        permissionName: '账号信息',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 300100,
                permissionName: '账号详情',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 300101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 300103,
                        permissionName: '修改',
                    },
                    {
                        permissionId: 300104,
                        permissionName: '绑定和解绑'
                    },
                    {
                        permissionId: 300105,
                        permissionName: '解封设备'
                    },

                    {
                        permissionId: 300106,
                        permissionName: '解封禁言'
                    },
                    {
                        permissionId: 300107,
                        permissionName: '解封账号'
                    },
                    {
                        permissionId: 300108,
                        permissionName: '编辑道具'
                    },
                ]
            },
            {
                permissionId: 300200,
                permissionName: '账变信息',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 300201,
                        permissionName: '查看'
                    }

                ]
            },
            {
                permissionId: 300300,
                permissionName: '新账变信息',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 300301,
                        permissionName: '查看'
                    }
                ]
            },
            {
                permissionId: 300400,
                permissionName: '修改昵称-解绑',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 300401,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 300402,
                        permissionName: '修改昵称'
                    },
                    {
                        permissionId: 300403,
                        permissionName: '转移VIP'
                    },
                    {
                        permissionId: 300404,
                        permissionName: '解绑手机'
                    },
                    {
                        permissionId: 300405,
                        permissionName: '设置手机号为掌心账号'
                    },
                    {
                        permissionId: 300406,
                        permissionName: '解除特惠码'
                    }
                ]
            },
            {
                permissionId: 300500,
                permissionName: '特惠码查询',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 300501,
                        permissionName: '查看'
                    }
                ]
            },
        ]
    },

    {
        permissionId: 400000,
        permissionName: '充值查询',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 400100,
                permissionName: '充值明细',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 400101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 400102,
                        permissionName: '补分'
                    }
                ]
            },
            {
                permissionId: 400200,
                permissionName: '支付方式',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 400201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 400202,
                        permissionName: '新增'
                    },{
                        permissionId: 400203,
                        permissionName: '删除'
                    }
                ]
            }
        ]
    },

    {
        permissionId: 500000,
        permissionName: '运营管理',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 500100,
                permissionName: '定时消息',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 500101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 500102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 500104,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 500200,
                permissionName: '掌心注册限制',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 500201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 500202,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 500203,
                        permissionName: '修改',
                    }
                ]
            },
            {
                permissionId: 500300,
                permissionName: '手机验证码查询',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 500301,
                        permissionName: '查看'
                    },
                ]
            },
            {
                permissionId: 500400,
                permissionName: '上传文件图片 ',
                routeName: 'roleManage',
                children: [
                ]
            },
            {
                permissionId: 500500,
                permissionName: '创建文件夹',
                routeName: 'roleManage',
                children: [
                ]
            },
        ]
    },

    {
        permissionId: 600000,
        permissionName: '客服管理',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 600100,
                permissionName: '新礼包管理',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 600101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 600102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 600104,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 600200,
                permissionName: '新礼包领取情况',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 600201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 600202,
                        permissionName: '删除'
                    },
                ]
            }
        ]
    },

    {
        permissionId: 700000,
        permissionName: '牌友圈系统设置',
        iconClass: 'el-icon-location',
        children: [

            {
                permissionId: 700100,
                permissionName: '商店',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 700103,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700104,
                        permissionName: '删除'
                    },
                    {
                        permissionId: 700105,
                        permissionName: '配置道具'
                    },
                ]
            },
            {
                permissionId: 700300,
                permissionName: '信鸽推送配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700301,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700302,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 700303,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700305,
                        permissionName: '关闭推送'
                    },

                ]
            },
            {
                permissionId: 700400,
                permissionName: '牌友圈游戏管理',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700401,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700402,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 700403,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700404,
                        permissionName: '删除'
                    }
                ]
            },
            {
                permissionId: 700500,
                permissionName: '牌友圈活动管理',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700501,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700502,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 700503,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700504,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 700600,
                permissionName: '商品兑换配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700601,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700602,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 700603,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700604,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 700700,
                permissionName: '俱乐部账号信息',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700701,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700702,
                        permissionName: '修改'
                    },
                ]
            },
            {
                permissionId: 700800,
                permissionName: '俱乐部信息',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700801,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700802,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700803,
                        permissionName: '封禁解禁'
                    },
                ]
            },
            {
                permissionId: 700900,
                permissionName: '个人VIP配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 700901,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 700902,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 700903,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 700904,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 701000,
                permissionName: '信鸽推送',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701001,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701002,
                        permissionName: '新增'
                    }
                ]
            },

            {
                permissionId: 701800,
                permissionName: '发送系统消息',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701801,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701802,
                        permissionName: '新增'
                    }
                ]
            },

            {
                permissionId: 701100,
                permissionName: '俱乐部VIP配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 701103,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 701104,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 701600,
                permissionName: '收费功能点',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701601,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701602,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 701603,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 701604,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 701200,
                permissionName: '推广员绑定',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701202,
                        permissionName: '解除绑定'
                    },
                ]
            },
            {
                permissionId: 701300,
                permissionName: '推广员返利',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701301,
                        permissionName: '查看'
                    },
                ]
            },
            {
                permissionId: 701400,
                permissionName: 'VIP配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701401,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701402,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 701403,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 701404,
                        permissionName: '刷新玩家数据'
                    },
                ]
            },
            {
                permissionId: 701500,
                permissionName: '推广员返利比例',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701501,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701502,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 701503,
                        permissionName: '修改'
                    },
                ]
            },
            {
                permissionId: 701700,
                permissionName: '谷歌支付校验',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701701,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701702,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 701703,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 701704,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 701900,
                permissionName: '取现配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 701901,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 701902,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 701903,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 701904,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 702000,
                permissionName: 'UPI银行配置',
                routeName: 'userManage',
                children: [
                    {
                        permissionId: 702001,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 702002,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 702003,
                        permissionName: '修改'
                    },
                    {
                        permissionId: 702004,
                        permissionName: '删除'
                    },
                ]
            }
        ]
    },

    {
        permissionId: 800000,
        permissionName: '大厅游戏管理',
        iconClass: 'el-icon-location',
        children: [
            {
                permissionId: 800100,
                permissionName: '大厅游戏管理',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 800101,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 800102,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 800103,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 800200,
                permissionName: '游戏道具管理',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 800201,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 800202,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 800203,
                        permissionName: '删除'
                    },
                ]
            },
            {
                permissionId: 800300,
                permissionName: '子游戏管理',
                routeName: 'roleManage',
                children: [
                    {
                        permissionId: 800301,
                        permissionName: '查看'
                    },
                    {
                        permissionId: 800302,
                        permissionName: '新增'
                    },
                    {
                        permissionId: 800303,
                        permissionName: '删除'
                    },
                ]
            }
        ]
    },

]

export {
    RolePermissionConfig
}
