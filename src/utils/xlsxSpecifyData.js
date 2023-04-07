import XLSX from 'xlsx';
import axios from 'axios';

export function getXlsxSpecifyData(THIS, url) { // 在原生js当中无法将一个axios的返回值赋给外界的变量，现使用vue
  const _this = THIS;
  axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
    const data = new Uint8Array(res.data);
    let wb = XLSX.read(data, { type: 'array' });
    const getDatas = [];
    for (let key in wb.Sheets) {
      getDatas.push(XLSX.utils.sheet_to_json(wb.Sheets[key]));
    }
    // 得到的数据不能直接塞到数组当中，否则在外面将取不出来；只能遍历数据，或者直接拿到对象里面的数据
    const targetData = getDatas[1].filter((_, index) => {
      return index !== 0;
    })
    _this.o = {...targetData[_this.flag]}

  }, err => console.log(err)).catch(err => console.log(err))
}