<template>
  <el-carousel height="780px" motion-blur :interval="10000">
    <el-carousel-item v-for="item in imgList" :key="item" class="img-list">
      <img :src="item" alt="" />
    </el-carousel-item>
  </el-carousel>
</template>
<script setup>
const imgList = [
  '../../../public/banner/banner1.jpg',
  '../../../public/banner/banner2.jpg',
  '../../../public/banner/banner3.jpg',
  '../../../public/banner/banner4.jpg'
]
</script>
<style scoped lang="scss">
.img-list {
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
