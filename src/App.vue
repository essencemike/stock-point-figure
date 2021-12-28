<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import StockChart from './components/StockChart.vue'
</script>

<template>
  <h2 class="title">点数图生成工具</h2>
  <StockChart />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.title {
  float: left;
  margin-top: 4px;
  margin-left: 15px;
}
</style>
