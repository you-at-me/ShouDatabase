import axios from 'axios';

export default {
  methods: {
    async fetchData(targetPath) { // 这里改成只请求对应物种，避免一下子请求数据太多，而且也没有必要将所有物种的数据全部请求出来
      try {
        const speciePath = `${targetPath}`; // 目标请求路径即为物种路径
        const csvFiles = await axios.get(speciePath); // 获取物种文件夹下的csv文件列表
        const speciesData = [];

        // 遍历csv文件
        // console.log("csvFiles.data:", csvFiles.data);
        for (const csvFile of csvFiles.data) {
          if (!csvFile.endsWith('.csv')) continue;

          const csvPath = `${speciePath}/${csvFile}`;
          const response = await axios.get(csvPath); // 以普通的方式读取csv文件

          const rows = response.data.split('\n');
          const csvData = []; // 存储csv文件的数据，该数组里面包含每行每行的数据，每行数据以对象的形式展示

          // 切割掉第一行的第一列，将剩下的数据在这个数组里面，将每个数据的zcount_替换成空字符串，并最终用;分号连接起来，最终的结果是返回一个字符串。
          const samplesName = rows[0].split('\t').slice(1).map(value => value.replace('zcount_', '')).join(';');
          const samplesNameObject = { samplesName: samplesName }; // 构造样本名称对象

          for (let line = 1; line < rows.length; line++) {
            const row = rows[line].split('\t'); // 从第二行开始得到每一行切割之后的数组数据

            const geneId = row[0]; // 第一列作为gene_count
            const geneTpmData = row.slice(1); // 得到的是第二行及其之后每行第二列后以tab键分割的数据，并每行作为一个数组显示
            // if (geneTpmData.every(element => element === '0' || element === 0)) continue; // 当tpm在这第二列开始这一行都为数值0或者字符串0的时候，直接过滤掉(但有时可能防止用户也要查看对应没有展示数据的基因，故这里将即使没有数据也保留展示)
            const geneTpmObject = { [geneId]: geneTpmData }; // 构造基因对象

            if (geneId == '' || geneId == undefined) continue;
            const urlArr = speciePath.split("/");
            
            const filename = csvFile.replace('.csv', '').split("_");

            const lineObject = {
              specieName: urlArr[urlArr.length - 1],
              expName: filename[0],
              expDesc: filename[1],
              ...geneTpmObject,
              ...samplesNameObject,
              geneId: geneId
            };
            csvData.push(lineObject);
          }
          speciesData.push(csvData);
        }
        return await speciesData;

      } catch (error) {
        console.error(error);
      }
    }
  }

}