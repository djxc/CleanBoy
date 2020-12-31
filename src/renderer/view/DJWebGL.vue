<template>
  <div>
    <label>webgl</label>
    <div>
        <img id="imgID"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'djwebgl',
  mounted() {
    this.getImage()
  },
  methods: {
    getImage() {
      console.log('djxc')
      fetch('http://localhost:3001/onlineTile/gdal', {
        method: 'GET'
      }).then(res => res.text())
        .then((data) => {
          let img: any = document.getElementById('imgID')
          if (img) {
            img.src = data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})
</script>

<style>
</style>