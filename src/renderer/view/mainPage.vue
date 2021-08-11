<!--
@FileDescription 程序主界面
1、提供程序头部工具栏以及底部状态栏
2、提供路由跳转
@Author small dj
@Date 2020-12-12
@LastEditor small dj
@LastEditTime 2020-12-12 18:30
-->
<template>
  <!-- 程序的主界面 -->
  <div>
    <DJHeader></DJHeader>
    <div class="main-body">
      <router-view></router-view>
    </div>
    <div class="main-footer">尔识真理，真理释尔。</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DJHeader from '@/components/header/DJHeader.vue'
export default {
  name: 'mainPage',
  components: {
    DJHeader
  },
  data: () => {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(this)
    }
  },
  computed: {
    ...mapState({
      lon_x: state => state.Counter.lon_x,
      lat_y: state => state.Counter.lat_y
    })
  }
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