<template>
  <div class="show-tpm">
    <!-- vue当中就使用这个组件来表示了，取消标签的写法，并且增加了有关vue能够识别的标签，详情看查看官网：https://www.hcharts.cn/docs/highcharts-vue/；constructor-type表示	图表构造函数类型，用于初始化特定图表。允许的参数选项：'chart', 'stockChart', 'mapChart'。chart即为为默认值。-->
    <highcharts :constructor-type="'chart'" :options="tpmOptions"></highcharts>
    <!-- <highcharts :options="tpmOptions"></highcharts> -->

    <!-- <figure class="highcharts-figure">
      <div id="container"></div>
      <p class="highcharts-description">
        Chart showing the use of box plots with outliers. The chart makes use
        of a plot line to show the theoretical mean value across the y-axis.
      </p>
    </figure> -->
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
    highcharts: Chart
  },
  data() {
    return {
      tpmOptions: {
        // 图表类型
        chart: {
          type: 'boxplot'
        },
        // 图表的标题
        title: {
          text: 'Highcharts Box Plot Example'
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
            text: 'Experiment No.'
          }
        },
        // y轴图表配置。y轴数轴上的数据会根据下属data数组的数据自适应调整的
        yAxis: {
          // y轴标题
          title: {
            text: 'Observations'
          },
          // y轴横分割线一些样式及数据配置
          plotLines: [{
            value: 932,
            color: 'red',
            width: 1,
            label: {
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
        series: [{
          // 每一纵列的名称
          name: 'Observations',
          // data对应每一列的数据,每一个数组对应一列数据，包括最大值，高水平值，中间值，低水平值，最小值等。并且对应的数据也对应图中显示的线条。
          data: [
            [660, 801, 848, 895, 965],
            [733, 853, 939, 980, 1080],
            [714, 762, 817, 870, 918],
            [724, 802, 806, 871, 950],
            [804, 836, 864, 882, 910]
          ],
          tooltip: {
            // 每列鼠标hover之后最头部的数据显示
            headerFormat: '<em>Experiment No {point.key}</em><br/>'
          }
        }, {
          // 每列小圆点数据的显示
          name: 'Outliers',
          color: Highcharts.getOptions().colors[0],
          type: 'scatter',
          data: [ // x, y positions where 0 is the first category
            [0, 744],
            [0, 644],
            [0.15, 644],
            [4, 718],
            [4, 951],
            [4, 969]
          ],
          marker: {
            fillColor: 'white',
            lineWidth: 0.2,
            lineColor: Highcharts.getOptions().colors[0]
          },
          tooltip: {
            // 鼠标放到小圆点的数据显示
            pointFormat: 'Observation: {point.y}'
          }
        }]
      }

    }
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.show-tpm {
  margin: 0 auto;
  width: 80%;
  height: 500px;
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
