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
