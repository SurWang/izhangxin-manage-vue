import { Loading } from 'element-ui'
import store from '../store/index'
import moment from 'moment'

export default {
    /**
     * 公用的loading方法
     * @param text {String} loading文字
     * @returns {ElLoadingComponent}
     */
    loading: function (text = '加载中...') {
        return Loading.service({ fullscreen: true, lock: true, text: text, background: 'rgba(0, 0, 0, 0.7)' })
    },
    /**
     * 返回索引从0开始的指定长度的数组
     * @param maxLength {Number} 需要截取的数组最大长度
     * @param array {Array} 被截取的数组
     * @return {Array} 返回截取的数组
     */
    getSubArray: function (maxLength, array) {
        let tempArray = []
        if (array && array.length > maxLength) {
            for (let i = 0; i < maxLength; i++) {
                tempArray.push(array[i])
            }
        } else {
            tempArray = array
        }
        return tempArray
    },
    /**
     * 格式化时间
     * @param date Date对象
     * @param typeStr 日期格式
     * @return {string}
     */
    formatTime (date, format) {
        format = format || 'HH:mm:ss'
        return date ? moment(date).format(format) : '-'
    },

    formatDate (date, format) {
        format = format || 'YYYY-MM-DD'
        return date ? moment(date).format(format) : '-'
    },

    formatDateRange (dateRange) {
        if (dateRange instanceof Array && dateRange[0]) {
            return this.formatDate(dateRange[0]) +  (dateRange[1] ?  ' 至 ' + this.formatDate(dateRange[1]) : ' 至今')
        }
        return '-'
    },
    formatMonthRange (dateRange) {
        if (dateRange instanceof Array && dateRange[0]) {
            return this.formatDate(dateRange[0], 'YYYY-MM') +  (dateRange[1] ?  ' 至 ' + this.formatDate(dateRange[1], 'YYYY-MM') : ' 至今')
        }
        return '-'
    },

    /**
     * 格式化日期数字，当数字为1位数时在前面加上0
     * @param n
     * @return {string}
     */
    formatNumber: function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    /**
     * 过滤组织节点
     */
    filterOrganization: function (value, data, node) {
        if (!value) return true
        if (data.label && data.label.indexOf(value) !== -1) return true
        if (data.deptName && data.deptName.indexOf(value) !== -1) return true
        // if (data.email && data.email && data.email.indexOf(value) !== -1) return true
        if (data.spellName && data.spellName.indexOf(value) !== -1) return true
        if (data.initialsName && data.initialsName.indexOf(value) !== -1) return true
        // if (data.userName && data.userName.indexOf(value) !== -1) return true
        return ((value, data, node) => { // 判断传入的节点是不是选中节点的子节点
            const level = node.level
            // 如果传入的节点本身就是一级节点就不用校验了
            if (level === 1) {
                return false
            }
            // 先取当前节点的父节点
            let parentData = node.parent
            // 遍历当前节点的父节点
            let index = 0
            while (index < level - 1) {
                // 如果匹配到直接返回
                if (parentData.data.label.indexOf(value) !== -1) {
                    return true
                }
                // 否则的话再往上一层做匹配
                parentData = parentData.parent
                index++
            }
            // 没匹配到返回false
            return false
        })(value, data, node)
    },

    /**
     * 递归树节点执行方法,children & array 支持
     * @param parentNode
     * @param func
     */
    recursionNode: function (parentNode, func) {
        // 不存在直接抛出
        if (!parentNode) {
            return
        }
        // 数组
        if (Array.isArray(parentNode) && parentNode.length > 0) {
            _.forEach(parentNode, item => {
                this.recursionNode(item, func)
            })
        }
        // children
        if (parentNode.children && parentNode.children.length > 0) {
            _.forEach(parentNode.children, item => {
                this.recursionNode(item, func)
            })
        }
        // 执行
        if (typeof parentNode === 'object' && !Array.isArray(parentNode)) {
            func(parentNode)
        }
    },
    /**
     * 获取项目下的用户
     * @param callback
     * @param target
     */
    getFolderUsers: function (callback, target) {
        const _callback = callback
        const _target = target
        if (store.state.organizationUserData &&
            store.state.organizationUserData.length > 0 &&
            store.state.currentFolderUsers) {
            if (_callback && _target) {
                target.apply(callback)
            }
        } else {
            const requestList = []

            if (!store.state.currentFolderUsers) {
                requestList.push(store.dispatch('setCurrentFolderUsersAsync'))
            }
            Promise.all(requestList).then((results) => {
                if (_callback && _target) {
                    target.apply(callback)
                }
            })
        }
    },

    /**
     * 文件夹参与人列表与组织信息列表相互匹配，给文件夹用户添加属性值
     * @param folderUsers
     * @return {Array}
     */
    getFolderUserList: function (folderUsers) {
        let folderUserList = []
        // 为空返回
        if (!folderUsers || folderUsers.length === 0) {
            return folderUserList
        }
        folderUserList = folderUsers
        const organizationUsers = store.state.organizationUserData
        if (organizationUsers && organizationUsers.length > 0) {
            if (folderUserList.length > 0) {
                folderUserList = _.unionBy(folderUserList, 'openId')
                for (const tempFolderUser of folderUserList) {
                    for (const tempOrganizationUser of organizationUsers) {
                        if (tempFolderUser.openId === tempOrganizationUser.openId) {
                            tempFolderUser.deptName = tempOrganizationUser.deptName
                            tempFolderUser.email = tempOrganizationUser.email
                            tempFolderUser.spellName = tempOrganizationUser.spellName
                            tempFolderUser.initialsName = tempOrganizationUser.initialsName
                            break
                        }
                    }
                }
            }
        }
        return folderUserList
    },

    // 此处判断该对象是否为空对象
    isEmptyObj: function (obj) {
        if (typeof obj === 'object' && !(obj instanceof Array)) {
            let hasProp = false
            for (const prop in obj) {
                prop
                hasProp = true
                break
            }
            if (hasProp) {
                return false
            } else {
                return true
            }
        }
    },

    /**
     * 压缩图片
     * @param path
     * @param obj
     * @param callback
     */
    canvasDataURL: function (path, obj, callback) {
        const img = new Image()
        img.src = path
        img.onload = function () {
            const that = this
            // 默认按比例压缩
            let w = that.width
            let h = that.height
            const scale = w / h
            w = obj.width || w
            h = obj.height || (w / scale)
            let quality = 0.7 // 默认图片质量为0.7
            // 生成canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            // 创建属性节点
            const anw = document.createAttribute('width')
            anw.nodeValue = w
            const anh = document.createAttribute('height')
            anh.nodeValue = h
            canvas.setAttributeNode(anw)
            canvas.setAttributeNode(anh)
            ctx.drawImage(that, 0, 0, w, h)
            // 图像质量
            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality
            }
            // quality值越小，所绘制出的图像越模糊
            const base64 = canvas.toDataURL('image/jpeg', quality)
            // 回调函数返回base64的值
            callback(base64)
        }
    },

    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    convertBase64UrlToBlob: function (urlData) {
        const arr = urlData.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {
            type: mime
        })
    },
    /**
     * 根据身份证获取出生日期
     * @param idCard
     * @returns {string}
     */
    getBirthdayFromIdCard: function (idCard) {
        let birthday = ''
        if (idCard != null && idCard !== '') {
            if (idCard.length === 15) {
                birthday = '19' + idCard.substr(6, 6)
            } else if (idCard.length === 18) {
                birthday = idCard.substr(6, 8)
            }

            birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        }

        return birthday
    },

    autoTextarea: function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
            addEvent = function (type, callback) {
                elem.addEventListener ?
                    elem.addEventListener(type, callback, false) :
                    elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ? function (name) {
                var val = elem.currentStyle[name];

                if (name === 'height' && val.search(/px/i) !== 1) {
                    var rect = elem.getBoundingClientRect();
                    return rect.bottom - rect.top -
                        parseFloat(getStyle('paddingTop')) -
                        parseFloat(getStyle('paddingBottom')) + 'px';
                };

                return val;
            } : function (name) {
                return getComputedStyle(elem, null)[name];
            },
            minHeight = parseFloat(getStyle('height'));

        elem.style.resize = 'none';

        var change = function () {
            var scrollTop, height,
                padding = 0,
                style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            };
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    style.overflowY = 'hidden';
                };
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
            };
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    }

}
