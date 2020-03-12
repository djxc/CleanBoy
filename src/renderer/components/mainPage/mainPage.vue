<template>
  <!-- 程序的主界面 -->
  <div>
    <div class="main-header">
      <div class="main-header-logo">清洁软件</div>
      <div class="main-header-user">
        <i class="el-icon-s-home" @click="goHome()"></i>
        <button class="main-header-goback" @click="goBack()">返回</button>
        admin
        <i class="el-icon-s-custom"></i>
      </div>
    </div>
    <div class="main-body">
      <router-view></router-view>
    </div>
    <div class="main-footer">footer</div>
  </div>
</template>

<script>
export default {
  name: 'mainPage',
  methods: {
    // 返回上一层
    goBack() {
      this.$router.go(-1)
    },
    // 回到主界面
    goHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
.main-header {
  height: 6vmin;
  color: white;
  background-color: rgb(38, 144, 231);
  box-shadow: 1px 6px 3px rgb(196, 193, 193);
}
.main-header-logo {
  float: left;
  line-height: 6vmin;
  margin-left: 1vmin;
  font-weight: bold;
}
.main-header-user {
  float: right;
  line-height: 6vmin;
  margin-right: 1vmin;
}

.main-header-goback {
  background-color: white;
  border: none;
  border-radius: 0.2em;
  padding: 2px;
  margin: auto 1vmin auto 1vmin;
}
.main-header-goback:hover {
    cursor: pointer;
}

.el-icon-s-custom,
.el-icon-s-home {
  font-size: 1.2em;
  margin-right: 1vmin;
}

.el-icon-s-custom:hover,
.el-icon-s-home:hover {
  cursor: pointer;
}

.main-body {
  height: 90vmin;
  /* background-color: rgb(39, 37, 35); */
}
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
  /* width: 100%; */
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

.main-footer {
  height: 4vmin;
  background-color: rgb(50, 51, 50);
  color: aquamarine;
}
</style>

<style scoped>
/* scoped说明该样式只在该组件中使用，不会污染其他组件。 */
</style>