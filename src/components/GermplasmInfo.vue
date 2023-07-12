<template>
  <div>
    <div style="text-align: left;">
      <p style="color: #2190bd; font-size: 13px; font-weight: bold;">Germplasm Info</p>
      <div class="line"></div>
      <p style="color: #676a6c; font-size: 12px;">This module presents a navigation summary of all relevant methods in
        Germplasm, and introduces various germplasm resources, their corresponding methods, and corresponding detailed
        description information.</p>
    </div>
    <div class="list-info">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GermplasmInfo',
  data() {
    return {
    }
  },
  mounted() {
    console.log("flag", this.$route.query);
    // 这里有一个小问题：虽然这里的判断参数解决了就是真正从Germplasm resources列表那块访问来的，可以携带具体的参数，然后访问到具体的那个资源信息info,也就是下述会直接走return这块逻辑。但是同样会产生一个问题：而如果是从具体的访问进去的列表那块过来访问germplasm-info,还是germplasm-info自己访问自己，将不会走这里的mounted()函数逻辑，也就不会出现默认的查询列表。而且created()函数也是一样的。除此之外，还有一个显示的小bug,就是在从其他页面访问这个germplasm-info页面路径的时候，会出现其他页面闪一下的感觉，不是那么流畅。
    if (JSON.stringify(this.$route.query) !== '{}') return;
    this.$router.push({
      name: "germplasm-ctss",
      query: {
        flag: 3,
      },
    });
  }
};
</script>

<style scoped>
.line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: 20px 0px;
}

.list-info {
  text-align: left;
  margin-top: 50px;
  height: 500px;
}
</style>
