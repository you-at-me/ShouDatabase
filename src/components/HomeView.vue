<template>
  <div>
    <div class="title-jbrowse">
      <h1 style="margin-top: 70px;">GFF3 Gene JBrowse</h1>
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
  <!-- <div class="mb-4" style="margin-left: 30px;">
        <img style="border-radius: 8px;border: 4px solid #e0e0e0;height: auto;width: 100%;" width="1364" height="1362"
          alt="screen of gene jbrowse 2" src="../assets/screenshot.webp" />
      </div> -->
</template>

<script>
import { Button } from "element-ui";
import UploadFaFile from "./UploadFaFile.vue";
import UploadGffFile from "./UploadGffFile.vue";

export default {
  name: "HomeView",
  data() {
    return {
    }
  },
  components: {
    "el-button": Button,
    UploadFaFile,
    UploadGffFile
  },
  
};
</script>

<style scoped>
.title-jbrowse {
  text-align: left;
}

.upload-index {
  width: 100%;
  height: 40px;
  margin-top: 50px;
}
</style>