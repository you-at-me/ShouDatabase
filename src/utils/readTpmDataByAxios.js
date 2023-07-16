import axios from 'axios';
import stream from 'stream-browserify';
import Buffer from 'buffer'
// import readline from 'readline';

window.Buffer = Buffer;

export default {
  methods: {
    async fetchData(targetPath) {
      try {
        const specieFolders = await axios.get(targetPath); // 获取目标路径下的物种文件夹列表
        const result = [];

        // 遍历物种文件夹
        console.log("specieFolders:", specieFolders);
        for (const specieFolder of specieFolders.data) {
          const speciePath = `${targetPath}/${specieFolder}`;
          const csvFiles = await axios.get(speciePath); // 获取物种文件夹下的csv文件列表

          const speciesData = [];

          // 遍历csv文件
          console.log("csvFiles.data:", csvFiles.data);
          for (const csvFile of csvFiles.data) {
            const csvPath = `${speciePath}/${csvFile}`;
            const response = await axios.get(csvPath, { responseType: stream }); // 以流的方式读取csv文件

            const dataArray = []; // 存储csv文件的数据

            let lineCount = 0;
            const headers = [];

            console.log("response.data: ", response.data);

            console.log("res: ", response.data.split("\n"));
            // const stream = readline.createInterface({
            //   input: response.data, // 将 Axios 响应的数据作为输入流
            //   crlfDelay: Infinity // 保留制表符作为分隔符
            // });

            response.data
              .pipe(require('csv-parse')({ delimiter: '\t' })) // 使用csv-parse库解析以tab键分割的csv数据
              .on('data', row => {
                if (lineCount === 0) {
                  headers.push(...row.slice(1).map(column => column.replace('zcount_', ''))); // 获取第一行的数据，截取掉前头的zcount_
                } else if (lineCount === 1) {
                  console.log(111);
                  const geneCount = row[0]; // 第一列作为gene_count
                  const geneData = row.slice(1).map(value => value.split(','));
                  const geneObject = { [geneCount]: geneData }; // 构造基因对象

                  speciesData.push(geneObject);

                  const sampleNames = row.slice(1).map(value => value.replace('zcount_', '')); // 获取第二列开始的样本名称
                  const sampleNameObject = { sample_name: sampleNames }; // 构造样本名称对象

                  speciesData.push(sampleNameObject);
                } else {
                  const rowData = {};
                  headers.forEach((header, index) => {
                    rowData[header] = row[index + 1];
                  });
                  dataArray.push(rowData);
                }

                lineCount++;
              })
              .on('end', () => {
                const csvObject = { data: dataArray, speice_name: specieFolder }; // 构造csv对象
                speciesData.push(csvObject);
              });
          }

          result.push(speciesData);
        }

        console.log(result);
        return result;

      } catch (error) {
        console.error(error);
      }
    }
  }

}