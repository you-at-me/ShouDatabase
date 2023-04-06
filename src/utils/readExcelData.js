import XLSX from 'xlsx';
import axios from 'axios';

function transformSheets(sheets) {
  const content = [];
  const tmplist = [];
  for (let key in sheets) {
    tmplist.push(XLSX.utils.sheet_to_json(sheets[key]).length);
    content.push(XLSX.utils.sheet_to_json(sheets[key]));
  }
  console.log(tmplist); // 输出每个表格具有的总行数，文件当中有几个表格就会输出几个数
  // 输出是嵌套数组，文件当中的每个表格以数组的方式嵌套在外层数组里，并表格当中有几行数据就会把对应表格的每行数据都附在数组当中，并可以通过获取数组的长度来获取表格当中总共有几条数据。
  console.log(content);
  return content;
}

// 读取本地xlsx表格当中的数据，通过axios调用得到，因为xlsx是后端访问的，所以需要用aixos请求去得到获取数据，文件需要放在public目录
export default function readExcelData(url) { // url的路径直接写'/xxx.xlsx'即可
  axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
    const data = new Uint8Array(res.data);
    let wb = XLSX.read(data, { type: 'array' });
    transformSheets(wb.Sheets); // 在原生js当中无法将一个axios的返回值赋给外界的变量
  }, err => console.log(err)).catch(err => console.log(err))
}