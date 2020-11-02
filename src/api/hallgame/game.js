import request from '@/api/request'

export default {

    /**
     * 获取游戏列表
     */
    getGameInfosPage: function (page, size,searchMain) {
        return request({
            url: '/api/game/page?page=' + page + '&size=' + size + '&isMain=' + searchMain,
            method: 'get'
        })
    },

    addGame: function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/game/add',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**
     * 删除
     * @param tolId
     */
    delGame: function (gameId) {
        return request({
            url: `/api/game/${gameId}`,
            method: 'delete'
        })
    },

    getGameItemPage: function (page, size, searchGameid) {
        return request({
            url: '/api/game/item/page?page=' + page + '&size=' + size + '&gameid=' + searchGameid,
            method: 'get'
        })
    },

    addGameItem : function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/game/item',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**
     * 道具删除
     * @param tolId
     */
    delGameItem: function (tolId) {
        return request({
            url: `/api/game/item/${tolId}`,
            method: 'delete'
        })
    },

    getMainGame: function () {
        return request({
            url: `/api/game/item/maingame`,
            method: 'get'
        })
    },

    getAllGameItems: function () {
        return request({
            url: `/api/game/item/list`,
            method: 'get'
        })
    },

    getGames : function (gameList, isGame) {
        return request({
            url: `/api/menu/get/game?gameList=`+gameList+'&isGame='+isGame,
            method: 'get'
        })
    },

    getLimitGames: function () {
        return request({
            url: '/api/menu/get/limit/gamelist',
            method: 'get'
        })
    },

    getLimitMainGames: function () {
        return request({
            url: '/api/menu/get/limitmainGame/gamelist',
            method: 'get'
        })
    },

    getChildGames :function () {
        return request({
            url: '/api/menu/get/chirldormcgame',
            method: 'get'
        })
    },

    getGameServers :function (gameid) {
        return request({
            url: '/api/config/servers?gameid='+gameid,
            method: 'get'
        })
    },



    getSubGamePage:function (page, size, searchGame, searchSubGame) {
        return request({
            url: '/api/subgame/select/allMainGameToSublist/config?page=' + page + '&rows=' + size + '&gameid='
                + searchGame + '&subgameId=' + searchSubGame,
            method: 'get'
        })
    },

    getSubGame:function () {
        return request({
            url: '/api/subgame/get/subgame',
            method: 'get'
        })
    },

    delSubGame:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/subgame/delete/mainGameToSublist',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addSubGame:function (data) {
        return new Promise((resolve, reject) => {
            request({
                url: '/api/subgame/add/mainGameToSublist/config',
                method: 'post',
                data
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getGameVersion:function(mainGameId) {
        return request({
            url: '/api/subgame/select/gameversion/config?subid='+mainGameId,
            method: 'get'
        })

    },

    getSubChannels:function (subGameId) {
        return request({
            url: '/api/subgame/select/subchannel/config?subid='+subGameId,
            method: 'get'
        })
    },





}
