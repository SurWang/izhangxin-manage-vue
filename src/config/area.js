import pcaa from 'area-data/pcaa'

function formatAreaData (areaId, parent) {
    const areaObj = pcaa[areaId]
    const areaList = parent && parent.children ? parent.children : []
    for (const key in areaObj) {
        const obj = {}
        obj.areaId = key
        obj.areaName = areaObj[key]
        if (pcaa[key]) {
            obj.children = []
            obj.children = formatAreaData(key, obj)
            return
        }
        areaList.push(obj)
    }
    return areaList
}

const areaList = formatAreaData('86')

export const AreaData = areaList
