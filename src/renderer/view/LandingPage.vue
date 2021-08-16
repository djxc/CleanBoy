
<!--
@FileDescription 系统登录界面
@Author small dj
@Date 2020-12-12
@LastEditor small dj
@LastEditTime 2020-12-12 18:21 
 -->
<template>
  <div id="wrapper">
    <div class="left-side">
      <span class="title">
        CleanBoy 通用应用平台
      </span>
      <!-- <system-information></system-information> -->
      <div class="doc">
        <p>
          采用electron+vue+element构建桌面系统
        </p>
      </div>
      <div class="login-input">
        <div class="login-input-info"> 用户名: <input placeholder="请输入用户名" /></div>
        <div class="login-input-info"> 密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:
          <input
            type="password"
            placeholder="请输入密码"
          />
        </div>
        <button @click="login()">登录系统</button><br><br>

        <!-- <button class="alt" @click="test()">点击</button> -->
        <!-- <button class="alt" @click="sayHello()">Hello World</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import SystemInformation from '@/components/LandingPage/SystemInformation'

export default {
  name: 'landing-page',
  components: { SystemInformation },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    sayHello() {
      alert('欢迎')
    },
    test() {
      console.log(process)
    },
    // 页面跳转
    login() {
      this.$router.push({ path: '/main' })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  /* background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      ); */
  height: 100vh;
  /* padding: 60px 80px; */
  width: 100vw;
  background: url('~@/assets/background.jpeg') center no-repeat;
  background-size: 100% 100%;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  position: absolute;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 0.4em;
  width: 32vw;
  left: 34vw;
  top: 30vh;
  padding: 50px 10px 10px 10px;
  background-color: rgba(240, 248, 255, 0.401);
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 15px;
  margin-bottom: 10px;
}
.doc {
  margin-top: 5px;
}
.doc p {
  color: black;
  margin-bottom: 10px;
}

.login-input button {
  margin-top: 15px;
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.45em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.login-input button:hover {
  background-color: #78e4b3;
}

.login-input button.alt {
  color: #42b983;
  background-color: transparent;
}
.login-input {
  width: 60%;
  margin-left: 20%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 0.2em;
}

.login-input input {
  margin-bottom: 5px;
  background-color: transparent;
  border: solid;
  border-color: rgb(66, 66, 66);
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 2px;
  margin-left: 10px;
  outline: none;
  padding-left: 5px;
}

.login-input-info {
  margin-bottom: 10px;
}
</style>
