// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
// import htmlToPdf from './htmlToPdf'
export default function htmlToPdf (dom, options) {
    return new Promise((resolve, reject) => {
        html2Canvas(dom, options).then((canvas) => {
            const contentWidth = canvas.width / 2
            const contentHeight = canvas.height / 2

            const pageData = canvas.toDataURL('image/jpeg', 1.0)
            const pdf = new JsPDF('landscape', 'px', [contentWidth, contentHeight])

            // 放大会清晰一点
            pdf.internal.scaleFactor = 1.33
            // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            // 当内容未超过pdf一页显示的范围，无需分页
            pdf.addImage(pageData, 'JPEG', 20, 0, contentWidth / 1.35, contentHeight / 1.35)

            pdf.save('组织架构图.pdf')
            resolve()
        }, error => {
            reject(error)
        }).catch(error => {
            reject(error)
        })
    })
}

