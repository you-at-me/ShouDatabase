<template>
  <div>
    <div class="nav_content">
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
        <el-menu-item index="4" disabled>develop</el-menu-item>
      </el-menu>
    </div>
    <div class="show-page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
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
    "el-submenu": Submenu
  },
  mounted() {
    console.log("router:", this.$router, this.$router.options.routes);
    console.log(this.$route.path);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
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

.show-page {
  width: 67%;
  /* height: 500px; */
  margin: 0 auto;
  margin-top: 30px;
}
</style>
