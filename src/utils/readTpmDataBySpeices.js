import axios from 'axios';

export default {
  methods: {
    async fetchData(targetPath) { // 这里是获取的所有物种的数据，并将数据都封装到data里并将结果返回
      try {
        const specieFolders = await axios.get(targetPath); // 获取目标路径下的物种文件夹列表
        const result = {};
        // 封装进物种名称数据
        result["species"] = specieFolders.data;
        // 装物种数据
        result.data = {};

        // 遍历物种文件夹
        // console.log("specieFolders:", specieFolders);
        for (const specieFolder of specieFolders.data) {
          const speciePath = `${targetPath}/${specieFolder}`;
          const isPath = /[\\/]/.test(speciePath);
          if (!isPath) {
            console.log("no pathdir:", speciePath);
            continue;
          }
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

            const samplesName = rows[0].split('\t').slice(1).map(value => value.replace('zcount_', '')).join(';');
            const samplesNameObject = { samplesName: samplesName }; // 构造样本名称对象

            for (let line = 1; line < rows.length; line++) {
              const row = rows[line].split('\t'); // 从第二行开始得到每一行切割之后的数组数据

              const geneId = row[0]; // 第一列作为gene_count
              const geneTpmData = row.slice(1); // 得到的是第二行及其之后每行第二列后以tab键分割的数据，并每行作为一个数组显示
              const geneTpmObject = { [geneId]: geneTpmData }; // 构造基因对象

              if (geneId == '' || geneId == undefined) continue;

              const lineObject = {
                specieName: specieFolder,
                expName: csvFile.replace('.csv', ''),
                ...geneTpmObject,
                ...samplesNameObject,
                geneId: geneId
              };

              csvData.push(lineObject);
            }
            speciesData.push(csvData);
          }
          // const speicesObject = { [specieFolder]: speciesData }
          // result.push(speicesObject);

          result.data[specieFolder] = speciesData; // data为对象，改为对象的形式可以通过下标的方式直接获取
          // result.data.push(speciesData); // 将data数据由对象改为数组，不过这样外部不好拿取数据
        }
        return await result;

      } catch (error) {
        console.error(error);
      }
    }
  }

}