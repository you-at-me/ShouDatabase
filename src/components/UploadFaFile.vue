<template>
  <div class="upload-fa">
    <el-button type="warning" plain @click="dialogVisible = true">
      <i class="el-icon-top"></i>
      <span style="margin-left: 8px;">UOLOAD</span>
    </el-button>

    <el-dialog title="UPLOAD FILES" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
      <!-- accept=".gz"表示只接收.gz文件，在这设置文件类型的好处在于，在选择文件弹出框的时候就显示只能上传对应类型的文件 -->
      <el-upload class="upload-file" ref="upload" action="#" :limit="2" drag multiple :headers="headers"
        :auto-upload="false" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitUpload" @keydown.enter="submitUpload">upload</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { Button, Dialog, Upload, Loading, Message } from "element-ui";
import axios from "axios";

export default {
  name: "UploadFaFile",
  data() {
    return {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      configFilePath: "",
      dialogVisible: false,
      fileList: [],
      options: {
        lock: true,
        text: "loading",
        fullscreen: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
    };
  },
  components: {
    "el-button": Button,
    "el-dialog": Dialog,
    "el-upload": Upload,
  },
  mounted() {
    console.log(process.env.NODE_ENV);
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
    fileLimits() { // 处理文件上传指定文件类型逻辑
      this.fileList = this.$refs.upload.uploadFiles.filter(file => {
        return file.size;
      })
      let uploadFilesLength = this.fileList.length;
      if (uploadFilesLength > 1) {
        Message({
          message: '一次只能上传一个文件',
          type: 'warning'
        });
        return false;
      }
      if (uploadFilesLength === 1) {
        let fileName = this.fileList[0].name;
        if (this.fileList[0].size > 1 * 1024 * 1024 * 1024 && fileName.endsWith('.fa')) {
          Message('文件超过1G的请上传对应.fa格式的.gz文件!')
          return false;
        }
        if (fileName.endsWith('.fa.gz') || fileName.endsWith('.fa')) {
          return true;
        } else {
          Message({
            showClose: true,
            message: '文件类型不对，上传.fa或.fa格式的.gz文件',
            type: 'error'
          });
          return false;
        }

      } else {
        Message('请先上传文件！')
        return false;
      }
    },
    sendData() {
      const params = new FormData();
      this.fileList.forEach(
        // eslint-disable-next-line no-unused-vars
        (val, _) => {
          params.append("file", val.raw);
        }
      );
      let loadingInstance = Loading.service(this.options);
      const _this = this;
      // 文件上传只能传输FormData格式，另外开发阶段需要通过vue.config.js配置请求代码，生产环境下需要做出改变
      const IS_PRODUCTION = ['production', 'prod'].includes(process.env.NODE_ENV); 
      let url = IS_PRODUCTION ? "http://10.199.105.51:9877/upload/script/fa" : "/api/upload/script/fa";
      axios.post(url, params).then(
        res => {
          console.log(res);
          if (res.data.code == 2000) {
            Message({
              message: '上传成功！',
              type: 'success'
            });
            console.log(res.data.data[0]);
            _this.configFilePath = res.data.data[0];
          }
          if (_this.configFilePath != "") {
            _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭，这里设置等后端响应出来有数据了就关闭
              _this.dialogVisible = false;
              loadingInstance.close();
              window.location.href = 'http://10.199.105.51:9878/?config=' + _this.configFilePath; // 成功加载之后实现页面跳转
            });
          }
        },
        // 这里出现的错误，一般都是网络或者跨域的问题出错，一般都是编程式出现了错误
        err => console.log(err)
      ).catch(err => console.log(err)); // 这里的错误是axios本身出现的错误
    },
    submitUpload() {
      if (!this.fileLimits()) return;
      console.log(this.fileList);
      // this.$refs.upload.submit();
      this.sendData();
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
.upload-fa {
  float: left;
  width: 33%;
}

.upload-file {
  text-align: center;
}
</style>