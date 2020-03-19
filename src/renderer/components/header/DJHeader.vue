<template>
  <div class="main-header">
    <div class="main-header-logo">清洁软件</div>
    <div class="main-header-user">
      <button class="main-header-goback" @click="goBack()">返回</button>
      <!-- 下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <el-button size="small" class="toolbox">
          工具箱
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="gps">提取照片GPS</el-dropdown-item>
          <el-dropdown-item command="thumbnail">创建缩略图</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <i class="el-icon-s-home" @click="goHome()"></i>
      admin
      <i class="el-icon-s-custom"></i>
      <input
        type="file"
        id="openFile"
        style="display:none"
        webkitdirectory
        directory
        multiple
        @change="getGPSFromPhotos()"
      />
    </div>
    <!-- 解析照片GPS对话框 -->
    <el-dialog
      title="解析照片GPS数据"
      :visible.sync="dialogGPSVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="照片位置">
          <el-input class="img-gps-input" v-model="photosFolder"></el-input>
          <i class="el-icon-folder" @click="getPhotosFolder()" />
        </el-form-item>
        <el-form-item label="保存位置">
          <el-input class="img-gps-input" v-model="saveGPSFile"></el-input>
          <i class="el-icon-document" @click="getSaveTxtPath()" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogGPSVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogGPSVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="创建缩略图"
      :visible.sync="thumbnailVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="原照片位置">
          <el-input class="img-gps-input" v-model="photosFolder"></el-input>
          <i class="el-icon-folder" @click="getPhotosFolder()" />
        </el-form-item>
        <el-form-item label="缩略图保存位置">
          <el-input class="img-gps-input" v-model="saveGPSFile"></el-input>
          <i class="el-icon-folder" @click="getPhotosFolder()" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogGPSVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogGPSVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')

export default {
  name: 'dj-header',
  mounted() {
    // 渲染进程接收主进程响应回来的处理结果
    ipcRenderer.on('parseGPS', (event, arg) => {
      alert(arg)
    })
    console.log(this.$store.state.Counter.main)
    // 主进程获取到gps文件保存位置后发送save-GPS-file消息，将文件位置存入data中
    ipcRenderer.on('save-GPS-file', (event, arg) => {
      this.saveGPSFile = arg
    })
    this.openFile = document.getElementById('openFile')
  },
  data() {
    return {
      openFile: null,
      dialogGPSVisible: false,
      thumbnailVisible: false,
      photosFolder: '',
      saveGPSFile: '',
      form: {
        name: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogGPSVisible = false
      this.thumbnailVisible = false
    },
    // 返回上一层
    goBack() {
      this.$router.go(-1)
    },
    // 回到主界面
    goHome() {
      this.$router.push({ path: '/' })
    },
    // 触发文件类型input的点击事件，找到照片的文件夹
    getPhotosFolder() {
      this.openFile.click()
    },
    // 渲染进程发送消息给主进程，主进程弹出选择文件对话框，将文件位置发给渲染进程
    getSaveTxtPath() {
      ipcRenderer.send('save-file')
    },
    // 照片文件夹找确定，将其保存在data中
    getGPSFromPhotos() {
      this.photosFolder = this.openFile.files[0].path
    },
    // 向主进程请求事件，携带参数
    parseGPSFromPhotos(type) {
      switch (type) {
        case 'parseGPS':
          ipcRenderer.send('parse-photo-GPS', [
            this.photosFolder,
            this.saveGPSFile
          ])
          this.dialogGPSVisible = false
          break
        case 'close':
          this.dialogGPSVisible = false
          break
        default:
          break
      }
    },
    // 处理下拉菜单的点击事件
    handleCommand(command) {
      switch (command) {
        case 'gps':
          console.log('gps')
          this.dialogGPSVisible = true
          break
        case 'thumbnail':
          // this.thumbnailVisible = true
          ipcRenderer.send('create_thumbnail')
          console.log('thumbnail')
          break
        default:
          break
      }
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
.toolbox {
  background-color: rgb(38, 144, 231);
  margin-right: 5px;
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

.img-gps-input.el-input {
  width: 25vmax;
  margin-right: 2vmax;
}

.el-icon-document:hover,
.el-icon-folder:hover {
  cursor: pointer;
}
</style>