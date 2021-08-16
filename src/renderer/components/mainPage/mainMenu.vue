<template>
  <div class="main-body-menu">
    <div class="main-body-menu1">
      <div class="main-body-menu1-item">
        <img
          class="main-body-d2earth-img"
          src="~@/assets/earth.jpg"
          title="二维地图"
          @click="goto2DMap('/main/2dmap')"
        />
        <div class="main-body-menu-title">二维地图</div>
      </div>
      <div class="main-body-menu1-item">
        <img
          src="~@/assets/3dEarth.jpg"
          title="三维地图"
          @click="goto2DMap('/main/3dmap')"
        />
        <div class="main-body-menu-title">三维地图</div>
      </div>
      <div class="main-body-menu1-item">
        <img
          src="~@/assets/charts.jpg"
          title="报表工具"
          @click="goto2DMap('/main/charts')"
        />
        <div class="main-body-menu-title">报表工具</div>
      </div>
      <div class="main-body-menu1-item">
        <img
          src="~@/assets/canvas1.jpg"
          title="canvas"
          @click="goto2DMap('/main/dxmap')"
        />
        <div class="main-body-menu-title">canvas</div>
      </div>
    </div>
    <div class="main-body-menu2">
      <div
        class="main-body-menu2-item"
        title="web三维"
        @click="goto2DMap('/main/dthree')"
      >
        <img src="~@/assets/webThree.jpeg" />
        <div class="main-body-menu-title">web三维</div>
      </div>
      <div
        class="main-body-menu2-item"
        title="webassembly"
      >
        <img src="~@/assets/webassembly.jpg" />
        <div class="main-body-menu-title">webassembly</div>
      </div>
      <div
        class="main-body-menu2-item"
        title="webGL"
        @click="goto2DMap('/main/dwebgl')"
      >
        <img src="~@/assets/webGL.jpeg" />
        <div class="main-body-menu-title">webGL</div>
      </div>
      <div
        class="main-body-menu2-item"
        title="onlineTile"
        @click="goto2DMap('/main/onlineTile')"
      >
        <img src="~@/assets/onlineTile.png" />
        <div class="main-body-menu-title">影像切片</div>
      </div>
    </div>
    <!-- <div class="main-body-menu3">
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
    </div>
    <div class="main-body-menu3">
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
      <div class="main-body-menu3-item"></div>
    </div> -->
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
.main-body-menu {
  height: 90vh;
  overflow-y: auto;
}
.main-body-menu1 {
  height: 30vmin;
}

.main-body-menu1-item,
.main-body-menu2-item,
.main-body-menu3-item {
  width: 11vw;
  height: 18vh;
  float: left;
  margin-left: 12vmax;
  margin-top: 7vmin;
  border-radius: 0.8em;
  overflow: hidden;
}

.main-body-menu1-item img:hover,
.main-body-menu2-item img:hover,
.main-body-menu3-item img:hover {
  box-shadow: 6px 6px 5px #a1a1a1;
  cursor: pointer;
}

.main-body-menu1-item img,
.main-body-menu2-item img,
.main-body-menu3-item img,
.main-body-menu4-item img {
  width: 10vw;
  height: 15vh;
  margin: 0 auto;
  border-radius: 0.8em;
}

.main-body-menu2 {
  height: 30vmin;
}
.main-body-menu3 {
  height: 29vmin;
}

.main-body-menu-title {
  color: black;
  text-align: center;
  margin-left: -1vw;
}
</style>