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
  height: 94vmin;
  /* background-color: rgb(39, 37, 35); */
}

.main-footer {
  height: 4vmin;
  position: absolute;
  width: 100%;
  bottom: 0%;
  background-color: rgba(50, 51, 50, 0.6);
  color: aquamarine;
}
</style>

<style scoped>
/* scoped说明该样式只在该组件中使用，不会污染其他组件。 */
</style>