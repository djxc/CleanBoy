<template>
  <div>
    <div class="main-body-menu1">
      <div class="main-body-menu1-item">
        <img class="main-body-d2earth-img"
         src="~@/assets/earth.jpg" title="二维地图" @click="goto2DMap('/main/2dmap')" />
      </div>
      <div class="main-body-menu1-item">
        <img src="~@/assets/3dEarth.jpg" title="三维地图" @click="goto2DMap('/main/3dmap')"/>
      </div>
      <div class="main-body-menu1-item">
        <img src="~@/assets/charts.jpg" title="报表工具" @click="goto2DMap('/main/charts')"/>
      </div>
      <div class="main-body-menu1-item"></div>
    </div>
    <div class="main-body-menu2">
      <div class="main-body-menu2-item"></div>
      <div class="main-body-menu2-item"></div>
      <div class="main-body-menu2-item"></div>
      <div class="main-body-menu2-item"></div>
    </div>
    <div class="main-body-menu3">
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'main-menu',
  methods: {
    goto2DMap(url) {
      this.$router.push({ path: url })
    }
  }
}
</script>
<style>
</style>