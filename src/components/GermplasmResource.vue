<template>
  <div>
    <div style="text-align: left;">
      <p style="color: #2190bd; font-size: 13px; font-weight: bold;">Germplasm Resource</p>
      <div class="line"></div>
      <p style="color: #676a6c; font-size: 12px;">This module presents a navigation summary of all relevant methods in
        Germplasm.</p>
    </div>
    <div class="germplasm-list">
      <div style="width: 100%;">
        <span style="font-size: 21px; color: #2190bd;">Germplasm resources</span>
        <i class="el-icon-more" style="float: right; margin: 15px 5px 0px 0px;"></i>
        <span class="info-more">info more</span>
      </div>
      <div style="width: 100%; height: 390px;">
        <ul style="width: 100%;">
          <li v-for="(o, index) in filterGermplasmData" :key="index">
            <div class="info" @click="showGermplasm(o.nav, o.flag)">
              <div style="margin: 10px 20px">
                <span class="info-span">{{ o.name }}</span>
                <h6 class="info-h6">{{ o.paper }}</h6>
                <p class="info-p">{{ o.description }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div style="width:100%; margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[3, 6, 9, 15]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="germplasmData.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import { Pagination } from "element-ui"
import XLSX from 'xlsx';
import axios from 'axios';

export default {
  name: 'GermplasmResource',
  data() {
    return {
      germplasmData: [],
      filterGermplasmData: [],
      currentPage: 1,
      pageSize: 6,
    }
  },
  components: {
    "el-pagination": Pagination
  },
  mounted() {
    this.readExcelData("/data/xlsx/gene.xlsx");
  },
  watch: {
    germplasmData() {
      this.pageRenderingGermplasmData();
    }
  },
  methods: {
    showGermplasm(nav, flag) {
      this.$router.push({
        name: "germplasm-" + nav,
        query: {
          flag: flag,
        },
      });
    },
    readExcelData(url) { // 在原生js当中无法将一个axios的返回值赋给外界的变量，现使用vue
      const _this = this;
      axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
        const data = new Uint8Array(res.data);
        let wb = XLSX.read(data, { type: 'array' });
        const getDatas = [];
        for (let key in wb.Sheets) {
          getDatas.push(XLSX.utils.sheet_to_json(wb.Sheets[key]));
        }
        // 得到的数据不能直接塞到数组当中，否则在外面将取不出来；只能遍历数据
        const targetData = getDatas[1].filter((_, index) => {
          return index !== 0;
        })
        for (let i = 0; i < targetData.length; i++) {
          const o = {
            "flag": i,
            "name": targetData[i].name,
            "method": targetData[i].method,
            "description": targetData[i].description
          }
          if (typeof (targetData[i].paper) != "undefined" && targetData[i].paper != '') {
            o.paper = targetData[i].paper;
          }
          if (i == 0) {
            o.nav = "haixing"
          } else if (i == 1) {
            o.nav = "zhongxing"
          } else if (i == 2) {
            o.nav = "haijing"
          } else if (i == 3) {
            o.nav = "ctss"
          } else if (i == 4) {
            o.nav = "zero-four-two-one"
          }
          // console.log(o);
          _this.germplasmData.push(o);
        }

      }, err => console.log(err)).catch(err => console.log(err))
    },
    pageRenderingGermplasmData() {
      if (this.currentPage == Math.ceil(this.germplasmData.length / this.pageSize)) {
        console.log("the last page");
        this.filterGermplasmData = this.germplasmData.slice((this.currentPage - 1) * this.pageSize, this.germplasmData.length)
      }
      this.filterGermplasmData = this.germplasmData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    // 分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.pageRenderingGermplasmData();
      console.log("pageSizeChange data:", this.pageFilterTableData);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.pageRenderingGermplasmData();
      console.log("currentPageChange data:", this.pageFilterTableData);
    },
  },

};
</script>

<style scoped>
ul,
ol {
  list-style: none;
  margin: 0px;
  padding: 0px;
}

.line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: 20px 0px;
}

.germplasm-list {
  width: 100%;
  margin-top: 50px;
  text-align: left;
}

.info-more {
  font-size: 14px;
  color: #024091;
  float: right;
  margin: 11px 5px 0px 0px;
  cursor: pointer;
}

.info {
  width: 370px;
  height: 150px;
  border: 1px solid #e9e9e9;
  float: left;
  margin: 20px 12px;
  cursor: pointer;
}

.info:hover {
  border: 1px solid #043e90;
}

.info:hover span {
  color: #043e90;
  font-weight: 1000;
}

.info-span {
  line-height: 40px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-h6 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.info-p {
  font-size: 12px;
  color: #999;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
