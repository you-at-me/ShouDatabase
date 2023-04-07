import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { MessageBox, Notification, Loading } from 'element-ui'
import { downloadXlsx } from './utils/downloadXlsx.js'
import { getXlsxSpecifyData } from '@/utils/xlsxSpecifyData';

Vue.config.productionTip = false;
// 修改this.$confirm出现问题的办法
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$notify = Notification;
Vue.use(Loading.directive);

// 将定义的表格导出下载的方法函数放进vue实例中
Vue.prototype.downloadXlsx = downloadXlsx;
Vue.prototype.getXlsxSpecifyData = getXlsxSpecifyData;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
