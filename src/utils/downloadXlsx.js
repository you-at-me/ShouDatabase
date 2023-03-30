import XLSX from 'xlsx'
export const downloadXlsx = (dataList, fileName) => {
  // 字符串转成字节流
  const stringToBuff = str => {
    const buf = new ArrayBuffer(str.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != str.length; ++i) {
      view[i] = str.charCodeAt(i) & 0xff
    }
    return buf;
  }
  // 初始化Excel表格
  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.aoa_to_sheet(dataList);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');

  // 字节流转成二进制
  const xlsxBlob = new Blob([stringToBuff(XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' }))], { type: '' })

  const a = document.createElement('a');
  a.href = URL.createObjectURL(xlsxBlob);
  a.download = fileName;
  a.click()
}
// 这里把downloadXlsx设置成默认的全局变量，为了方便使用