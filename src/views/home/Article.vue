<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/views/home/Footer.vue'

const router = useRouter() // 使用路由k
const list = ref([
  {
    name: '品湖韵',
    url: '../../../public/article/type1.png',
    type: 2
  },
  {
    name: '登名山',
    url: '../../../public/article/type2.png',
    type: 3
  },
  {
    name: '游海岛',
    url: '../../../public/article/type3.png',
    type: 4
  },
  {
    name: '游天下',
    url: '../../../public/article/type2.png',
    type: 5
  },
  {
    name: '赏风情',
    url: '../../../public/article/type6.png',
    type: 6
  },
  {
    name: '领文化',
    url: '../../../public/article/type6.png',
    type: 7
  },
  {
    name: '忆乡愁',
    url: '../../../public/article/type3.png',
    type: 8
  },
  {
    name: '寻美食',
    url: '../../../public/article/type5.png',
    type: 9
  },
  {
    name: '寻新意',
    url: '../../../public/article/type7.png',
    type: 10
  },
  {
    name: '养身心',
    url: '../../../public/article/type9.png',
    type: 11
  }
])
const jump = type => {
  router.push({
    path: '/ArticleListHome',
    query: {
      type: type
    }
  })
}
</script>

<template>
  <div class="main">
    <div class="category">
      <div class="one" v-for="item in list" :key="item.name">
        <div @click="jump(item.type)">
          <img :src="item.url" alt="" />
          <div class="mask">
            <div class="title">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped lang="scss">
ul,
ol {
  list-style: none;
  margin: 0;
}

.main {
  width: 1520px;
  height: 600px;
  margin: 20px auto 0;

  //.titletype {
  //  width: 35%;
  //  margin: 30px auto 0;
  //}
  //
  //.titletype > img {
  //  width: 100%;
  //}

  .category {
    width: 100%;
    display: flex;
    flex-wrap: wrap; /* 允许图片换行 */
    justify-content: space-between; /* 让图片间隔相等 */
    .one {
      cursor: pointer;
      position: relative;
      width: calc(20% - 10px); /* 让图片容器宽度为容器宽度的一半，减去间隔 */
      height: 100%;
      margin-bottom: 15px; /* 设置图片间距 */
      img {
        border-radius: 2px;
        width: 100%;
        height: 100%;
      }

      .mask {
        border-radius: 2px;
        position: absolute;
        transition: all 0.5s;
        opacity: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 97%;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);

        .title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%); /* 居中文字 */
          color: white;
          z-index: 1;
        }
      }
    }

    .one:hover {
      .mask {
        opacity: 0;
      }
    }
  }
}
</style>
