<template>
  <div>
    <div style="text-align: left;">
      <p style="color: #2190bd; font-size: 13px; font-weight: bold;">Gene Annotation</p>
      <div class="line"></div>
      <p class="gene_search_text">This module cross-integrates genome data from multiple species by gene id, including
        gene id, gene name, chromosome where the gene is located, the start and end positions of the gene, and the
        positive and negative strand data where it is located. You can search and specify the desired genome data through
        the following interface.</p>

      <div class="search_option_outer">
        <a-icon type="unordered-list" class="filter_icon" style="color: #0071bc;" />
        <div class="search_option_inner">
          <!-- activeKey的值的变动跟调用changeActivekey方法值的变动是一样的，都指代当前折叠面板key值的变化 -->
          <a-collapse v-model="activeKey" accordion :bordered="false" :expand-icon-position="expandIconPosition"
            @change="changeActivekey">
            <a-collapse-panel key="1" header="Filter to search" :style="customRootStyle">
              <a-icon slot="extra" type="setting" @click="handleClick" />
              <p style="font-size: 14px">Switch one, then search within results by gene ID, gene region, or name</p>

              <a-tabs type="card" @change="callback">
                <a-tab-pane key="1" tab="gene">
                  <el-input v-model="search" placeholder="input gene id" clearable>
                    <!-- slot的属性值如果是append的话表示紧接着的是一个按钮的形式，suffix表示镶嵌在输入框里面，会镶嵌在输入框后年，prefix也表示镶嵌，但是会镶嵌在输入框的最前面。以下slot的属性配置方法还可以通过 prefix-icon="el-icon-search" 设置 -->
                    <i class="el-input__icon el-icon-search" slot="prefix" @click="onSearch"></i>
                  </el-input>
                </a-tab-pane>
                <a-tab-pane key="2" tab="region">
                  Content of Tab Pane 2
                </a-tab-pane>
                <a-tab-pane key="3" tab="name">
                  Content of Tab Pane 3
                </a-tab-pane>
              </a-tabs>

            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { Input } from "element-ui"
import { Collapse, Icon, Tabs } from "ant-design-vue";
// 对于不能直接按照上述引入的组件，必须得找到lib目录下对某个文件夹下的文件进行引入才行，如下模式:
import CollapsePanel from 'ant-design-vue/lib/collapse/CollapsePanel'
import { TabPane } from 'ant-design-vue/lib/tabs/index'
// import InputSearch from 'ant-design-vue/lib/input/Search'
// import 'ant-design-vue/lib/auto-complete'; 

export default {
  name: 'GeneSearch',
  data() {
    return {
      search: "",
      activeKey: ['0'],
      expandIconPosition: "right",
      customRootStyle: 'background-color: #fff; border-radius: 4px; border: 0; font-size: 17px;',
      customChildStyle: 'background-color: #fff; border-radius: 4px; font-size: 14px;',
    }
  },
  components: {
    "a-icon": Icon,
    "a-collapse": Collapse,
    "el-input": Input,
    "a-tabs": Tabs,
    "a-tab-pane": TabPane,
    "a-collapse-panel": CollapsePanel,
  },
  watch: {
    activeKey(key) {
      console.log(key);
    },
  },
  mounted() {
    console.log(this.$parent);
  },
  methods: {
    handleClick(event) {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    },
    changeActivekey(key) {
      console.log(key);
    },
    onSearch() {
    },
    callback(key) {
      console.log(key);
    },
  },
};
</script>

<style scoped>
.line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: 20px 0px;
}

.gene_search_text {
  color: #676a6c;
  font-size: 13px;
  line-height: 25px;
}

.search_option_outer {
  text-align: left;
  margin-top: 30px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

.filter_icon {
  position: relative;
  top: 26.5px;
  left: 162px;
  float: left;
}

.search_option_inner {
  padding: 10px;
}
</style>
