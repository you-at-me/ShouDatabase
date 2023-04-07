<template>
  <div>
    <h3 style="color: #2190bd;">{{ o.name }}</h3>
    <span>{{ o.paper }}</span>
    <p style="font-size: 13px; margin-top: 2px;">{{ o.method }}</p>
    <div class="img-info">
      <img style="margin-left: 80px;" src="../../assets/CTSS-one.png">
      <img src="../../assets/CTSS-four.png">
      <img src="../../assets/wssv.png">
      <img style="margin-right: 80px;" src="../../assets/div.png">
    </div>
    <p style="font-size: 13px;">{{ o.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'GermplasmCtss',
  data() {
    return {
      o: {},
    }
  },
  props: ["flag"],
  mounted() {
    this.getXlsxSpecifyData(this, "/data/gene.xlsx")
  },
};
</script>

<style scoped>
.line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: 20px 0px;
}

.img-info {
  width: 100%;
  height: 135px;
  margin: 30px 0px;
}

img {
  width: 210px;
  height: 135px;
  margin: 0px 30px;
}
</style>
