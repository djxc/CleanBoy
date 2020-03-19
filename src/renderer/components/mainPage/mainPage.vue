<template>
  <!-- 程序的主界面 -->
  <div>
    <DJHeader></DJHeader>
    <div class="main-body">
      <router-view></router-view>
    </div>
    <div class="main-footer">footer</div>
  </div>
</template>

<script>
import DJHeader from '../header/DJHeader.vue'
export default {
  name: 'mainPage',
  components: {
    DJHeader
  },
  methods: {}
}
</script>

<style>
.main-body {
  height: 90vmin;
  /* background-color: rgb(39, 37, 35); */
}

.main-footer {
  height: 4vmin;
  background-color: rgb(50, 51, 50);
  color: aquamarine;
}
</style>

<style scoped>
/* scoped说明该样式只在该组件中使用，不会污染其他组件。 */
</style>