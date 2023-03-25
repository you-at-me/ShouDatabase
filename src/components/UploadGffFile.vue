<template>
  <div class="upload-gff">
    <el-button type="primary" plain @click="dialogVisible = true">
      <i class="el-icon-folder-checked"></i>
      <span style="margin-left: 8px;">TBI INDEX</span>
    </el-button>

    <el-dialog title="UPLOAD FILES" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
      <!-- accept=".gz"表示只接收.gz文件，在这设置文件类型的好处在于，在选择文件弹出框的时候就显示只能上传对应类型的文件 -->
      <el-upload class="upload-file" ref="upload" :limit="4" action="#" :on-preview="handlePreview"
        :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :on-success="handleUploadSuccess"
        :headers="headers">
        <el-button slot="trigger" size="small" type="primary" class="chooseFile">choose files</el-button>
        <el-tooltip class="item" effect="dark" content="系统将自动导入对应的track数据" placement="top">
          <el-switch style="float: right; margin-top: 10px;" v-model="isLoading" active-text="是否自动加载索引"></el-switch>
        </el-tooltip>
        <!-- <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">upload</el-button> -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="submitUpload"
          @keydown.enter="submitUpload">upload</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Button, Dialog, Upload, Tooltip, Switch, Message } from "element-ui";
import axios from "axios";

export default {
  name: "UploadGffFile",
  data() {
    return {
      isLoading: true,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      configFilePath: "",
      dialogVisible: false,
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
        // {
        //   name: "food2.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
      fullscreenLoading: false,
    };
  },
  components: {
    "el-button": Button,
    "el-dialog": Dialog,
    "el-upload": Upload,
    "el-tooltip": Tooltip,
    "el-switch": Switch
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        // eslint-disable-next-line no-unused-vars
        .then((_) => {
          done();
        })
        // eslint-disable-next-line no-unused-vars
        .catch((_) => { });
    },
    fileLimits() { // 处理多文件上传指定文件类型逻辑
      this.fileList = this.$refs.upload.uploadFiles.filter(file => {
        return file.size;
      })
      let uploadFilesLength = this.fileList.length;

      if (uploadFilesLength != 0) {
        for (let i = 0; i < uploadFilesLength; i++) {
          let fileName = this.fileList[i].name;
          if (this.fileList[i].size > 500 * 1024 * 1024 && fileName.endsWith('.gff3')) {
            Message('文件超过500MB的请上传对应.gff3格式的.gz文件!')
            return false;
          }
          console.log("第" + i + "个文件名称：" + fileName);

          if (i == uploadFilesLength - 1) {
            if (fileName.endsWith('.gff3.gz') || fileName.endsWith('.gff3')) {
              return true;
            } else {
              break;
            }
          }
          if ((fileName.endsWith('.gff3.gz')) || (fileName.endsWith('.gff3'))) {
            continue;
          } else {
            break;
          }
        }
        Message({
          showClose: true,
          message: '文件类型不对，上传.gff3或.gff3格式的.gz文件',
          type: 'error'
        });
        return false;
      } else {
        Message({
          message: '请先上传文件！',
          type: 'warning'
        });
        return false;
      }
    },
    handleUploadSuccess(res, file, fileList) {
      console.log("success:", res, file, fileList);
    },
    sendData() {
      // 文件上传只能传输FormData格式
      const params = new FormData();
      this.fileList.forEach(
        // eslint-disable-next-line no-unused-vars
        (val, _) => {
          params.append("file", val.raw);
        }
      );
      this.fullscreenLoading = true;
      const _this = this;

      const IS_PRODUCTION = ['production', 'prod'].includes(process.env.NODE_ENV);
      let url = IS_PRODUCTION ? "http://10.199.105.51:9877/upload/script/gff3" : "/api/upload/script/gff3";
      let queryUrl = this.isLoading ? url + "?isLoading=1" : url;
      axios.post(queryUrl, params).then(
        res => {
          console.log(res);

          if (res.data.code == 2000) {
            _this.fullscreenLoading = false;
            if (res.data.data[0] == "2000") {
              window.location.href = "http://10.199.105.51:9878/?config=" + res.data.data[1];
            }

            Message({
              message: '上传成功！请下载您对应的.tbi索引文件和.sorted.gff3.gz文件',
              type: 'success'
            });
            _this.$notify({
              title: '注意',
              // If the track is not added automatically, you need to upload the tbi index file corresponding to gff3 and the sorted .sorted.gff3.gz compressed file corresponding to the gene sequence when adding a track.
              message: '如果不自动添加track，则需要自行且必须上传gff3对应的tbi索引文件和基因序列对应排序好了的.sorted.gff3.gz压缩文件。',
              duration: 0
            });
          }
        },
        // 这里出现的错误，一般都是网络或者跨域的问题出错，一般都是编程式出现了错误
        err => console.log(err)
      ).catch(err => console.log(err)); // 这里的错误是axios本身出现的错误
    },
    submitUpload() {
      // let url = "http://10.199.105.51:9878/project_data/Camarhynchus_parvulus/config.json"
      // fetch(url, {
      //   hearders: new Headers({
      //     'Content-Type': 'Access-Control-Allow-Origin',
      //   })
      // }).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
      //   console.log(blob)
      //   const link = document.createElement('a')
      //   link.href = URL.createObjectURL(blob)
      //   // console.log(link.href)
      //   link.download = ''
      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link)
      // })

      // let url = "/api/project_data/Camarhynchus_parvulus/config.json"
      // const x = new XMLHttpRequest();
      // x.open("GET", url, true);
      // x.responseType = 'blob';
      // x.setRequestHeader("Content-Type", "Access-Control-Allow-Origin")
      // x.onload = function () {
      //   //会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
      //   let url = window.URL.createObjectURL(x.response)
      //   let a = document.createElement('a');
      //   a.href = url
      //   a.download = "config.json";
      //   a.click()
      // }
      // x.send();

      if (!this.fileLimits()) return;
      console.log(this.fileList);
      // this.$refs.upload.submit();
      this.sendData();
      this.dialogVisible = false;
      console.log(this.$refs.upload);
    },
    handleRemove(file, fileList) {
      // file表示当前所移除的对象
      console.log("delete:" + file, fileList);
    },
    handlePreview(file) {
      console.log(this.$refs.upload.uploadFiles);
      // file表示查看当前的对象
      console.log(file);
    },
  },
};
</script>

<style scoped>
.upload-gff {
  float: left;
  width: 33%;
}

.upload-file {
  text-align: left;
}
</style>