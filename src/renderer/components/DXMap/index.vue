<template>
  <div>
    <div>
      <button @click="cleanDraw('left')">向左</button>
      <button @click="cleanDraw('right')">向右</button>
      <button @click="cleanDraw('top')">向上</button>
      <button @click="cleanDraw('bottom')">向下</button>
      <button @click="cleanDraw('zoomin')">放大</button>
      <button @click="cleanDraw('zoomout')">缩小</button>
    </div>
    <div>
      <canvas id="dxmap" class="dxmap_contain" :width="windowWidth" :height="windowHeight"></canvas>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dxmap',
  data: () => {
    return {
      windowHeight: 0,
      windowWidth: 0,
      canvas: undefined,
      ctx: undefined,
      imgURL1: 'http://t4.tianditu.com/DataServer?T=vec_w&',
      imgURLAnno: 'http://t4.tianditu.com/DataServer?T=cva_w&',
      imgURL2: '&tk=b9d6abed32f12b4094773fc6985b9ea3',
      widthIMGS: 0,
      heightIMGS: 0,
      imgArray: undefined,
      imgArrayAnno: undefined,
      initWidth: 3420,
      initHeight: 1604,
      initLevel: 12
    }
  },
  mounted() {
    this.addListener()
    this.createIMG()
    this.displayIMG()
  },
  methods: {
    addListener() {
      window.onmousewheel = e => {
        console.log('mouse scroll', e)
        console.log(e.deltaY)
        if (e.deltaY > 0) {
          this.cleanDraw('zoomin')
        } else {
          this.cleanDraw('zoomout')
        }
      }
    },
    /**
     * **创建`Image`对象数组**
     * 1、获取窗口的高度与宽度，设置为canvas的长宽
     * 2、根据窗口长宽，生成Image对象的二维数组。
     */
    createIMG() {
      // 使用canvas必须复制width、height,不能再css中设置
      this.windowHeight = window.innerHeight * 0.9
      this.windowWidth = window.innerWidth
      this.canvas = document.getElementById('dxmap')
      let ctx = this.canvas.getContext('2d')
      this.ctx = ctx
      // 加载图片

      let widthIMGS = parseInt(this.windowWidth / 256) + 1
      let heightIMGS = parseInt(this.windowHeight / 256) + 1
      this.widthIMGS = widthIMGS
      this.heightIMGS = heightIMGS

      let imgArray = []
      let imgArrayAnno = []
      for (let h = 0; h < heightIMGS; h++) {
        imgArray[h] = []
        imgArrayAnno[h] = []
        for (let w = 0; w < widthIMGS; w++) {
          imgArray[h][w] = new Image()
          imgArrayAnno[h][w] = new Image()
        }
      }
      this.imgArray = imgArray
      this.imgArrayAnno = imgArrayAnno
    },
    displayIMG() {
      for (let h = 0; h < this.heightIMGS; h++) {
        let newHeight = this.initHeight + h
        for (let w = 0; w < this.widthIMGS; w++) {
          let newWidth = this.initWidth + w
          let img2 = this.imgArray[h][w]
          img2.onload = () => {
            // 绘制图像，第一个为图像对象，第二个为图片位置起始左边距离；第三个为起始上边距离；四五为影像的长宽
            this.ctx.drawImage(img2, 256 * w, 256 * h, img2.width, img2.width)
          }
          let imgUr2 =
            this.imgURL1 +
            'x=' +
            newWidth +
            '&y=' +
            newHeight +
            '&l=' +
            this.initLevel +
            this.imgURL2
          img2.src = imgUr2

          let img3 = this.imgArrayAnno[h][w]
          img3.onload = () => {
            this.ctx.drawImage(img3, 256 * w, 256 * h, img3.width, img3.width)
          }
          let imgUrl3 =
            this.imgURLAnno +
            'x=' +
            newWidth +
            '&y=' +
            newHeight +
            '&l=' +
            this.initLevel +
            this.imgURL2
          img3.src = imgUrl3
        }
      }
    },
    /**
     * **移动图片**
     */
    cleanDraw(leftOrRight) {
      switch (leftOrRight) {
        case 'left':
          this.initWidth--
          break
        case 'right':
          this.initWidth++
          break
        case 'top':
          this.initHeight--
          break
        case 'bottom':
          this.initHeight++
          break
        case 'zoomout':
          // 缩小
          this.initHeight = parseInt(this.initHeight / 2)
          this.initWidth = parseInt(this.initWidth / 2) - 1
          this.initLevel--
          break
        case 'zoomin':
          // 放大
          this.initHeight = this.initHeight * 2 + 1
          this.initWidth = this.initWidth * 2 + 1
          this.initLevel++
          break
        default:
          break
      }
      this.displayIMG()
    },
    coordinate2tileName() {}
  }
}
</script>
<style>
.dxmap_contain {
  background-color: rgba(137, 43, 226, 0.493);
}
</style>