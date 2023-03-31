<template>
  <div>
    <div style="text-align: left;">
      <p><a href="https://jbrowse.org/jb2/" style="color: #2190bd; font-size: 13px;">Jbrowse</a></p>
      <div class="line"></div>
      <p style="color: #676a6c; font-size: 12px;">JBrowse is a dynamic web platform website focusing on visualization and
        analysis of genomic data.</p>
    </div>
    <div class="select_option_outer">
      <div class="select_option_inner">
        <!-- 当开启了filterable功能的时候默认会过滤el-option标签下label属性值的内容，展示所需要搜索的所有包含其中的内容。若希望使用其他的搜索逻辑，可以通过传入一个filter-method来实现(但filterable不能删掉)即通过 :filter-method="filterSearch"。filter-method为一个函数方法，这里指定filterSearch,它会在输入值发生变化时自动调用，参数为当前输入值，当输入框一有变化时将会自动调用对应的属性值方法。-->
        <el-select v-model="searchOptionValue" style="width: 275px" filterable clearable placeholder="select one or input to search">
          <el-option-group v-for="group in options" :key="group.selectLabel" :label="group.selectLabel">
            <el-option v-for="item in group.options" :key="item.label" :label="item.value" :value="item.value"
              :disabled="item.disabled">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
    </div>
    <iframe :src="jbrowsePageSrc" frameborder="0" class="jbrowse_index"></iframe>
  </div>
</template>

<script>
import { Select, OptionGroup, Option } from "element-ui";

export default {
  name: 'JBrowseView',
  components: {
    "el-select": Select,
    "el-option-group": OptionGroup,
    "el-option": Option
  },
  props: ["speciesName"],
  data() {
    return {
      jbrowsePageSrc: "",
      options: [
        {
          selectLabel: 'popular searches',
          options: [
            {
              value: 'Shanghai',
              label: '上海'
            }, {
              value: 'Cottoperca gobio',
              label: '石首鱼'
            }
          ]
        }, {
          selectLabel: 'species',
          options: [
            {
              value: 'Chengdu',
              label: '成都',
              disabled: true
            }, {
              value: 'Camarhynchus parvulus',
              label: '小树雀鱼'
            }, {
              value: 'Guangzhou',
              label: '广州'
            }, {
              value: 'Dalian',
              label: '大连'
            }
          ]
        }
      ],
      // searchOptionValue: 'Cottoperca gobio'
      searchOptionValue: '',
    }
  },
  mounted() {
    console.log(this.speciesName);
    // 这里是将传过来的query参数，将其物种值赋给searchOptionValue,只要其值发生变化，watch就会监控到并最终做出页面渲染
    if (typeof (this.speciesName) != "undefined" && this.speciesName != "") {
      this.searchOptionValue = this.speciesName;
      return;
    }
    // 对于在vue里面嵌套另外一个完整的html文件，则只需引入对应文件即可，但是需要注意必须引入的是public下static的文件夹，而且在引入的时候是不需要指定public路径的。要么就是你可以引入public目录下以其他文件命名的html文件，比如page.html文件(该文件存在于public目录下)
    this.jbrowsePageSrc = `../../../static/index.html?config=project_data%2FCottoperca_gobio%2Fconfig.json&session=spec-{"views":[{"type": "LinearGenomeView", "displayedRegions":[{"assemblyName":"Cottoperca_gobio.fCotGob3.1.dna.toplevel"}]}]}`; // session具体的各自参数链接写法详情请看：https://jbrowse.org/jb2/docs/urlparams/

    // this.pageSrc = `../../../static/index.html?config=`;

  },
  methods: {
    filterSearch(searchParam) {
      console.log(searchParam);
    }
  },
  watch: {
    // 监控搜索单选框当中值的变化，一旦改变就渲染对应的物种的JBrowse页面
    searchOptionValue(newValue, oldValue) {
      console.log('searchOptionValue被修改了', "new:" + newValue, "old:" + oldValue)
      if (newValue != '' && newValue != null) {
        this.jbrowsePageSrc = `../../../static/index.html?config=project_data%2F` + newValue.replace(" ", "_") + `%2Fconfig.json&session=spec-{"views":[{"type": "LinearGenomeView"}]}`;
      }
    },
  }
};
</script>

<style scoped>
.line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: 20px 0px;
}

.select_option_outer {
  text-align: left;
  margin-top: 30px;
  width: 295px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

.select_option_inner {
  padding: 10px;
}

.jbrowse_index {
  margin-top: 30px;
  width: 100%;
  height: 950px;
}
</style>
