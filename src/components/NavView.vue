<template>
  <div>
    <div class="nav_content">
      <!-- 利用路由当中访问的路径path,即$route.path来进行导航选项的高亮显示。当切换某个导航选项的时候，将会触发handleSelect方法 -->
      <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect"
        background-color="#fff" text-color="#5b6170" active-text-color="#0071bc">
        <!-- 以下index用来显示高亮的情况必须指定路由路径，否则在浏览器前后切换的时候，高亮显示是不正常的 -->
        <el-menu-item index="/" @click="showHomeView">Home</el-menu-item>
        <el-menu-item index="/jbrowse" @click="showJbrowseView">JBrowse</el-menu-item>
        <el-submenu index="3">
          <template slot="title">Genome</template>
          <el-menu-item index="/genome/gene-search" @click="showGeneSearchView">Gene Search</el-menu-item>
          <el-menu-item index="/genome/gene-annotation" @click="showGeneAnnotationView">Gene Annotation</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <!-- disabled表示禁用当前的导航选项卡 -->
        <el-menu-item index="4" disabled>develop</el-menu-item>
      </el-menu>
    </div>
    <div id="line"></div>
    <div class="show-page">
      <router-view></router-view>
    </div>
    <div>
      <a-back-top></a-back-top>
    </div>
  </div>
</template>

<script>
import { BackTop } from "ant-design-vue"
import { Menu, MenuItem, Submenu } from "element-ui";

export default {
  name: 'NavView',
  data() {
    return {
      activeIndex: '/',
    }
  },
  components: {
    "el-menu": Menu,
    "el-menu-item": MenuItem,
    "el-submenu": Submenu,
    "a-back-top": BackTop,
  },
  mounted() {
    console.log("router:", this.$router, this.$router.options.routes);
    console.log(this.$route.path);
  },
  methods: {
    // path表示当前的访问路径。arrPath表示一个数组对象，如果是单层路径，则里面就只有一个访问路径，如果是二层导航选项，里面第一个表示的是当前最顶层的访问的index数值型，这个index值就是在每个导航标签当中最顶层的index属性值，第二个表示的是访问路径；当然如果是三层及其以上的话，对应的以此类推。
    handleSelect(path, arrPath) {
      console.log(path, arrPath);
      this.activeIndex = path;
    },
    showHomeView() {
      // 编程式路由导航，利用$router当中的api直接调用push方法，这是默认路由导航。其作用跟 router-link 标签一样具有路由跳转的功能，只不过那是标签写法，这里是编程api式路由导航，也就是当用户点击了此之后，触发该push被调用之后，会跳转到对应的组件，进而在 router-view 标签处渲染出对应组件的内容。
      this.$router.push({
        // 编程式路由导航的调用传入的参数跟 router-link 标签的to的属性值一样，也是对象的形式，不过路由导航的路径最好写成路由名称的方式，不要写成路由的路径。
        name: "home",
      });
    },
    showJbrowseView() {
      this.$router.push({
        name: "jbrowse",
      });
    },
    showGeneSearchView() {
      this.$router.push({
        name: "gene-search",
      });
    },
    showGeneAnnotationView() {
      this.$router.push({
        name: "gene-annotation",
      });
    }
  },
};
</script>

<style scoped>
.nav_content {
  width: 65%;
  height: 61px;
  margin: 0 auto;
}

#line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: -2px 0px;
  position: relative;
  z-index: 99;
}

.show-page {
  width: 67%;
  /* height: 500px; */
  margin: 0 auto;
  margin-top: 30px;
}
</style>
