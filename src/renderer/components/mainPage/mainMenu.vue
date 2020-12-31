<template>
  <div>
    <div class="main-body-menu1">
      <div class="main-body-menu1-item">
        <img
          class="main-body-d2earth-img"
          src="~@/assets/earth.jpg"
          title="二维地图"
          @click="goto2DMap('/main/2dmap')"
        />
      </div>
      <div class="main-body-menu1-item">
        <img
          src="~@/assets/3dEarth.jpg"
          title="三维地图"
          @click="goto2DMap('/main/3dmap')"
        />
      </div>
      <div class="main-body-menu1-item">
        <img
          src="~@/assets/charts.jpg"
          title="报表工具"
          @click="goto2DMap('/main/charts')"
        />
      </div>
      <div class="main-body-menu1-item">
        <img
          src="~@/assets/canvas1.jpg"
          title="canvas"
          @click="goto2DMap('/main/dxmap')"
        />
      </div>
    </div>
    <div class="main-body-menu2">
      <div class="main-body-menu2-item" title="web三维" @click="goto2DMap('/main/dthree')"></div>
      <div class="main-body-menu2-item" title="webassamble">
        <img src="~@/assets/webassembly.jpg"/>
      </div>
      <div class="main-body-menu2-item" title="webGL" @click="goto2DMap('/main/dwebgl')"></div>
      <div class="main-body-menu2-item" title="onlineTile" @click="goto2DMap('/main/onlineTile')">
        <img src="~@/assets/onlineTile.png"/>
      </div>
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
.main-body-menu1 {
  height: 30vmin;
}

.main-body-menu1-item,
.main-body-menu2-item,
.main-body-menu3-item {
  width: 10vmax;
  height: 60%;
  background-color: rgba(222, 184, 135, 0.63);
  float: left;
  margin-left: 12vmax;
  margin-top: 7vmin;
  border-radius: 0.8em;
  overflow: hidden;
}

.main-body-menu1-item:hover,
.main-body-menu2-item:hover,
.main-body-menu3-item:hover {
  box-shadow: 6px 6px 5px #a1a1a1;
  cursor: pointer;
}

.main-body-menu1-item img {
  /* width: 10vmax; */
  height: 100%;
  margin: 0 auto;
  border-radius: 0.8em;
}

.main-body-menu2 {
  height: 30vmin;
}
.main-body-menu3 {
  height: 29vmin;
}
</style>