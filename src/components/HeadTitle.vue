<template>
  <div class="head">
    <div class="head_title">
      <h1 class="h1_title">Comparative Genome Database for Fish</h1>
      <span class="span_title">Focus on search display and collinear analysis of genomic data</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadTitle',
};
</script>

<style scoped>
.head {
  width: 100%;
  height: 120px;
  background-color: #20558a;
}

.head_title {
  width: 67%;
  margin: 0 auto;
}

.h1_title {
  color: azure;
  text-align: left;
  line-height: 90px;
}

.span_title {
  color: azure;
  text-align: left;
  line-height: 20px;
  margin-top: -42px;
  padding-left: 5px;
  display: block;
}
</style>
