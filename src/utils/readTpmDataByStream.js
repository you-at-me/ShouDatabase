import axios from 'axios';
// import stream from 'stream-browserify';

async function readCSVFiles(targetPath) {
  const resultArray = [];

  try {
    const folderListResponse = await axios.get(targetPath);
    const folderList = folderListResponse.data;

    console.log(folderList);

    for (const folderName of folderList) {
      const folderPath = `${targetPath}/${folderName}`;
      const fileListResponse = await axios.get(folderPath);
      const fileList = fileListResponse.data;
      const csvDataArray = [];

      console.log(fileList);

      for (const fileName of fileList) {
        if (fileName.endsWith('.csv')) {
          const fileUrl = `${folderPath}/${fileName}`;
          const fileResponse = await axios.get(fileUrl, { responseType: "stream" });

          console.log(fileResponse.data);
          const csvData = await parseStream(fileResponse.data);

          csvDataArray.push(csvData);
        }
      }

      const folderObject = {
        species_name: folderName,
        files: csvDataArray,
      };

      resultArray.push(folderObject);
    }
  } catch (err) {
    console.error(err);
  }

  return resultArray;
}

async function parseStream(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const lines = buffer.toString().split('\n');

      const csvObject = {};
      const header = lines[0].split('\t').slice(1);

      for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split('\t');
        const geneCount = fields[0];
        const values = fields.slice(1);

        csvObject[geneCount] = values;
      }

      // const sampleNameHeader = header[0].replace('zcount_', '');
      const sampleNames = header.slice(1).join(',');

      csvObject.sample_name = sampleNames;
      csvObject.species_name = '';

      resolve(csvObject);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Example usage
// const targetPath = '/data/tpm'; // Replace with the actual URL
// readCSVFiles(targetPath)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

export default readCSVFiles