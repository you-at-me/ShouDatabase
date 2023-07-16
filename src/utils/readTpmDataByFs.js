const fs = require('fs');
const readline = require('readline');

// 传入目标路径
export function handleTpmData(targetPath) {
  const speciesFolders = fs.readdirSync(targetPath);

  const allDataArray = [];

  for (const folder of speciesFolders) {
    // 得到物种文件路径
    const folderPath = `${targetPath}/${folder}`;
    if (!fs.statSync(folderPath).isDirectory()) continue;

    // 得到物种文件路径下所有以csv结尾的文件
    const csvFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.csv'));

    // 单个物种的数据
    const speciesDataArray = [];

    for (const file of csvFiles) {
      const filePath = `${folderPath}/${file}`;

      // 每个样本的对象
      const o = {
        // 每个基因在多个样本对应下的count数据
        geneCounts: [],
        // geneId: [],
        // 物种名称。folder即为物种名称
        speice_name: folder
      };

      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream });

      let lineNumber = 0;
      // 处理一个样本的csv
      rl.on('line', line => {
        lineNumber++;

        // 处理第一行
        if (lineNumber === 1) {
          const headers = line.split('\t').slice(1); // 截取掉第一行第一列的"gene"这个值，得到剩下的数组数据
          o.sampleName = headers.map(header => header.replace('zcount_', ''));
        } else { // 从第二行开始处理数据
          const columns = line.split('\t');
          const geneId = columns[0];
          // 得到的是第二行及其之后每行第二列后以tab键分割的数据，并每行作为一个数组显示
          const geneTpmData = columns.slice(1);

          o.geneCounts.push({ [geneId]: geneTpmData });
        }
      });

      rl.on('close', () => {
        speciesDataArray.push(o);
      });
    }

    allDataArray.push(speciesDataArray);
  }

  return allDataArray;
}
