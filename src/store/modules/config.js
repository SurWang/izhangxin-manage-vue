import config from '@/api/config'

const state = {
    columnConfig: []
}

const mutations = {
    SET_COLUMN_CONFIG: (state, columnConfig) => {
        state.columnConfig = columnConfig
    }
}

const actions = {
    getColumnConfig ({ commit, getters }) {
        return new Promise((resolve, reject) => {
            if (state.columnConfig.length > 0 && state.columnConfig.length > 0) {
                resolve()
                return
            }
            // 没有数据设值一次
            config.getColumnConfig().then(result => {
                const columnConfig = result.data
                if (columnConfig && columnConfig.length) {
                    commit('SET_COLUMN_CONFIG', columnConfig)
                }
                resolve()
            }, result => {
                reject(result)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
