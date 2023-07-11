<template>
  <div style="height: 1000px;">
    <div class="home-search">
      <div class="home-search-inner">
        <el-select v-model="speciesSearchOptionValue" placeholder="Specie Name" style="width: 250px;">
          <el-option v-for="item in speciesOptions" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-input v-model="search" placeholder="input gene id" clearable style="width: 900px; margin-left: 10px;">
          <!-- slot的属性值如果是append的话表示紧接着的是一个按钮的形式，suffix表示镶嵌在输入框里面，会镶嵌在输入框后年，prefix也表示镶嵌，但是会镶嵌在输入框的最前面。以下slot的属性配置方法还可以通过 prefix-icon="el-icon-search" 设置 -->
          <i class="el-input__icon el-icon-search" slot="suffix" @click="onSearch" @keydown.enter="onSearch"></i>
        </el-input>
      </div>
    </div>
    <div class="home-index">
      <el-carousel indicator-position="outside">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
          <!-- <div class="home-index-inner">
            <div style="width:200px; float: left;">
              <img src="../assets/logo.png" />
            </div>
            <div style="width:200px; float: left;">
              <img src="../assets/screenshot.webp" />
            </div>
            <div style="width:200px; float: left;">
              <img src="../assets/lobster.jpg" />
            </div>
          </div> -->
        </el-carousel-item>
      </el-carousel>
    </div>

    <div style="margin-top: 50px;">
      <div class="title-info">
        <div class="title-jbrowse">
          <h1>GFF3 Gene JBrowse</h1>
          <h3>A genome browser focused on being able to quickly browse gff3 files online</h3>
          <p style="line-height: 25px;">You can click the samples button below to select a specific species to view the
            genetic data, or you can click the upload button to upload the .fa genetic data files you need to view.</p>
        </div>
        <div class="upload-index">
          <div style="margin-left: 50px; margin-right: 50px; height: 40px;">
            <UploadFaFile></UploadFaFile>
            <div style="float: left; width: 33%;">
              <a href="http://10.199.105.51:9878/">
                <el-button style="" type="info" plain @click="dialogVisible = true">
                  <i class="el-icon-view"></i>
                  <span style="margin-left: 8px;">SAMPLES</span>
                </el-button>
              </a>
            </div>
            <UploadGffFile></UploadGffFile>
          </div>
        </div>
        <div style="margin-top: 18px; text-align: left;">
          <span style="font-size: 12px;">Tips: Click the tbi index button, you can upload the gff3 annotation genome
            file,
            we will index the file and display it in the interface below, so that you can add the gff3 track after the
            corresponding fa file is uploaded, then you can view the corresponding genome annotation data.</span>
        </div>
      </div>
    </div>
    <div class="paper-info">
    </div>
    <!-- <div class="mb-4" style="margin-left: 30px;">
        <img style="border-radius: 8px;border: 4px solid #e0e0e0;height: auto;width: 100%;" width="1364" height="1362"
          alt="screen of gene jbrowse 2" src="../assets/screenshot.webp" />
      </div> -->
  </div>
</template>

<script>
import { Input, Select, Option, Button, Carousel, CarouselItem } from "element-ui";
import UploadFaFile from "./UploadFaFile.vue";
import UploadGffFile from "./UploadGffFile.vue";

export default {
  name: "HomeView",
  data() {
    return {
      search: "",
      speciesOptions: ['Cottoperca gobio', 'Camarhynchus parvulus'],
      speciesSearchOptionValue: 'Cottoperca gobio',
    }
  },
  mounted() {
  },
  components: {
    "el-input": Input,
    "el-select": Select,
    "el-option": Option,
    "el-button": Button,
    "el-carousel": Carousel,
    "el-carousel-item": CarouselItem,
    UploadFaFile,
    UploadGffFile
  },
  methods: {
    onSearch() {
    }
  }

};
</script>

<style scoped>
.home-search {
  width: 100%;
  height: 58px;
  border-radius: 4px;
  /* border: 1px solid; */
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

i {
  cursor: pointer;
}

.home-search-inner {
  padding: 9px 10px;
}

.title-info {
  float: left;
  width: 70%;
}

.title-jbrowse {
  text-align: left;
}

.upload-index {
  width: 100%;
  height: 40px;
  margin-top: 50px;
}

.home-index {
  width: 100%;
  height: 300px;
  margin-top: 30px;
  background: url('../assets/home-row.jpg') no-repeat center center;
  background-size: cover;
}

.home-index-inner {
  line-height: 300px;
  margin: 0;
  text-align: center;
  /* display: flex; */
}

/* .el-carousel__item div { */
/* color: #475669; */
/* font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0; */
/* } */

/* .el-carousel__item:nth-child(2n) { */
/* background-color: #99a9bf; */
/* } */

/* .el-carousel__item:nth-child(2n+1) { */
/* background-color: #d3dce6; */
/* } */

.paper-info {
  float: left;
  width: 29%;
  margin-left: 11px;
}
</style>