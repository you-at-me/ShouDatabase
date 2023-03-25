<template>
  <div id="app">
    <HeadTitle></HeadTitle>
    <NavView></NavView>
  </div>
</template>

<script>
import HeadTitle from "./components/HeadTitle.vue";
import NavView from "./components/NavView.vue";

export default {
  name: "App",
  components: {
    HeadTitle,
    NavView
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

a {
  text-decoration: none;
  color: #000;
}</style>
