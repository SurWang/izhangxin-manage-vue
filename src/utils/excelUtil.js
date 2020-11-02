import _ from 'lodash'
import XLSX from 'xlsx'


function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    let workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    let opt = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    let workbookOut = XLSX.write(workbook, opt);
    let blob = new Blob([s2ab(workbookOut)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

function download(url, saveName)
{
    if(typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    let aLink = document.createElement('a'),
        event
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    if(window.MouseEvent) {
        event = new MouseEvent('click')
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}


export default {
    // example
    // optionHeader  [{
    //  label: ''
    //  field: ''
    // }]
    // fileName: ''

    easyExport (data, option) {
        if (!option.header) {
            console.warn('必须传入option.header')
            return
        }
        if (!Array.isArray(option.header) ) {
            console.warn('option.header必须是数组')
            return
        }
        // 记录了对应关系,方面后面转换的时候用
        const headerLabelMap = {},
            // 给生成sheet时候用的数组
            sheetHeader = []

        option.header.forEach(item => {
            headerLabelMap[item.field] = item.label
            sheetHeader.push(item.field)
        })
        const sheet = XLSX.utils.json_to_sheet(data, {header: sheetHeader});

        for (let i = 0; i < option.header.length; i++) {
            // 目前所有header暂定row为1的
            const headerKey = String.fromCharCode(65 + i) + '1'
            // 转义
            const label = headerLabelMap[sheet[headerKey].v]
            sheet[headerKey].v = label
        }
        download(sheet2blob(sheet), option.fileName || 'export.xlsx')
    },
    arrayExport (data, option = {}) {
        if (!Array.isArray(data) ) {
            console.warn('data必须是数组')
            return
        }
        const sheet = XLSX.utils.aoa_to_sheet(data)
        download(sheet2blob(sheet), option.fileName || 'export.xlsx')
    }
}
