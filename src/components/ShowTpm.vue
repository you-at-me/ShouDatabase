<template>
  <div class="show-tpm">
    <div style="text-align: left;">
      <p style="color: #2190bd; font-size: 13px; font-weight: bold;">Tpm Matrix</p>
      <div class="line"></div>
      <p class="tpm_text">This module shows the use of genome fna files, gene annotation ftp files, and sequencing R1 , R2
        files corresponding to multiple samples to analyze and obtain tpm matrix data, so as to better prepare the premise
        for subsequent gene data analysis. So a box plot is drawn here to show the data values of the tpm matrix of each
        species module. Chart showing the use of box plots with outliers. The chart makes use of a plot line to show the
        theoretical mean value across the y-axis.</p>
    </div>

    <div class="table_outer">
      <div class="table_inner">

        <!-- vue当中就使用这个组件来表示了，取消标签的写法，并且增加了有关vue能够识别的标签，详情看查看官网：https://www.hcharts.cn/docs/highcharts-vue/；constructor-type表示	图表构造函数类型，用于初始化特定图表。允许的参数选项：'chart', 'stockChart', 'mapChart'。chart即为为默认值。-->
        <div class="box_plots">
          <highcharts :constructor-type="'chart'" :options="tpmOptions" style="cursor: pointer;"></highcharts>
          <!-- <highcharts :options="tpmOptions"></highcharts> -->
        </div>

        <!-- <figure class="highcharts-figure">
          <div id="container"></div>
          <p class="highcharts-description">
            Chart showing the use of box plots with outliers. The chart makes use
            of a plot line to show the theoretical mean value across the y-axis.
          </p>
        </figure> -->

        <div class="func_points">
          <el-select v-model="speciesSearchOptionValue" size="mini" placeholder="Specie Name" class="table_select">
            <el-option v-for="item in speciesOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-input v-model="tableFilter" size="mini" clearable placeholder="input gene id keywords to filter"
            class="table_filter" />
          <el-button class="tick_download" size="mini" icon="el-icon-download" @click="tickDownload"
            plain>TickDownload</el-button>
          <el-button class="download_all" size="mini" icon="el-icon-download" @click="downloadAll"
            plain>DownloadAll</el-button>
        </div>

        <el-table ref="multipleTable" :border="isBorder"
          :data="pageFilterTableData.filter(data => !tableFilter || data.geneId.toLowerCase().includes(tableFilter.toLowerCase()))"
          tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <!-- prop属性的属性值表示自动会去寻找表格数据中带有其属性值的值，并赋值给当前单元格，当然如果你不指定prop属性值，也可以通过template标签的slot-scope插槽将数据渲染到对应的单元格当中，label表示的是列头的名，然后就是固定写法: scope.row.xxx;xxx 就是对应数据源当中的字段; show-overflow-tooltip表示当单元格的数据过长无法全部显示的时候将会弹出对应的tip进行显示 -->
          <el-table-column label="Specie" width="160">
            <template slot-scope="scope">{{ scope.row.specieName }}</template>
          </el-table-column>
          <el-table-column label="ExperimentName" prop="expName">
          </el-table-column>
          <!-- <el-table-column label="ExperimentDescription" prop="expDesc" width="300" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column label="SequenceSamples" prop="samplesName" width="500" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="GeneID" width="150">
            <template slot-scope="scope"><span style="color: #5390bd;" @click="clickShowGeneTpmView(scope.row.geneId)">{{
              scope.row.geneId }}</span></template>
          </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length" style="margin-top: 30px;">
        </el-pagination>

      </div>
    </div>

  </div>
</template>

<script>
/* 正常传统的 js 编程，需要通过 script src 引入下述五个文件，其中前两个是必须引入的，而其他的是次要的 */
// https://code.highcharts.com/highcharts.js
// https://code.highcharts.com/highcharts-more.js
// https://code.highcharts.com/modules/exporting.js
// https://code.highcharts.com/modules/export-data.js
// https://code.highcharts.com/modules/accessibility.js

/* 引入必要的模块和样式表 */
// 这是 highcharts 的主要模块，对应 highcharts.js 文件
import Highcharts from 'highcharts'
// 这是 highcharts 的扩展模块，对应 highcharts-more.js 文件
import highchartsMore from 'highcharts/highcharts-more'
// 这是 highcharts 官方供给 vue 使用的自定义组件
import { Chart } from 'highcharts-vue'
// 这是 highcharts 官方提供的导出模块，对应 exporting.js 可以实现将图片导出等功能。
import exportingInit from 'highcharts/modules/exporting'
// 这也是官方提供的导出模块，只不过可以导出对应的数据，比如将数据导出到excel表格当中
import exportingDataInit from 'highcharts/modules/export-data'
// 这个是一些额外的配置模块
import accessibilityInit from 'highcharts/modules/accessibility'
// import stockInit from 'highcharts/modules/stock'
import { Select, Option, Button, Table, TableColumn, Pagination, Input, Message } from "element-ui";
// import handleTpm from '@/utils/readTpmDataByAxios.js'
// import readCSVFiles from '@/utils/readTpmDataByStream.js'
import handleTpm from '@/utils/readTpmData.js'


/* 注册所需模板并自定义主题颜色等配置信息。要使用任何 Highcharts 模块，必须将该模块以及 Highcharts 扩展包本身都导入项目中 */
// 使用 highcharts-more 扩展包，对应 highcharts 当中的 highcharts-more.js 这个文件
highchartsMore(Highcharts)

// 使用 highcharts 官方提供的导出模块以及导出数据的模块，主要用来增加下载功能和导出数据的功能的。
exportingInit(Highcharts)
exportingDataInit(Highcharts)
// 注入使用一些额外配置的模块
accessibilityInit(Highcharts)

// 如果需要使用 stockChart 或 mapChart ，只需要按照上面导入 Highcharts 模块的方法引入 stock 或 map 对应的模块，然后再这里面进行注入，并在组件元素中使用 :constructor-type 参数：设置其属性值为 'stockChart', 或者 'mapChart'即可；具体如上标签操作。
// stockInit(Highcharts) 

export default {
  name: 'ShowTpm',
  components: {
    // 局部注册 highcharts, 利用 highcharts-vue 当中的 Chart 组件，供给 vue 使用的组件
    "highcharts": Chart,
    "el-select": Select,
    "el-option": Option,
    "el-button": Button,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-pagination": Pagination,
    "el-input": Input
  },
  data() {
    return {
      speciesSearchOptionValue: 'nile_tilapia',
      speciesOptions: ['nile_tilapia', 'zebrafish'],
      pageFilterTableData: [],
      multipleSelection: [],
      currentTpmArrayData: [],
      tableData: [],
      tableFilter: "",
      isBorder: true,
      currentPage: 1,
      pageSize: 10,
      tpmOptions: {
        // 图表类型
        chart: {
          type: 'boxplot'
        },
        // 图表的标题
        title: {
          text: 'HighCharts BoxPlot Exhibit'
        },
        // 去除右下角图片当中的水印，false即表示取消，true表示显示
        credits: {
          enabled: false
        },
        // 取消图中右上角的导出按钮，false即表示取消，默认true表示可以导出
        exporting: { enabled: true },
        // 去除评估，加快响应速度
        accessibility: { enabled: false },
        // Legend是HighCharts图表的图例属性，默认情况下，HighCharts都会有图例，无特殊情况，默认即可满足需求，所以一般不用配置Legend属性。
        legend: {
          enabled: false
        },
        // x轴图表底部配置
        xAxis: {
          // x轴横轴图表底部目录
          categories: ['1', '2', '3', '4', '5'],
          // x轴横轴图表底部标题
          title: {
            text: 'Experiment Name'
          }
        },
        // y轴图表配置。y轴数轴上的数据会根据下属data数组的数据自适应调整的
        yAxis: {
          // y轴标题
          title: {
            text: 'Tpm Observations Value'
          },
          // y轴横分割线一些样式及数据配置
          plotLines: [{
            value: 932,
            color: 'red',
            width: 1,
            label: {
              // Theoretical reference value
              text: 'Theoretical mean: 932',
              align: 'center',
              // 横线样式text文本颜色
              style: {
                color: 'gray'
              }
            }
          }]
        },
        // 鼠标放在图上显示的数据
        series: [
          {
            // 每一纵列的名称
            name: 'Tpm Observations Value',
            // data对应每一列的数据,每一个数组对应一列数据，包括最大值，高水平值，中间值，低水平值，最小值等。并且对应的数据也对应图中显示的线条。
            data: [
              // 这里面要求的数据必须得长度是一样的。而且分别对应的是最小值、下四分位数、中位数、上四分位数、最大值
              // [660, 801, 848, 895, 965],
              // [733, 853, 939, 980, 1000],
              // [714, 762, 817, 870, 918],
              // [724, 802, 806, 871, 950],
              // [804, 836, 864, 882, 910]
              [1.32783485878884, 6.7662419302174, 24.557228820844, 30.0584756394673, 33.7832656251513],
              [3.93173216414058, 11.67780334382465, 19.6275795173684, 39.35028642760625, 50.5814801039091],
              [6.83502466756266, 15.048016975650551, 32.7108490938765, 48.14966338682615, 53.8744264219858],
              [0, 19.801529310253, 25.2656466878068, 37.3939649011749, 44.4792750055997],
            ],
            tooltip: {
              // 每列鼠标hover之后最头部的数据显示
              headerFormat: '<em>Experiment Name: {point.key}</em><br/>'
            }
          }, {
            // 每列小圆点数据的显示: Outliers
            name: 'specific value',
            color: Highcharts.getOptions().colors[0],
            type: 'scatter',
            data: [ // x, y positions where 0 is the first category
              // [0, 744],
              // [0, 644],
              // [0.15, 644],
              // [4, 718],
              // [4, 951],
              // [4, 969]

              [0, 27.44],
              [-0.1, 26.44],
              [0, 26.44],
              [0, 15.44],
              [0, 36.44],
              [0, 56.44],
              [0.05, 46.44],
              [0.05, 32.44],
              [0.1, 33.44],
              [0.25, 16.44],
              [1, 36.44],
              [1, 26.54],
              [1.1, 5.74],
              [2, 7.18],
              [3, 9.51],
              [3, 9.69]
            ],
            marker: {
              fillColor: 'white', // 更改小点的颜色
              lineWidth: 0.5, // 更改小点的大小宽度
              lineColor: Highcharts.getOptions().colors[0]
            },
            tooltip: {
              // 鼠标放到小圆点的数据显示
              pointFormat: 'Tpm Observation Value: {point.y}'
            }
          }
        ]
      }

    }
  },
  props: {
    msg: String
  },
  mounted() {
    this.loadTableData();
  },
  watch: {
    // 监控物种单选框中值的变化，一旦改变就发出对应物种数据的请求
    speciesSearchOptionValue(newValue, oldValue) {
      console.log('speciesSearchOptionValue被修改了', "new:" + newValue, "old:" + oldValue)
      this.loadTableData();
    },
  },
  methods: {
    // axios请求数据可改进的点：1.没有必要将全部数据全部加载装进数据里面，然后只展示具体页面的数据，在首次加载时有点卡曼，特别是当存在特别多的csv文件的时候，这有点影响性能，因为一次性将所有数据加载到数据，虽然可以保证分页快速拿到对应数据，但是如果用户频繁刷新页面，会造成响应慢。同时在点击查询某个基因具体展示图的时候，照样需要扫描整个数组的对象数据，拿取到所有csv对应的基因tpm数据比较慢。2.如果改成请求对应页的数据，虽然可以比较快速的响应，但同时增加的编码难度，因为要考虑截取对应页面大小的数据，需要将当前页、页面大小作为参数传递进去，同时在每次分页切换时，都需要进行axios请求，将数据渲染出来，增加了多次请求，且如果是深度分页，则照样要扫描对应的数据，同时还需要考虑总条数据，照样还要扫描整张csv表格。不过性能绝佳点在于可以快速扫描对应多个csv的某条指定的基因要展示的tpm数据箱线图，因为分页的数据很少，即使存在多个csv文件。
    loadTableData() {
      let speiceRequestUrl = "/data/tpm/" + this.speciesSearchOptionValue;
      handleTpm.methods.fetchData(speiceRequestUrl).then(res => {

        // console.log("res:", res); // 从文件当中读取到并封装的结果
        // const currentSpeice = this.speciesSearchOptionValue; // 这里是所有物种列表当中获取，现改成直接从对应物种当中直接获取。
        // const currentSpeiceData = res.data[currentSpeice]; // 对象的获取还可以通过下标获取。

        // console.log(currentSpeiceData); // 这个拿到的是当前物种的数据，是一个数组，包含多个小数组，这每个小数组对应的就是一个模块文件夹测序对比的数据，也就对应一个csv测序生成的tpm文件数据，每个小数组里面包含着上万个对象，这些对象就是每个tpm文件的每行数据产生的。
        // const o = [];
        // for (let item of currentSpeiceData) {
        //   o.push({ ...item });
        // }
        // console.log(o);
        // this.tableData = o.reduce((acc, item) => acc.concat(item.smallObjects), []);

        this.tableData = res.flatMap((arr) => arr); // res数据即为单个指定物种的数据

        console.log(res[this.getRandomInt(0, res.length - 1)]); // 随机获取其中一个文件夹的，也就是里面对应一个csv的tpm数据
        // console.log("this.tableData: ", this.tableData);

        // 首次刷新页面，刷新出当前页要展示的数据，将将其数据放入pageFilterTableData数组当中，不过得等到csv数据读取到了之后
        this.pageRenderingTableData();
        // console.log("current page data:", this.pageFilterTableData);

        // 初始化随机指定展示一个tpm的箱线图值，得等待csv数据读取到了页面数据加载完毕之后才能去加载展示
        // this.clickShowGeneTpmView("adsl_1"); // zmp:0000000735_1

      }).catch(err => console.log(err));
    },
    // 生成一个指定范围的随机整数函数
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /* 表格方法操作 */
    tickDownload() {
      if (this.multipleSelection.length === 0) {
        Message({
          showClose: true,
          message: 'Please tick the data to be downloaded',
          type: 'warning'
        });
        return;
      }
      // 封装我们需要导出的数据信息
      let downloadDataList = [];
      // 这里处理的是Excel的表头，必须放在数据结构的第一个位置
      downloadDataList.unshift(["specieName", "expName", "samplesName", "geneId"])
      this.multipleSelection.forEach((item, index) => {
        downloadDataList.push([index + 1, item.specieName, item.expName, item.samplesName, item.geneId]);
      });
      // 下载的js逻辑已经封装到了vue当中了，这里可以直接调用vue当中的实例，第一个参数即传入的数组数据，数组当中包含多个对象信息，第二个是导出下载的文件名称，可根据实际传入即可。
      this.downloadXlsx(downloadDataList, this.speciesSearchOptionValue + "_tickedData.xlsx");
    },
    downloadAll() {
      let downloadDataList = [];
      downloadDataList.unshift(["specieName", "expName", "samplesName", "geneId"])
      this.tableData.forEach((item, index) => {
        downloadDataList.push([index + 1, item.specieName, item.expName, item.samplesName, item.geneId]);
      });
      this.downloadXlsx(downloadDataList, this.speciesSearchOptionValue + "_allData.xlsx");
    },
    // 刷新当前页数据
    pageRenderingTableData() {
      if (this.currentPage == Math.ceil(this.tableData.length / this.pageSize)) {
        console.log("the last page");
        this.pageFilterTableData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.tableData.length)
      }
      this.pageFilterTableData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    // 点击展示某个具体基因的tpm数据
    clickShowGeneTpmView(geneId) {
      // console.log(geneId); // 当前点击的基因ID名称
      // 获取当前点击的那个基因的所有数组对象，返回一个包含多个对象的数组，有几个csv读取的文件就包含几个对象在数组里面。这里面过滤的是整个数组的数据，看日后有什么优化高效的方法。目前其实也挺快。
      this.currentTpmArrayData = this.tableData.filter(o => o[geneId]);
      // console.log(this.currentTpmArrayData); // 当前点击展示的所有关于该基因的对象数据，并封装在一个vue数据层的数组里面
      this.mapTpmData(geneId);
    },
    mapTpmData(geneId) {
      // 重新给文本标题赋值，并把第一个基因名称的字母大小; 或者直接通过 str.charAt(0).toUpperCase() + str.slice(1);
      const [firstLetter, ...rest] = geneId;
      const capitalizedStr = firstLetter.toUpperCase() + rest.join('');
      this.tpmOptions["title"]["text"] = capitalizedStr + ' Gene BoxPlot Exhibit';

      // 更改横轴轴上的坐标数据及相关标题
      this.tpmOptions["xAxis"]["categories"] = this.currentTpmArrayData.map(currentSingleGeneObj => currentSingleGeneObj.expName);

      // 更改重点：图上的箱线图的一些线条展示
      this.tpmOptions["series"][0]["data"] = this.currentTpmArrayData.map(currentSingleGeneObj => {
        const numbers = currentSingleGeneObj[geneId];
        const minValue = Math.min(...numbers); // 最小值
        const sortedNumbers = numbers.sort((a, b) => a - b); // 升序排序
        const lowerQuartile = this.quartile(sortedNumbers, 0.25); // 下四分位数
        const median = this.quartile(sortedNumbers, 0.5); // 中位数
        const upperQuartile = this.quartile(sortedNumbers, 0.75); // 上四分位数
        const maxValue = Math.max(...numbers); // 最大值
        const result = [minValue, lowerQuartile, median, upperQuartile, maxValue]; // 将结果整合到一个新数组
        console.log(result);
        return result;
      });

      let n = 0;
      const mapArrData = this.currentTpmArrayData.map(currentSingleGeneObj => {
        // console.log(currentSingleGeneObj);
        const currentGeneTpmData = currentSingleGeneObj[geneId];
        // console.log(currentGeneTpmData);
        const res = [];
        currentGeneTpmData.forEach(tpm => {
          const randomValue = Math.random() * 0.5 + n - 0.25; // 在指定的n这个数字上下浮动0.25范围内随机生成一个数字。
          const randomVal = randomValue.toFixed(2); // 截取小数点后两位。保留两位小数。
          res.push([parseFloat(randomVal), parseFloat(tpm)]); // 需要将得到的字符串解析成数值型才能响应显示。
        })
        n++;
        console.log(res);
        return res;
      })
      // console.log(mapArrData);
      this.tpmOptions["series"][1]["data"] = mapArrData.flatMap(arr => arr); // 去除中间括号
      // console.log(this.tpmOptions["series"][1]["data"]);

      console.log(this.tpmOptions);
    },
    // 计算指定百分位数的函数
    quartile(sortedArray, percentile) {
      const index = (sortedArray.length - 1) * percentile;
      const floor = Math.floor(index);
      const ceil = Math.ceil(index);
      if (floor === ceil) {
        return sortedArray[floor];
      }
      const lowerValue = sortedArray[floor] * (ceil - index);
      const upperValue = sortedArray[ceil] * (index - floor);
      return lowerValue + upperValue;
    },
    // 分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.pageRenderingTableData();
      console.log("pageSizeChange data:", this.pageFilterTableData);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.pageRenderingTableData();
      console.log("currentPageChange data:", this.pageFilterTableData);
    },
    // 得到表格当中勾选的所有数据，将数据传递给数据层，这部分数据可供下载
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("the choosed:", this.multipleSelection);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.show-tpm {
  margin: 0 auto;
  /* width: 80%; */
  height: 1400px;
  /* cursor: pointer; */
}

.tpm_text {
  color: #676a6c;
  font-size: 13px;
  line-height: 25px;
}

.table_outer {
  /* width: 95%; */
  /* margin: 0 auto; */
  margin-top: 50px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  text-align: left;
}

.box_plots {
  width: 100%;
  /* height: 50px; */
}

.table_inner {
  padding: 30px 60px;
}

.tick_download {
  float: right;
  border: 0;
  width: 9%;
  margin-right: 1%;
  padding-top: 12px;
}

.download_all {
  float: right;
  border: 0;
  width: 9%;
  padding-top: 12px;
}

.func_points {
  height: 33px;
  margin-top: 20px;
}

.table_select {
  width: 13%;
  float: left;
}

.table_filter {
  width: 23%;
  float: left;
  margin-left: 0.65%;
}

span {
  cursor: pointer;
}

/* #container {
  height: 400px;
}

.highcharts-figure,
.highcharts-data-table table {
  min-width: 310px;
  max-width: 700px;
  margin: 1em auto;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
} */
</style>
