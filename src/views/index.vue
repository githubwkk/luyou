<template>
  <div class="body">
    <transition name="el-zoom-in-top">
      <Banner v-show="showBanner"></Banner>
    </transition>
    <Navs :showBanner="showBanner"></Navs>
    <div class="splitTitle">
      <span>热门景点</span>
    </div>
    <Tourist></Tourist>
    <div class="splitTitle">
      <span>热门酒店</span>
      <div class="str">
        <router-link to="/HotelListHome">更多</router-link>
      </div>
    </div>
    <Hotel></Hotel>
    <div class="splitTitle">
      <span>全国预览</span>
    </div>
    <keep-alive>
      <Map key="12"/>
    </keep-alive>

    <div class="splitTitle">
      <span>旅行攻略</span>
      <div class="str">
        <router-link to="/ArticleListHome">更多</router-link>
      </div>
    </div>
    <Article></Article>
    <div class="change-lang">
      <div class="container">
        <!--        语言-->
        <change-lang v-show="langShow"/>
        <!-- 右上角用户下拉菜单组件    -->
        <PersonMenu @changeMode="switchModeOfParent"/>
      </div>
    </div>
    <router-view></router-view>
  </div>

  <el-popover :width="900" trigger="click" placement="left-start">
    <template #reference>
      <svg-icon name="ai" id="ai"></svg-icon>
    </template>
    <template #default>
      <AiBot/>
    </template>
  </el-popover>

</template>
<script setup>
import {onBeforeMount, ref} from 'vue'
import Banner from '@/views/home/Banner.vue'
import Article from '@/views/home/Article.vue'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import Navs from '@/views/home/Navs.vue'
import Tourist from '@/views/home/Tourist.vue'
import Hotel from '@/views/home/Hotel.vue'

import AiBot from '@/views/home/components/AiBot.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import PersonMenu from '@/views/home/components/PersonMenu.vue'
import {userLocationPinia} from '@/pinia/modules/userLocation.js'
import Map from '@/views/home/Map.vue'

const userLocation = userLocationPinia()
onBeforeMount(() => {
  userLocation.fetchLocation()
})
const showBanner = ref(true)
const langShow = ref(true)
const switchModeOfParent = () => {
  showBanner.value = !showBanner.value
  langShow.value = !langShow.value
}
</script>
<style scoped lang="scss">
.body {
  .router-link-active {
    text-decoration: none;
    color: yellow;
  }

  a {
    color: red;
  }

  height: 3000px;

  .splitTitle {
    display: flex;
    justify-content: space-between; /* 将子元素分散对齐 */
    align-items: center; /* 垂直居中 */
    width: 1500px;
    margin: 60px auto 20px;
    font-size: 28px;
    color: #333;
    font-weight: bolder;

    .str {
      font-size: 22px;
      font-weight: normal;
      color: #73afbd;
      float: right;

      .router-link-active {
        text-decoration: none;
        color: #73afbd;
      }

      a {
        text-decoration: none;
        color: #73afbd;
      }
    }

    .str:hover {
      cursor: pointer;
      color: #409eff;

      a {
        text-decoration: none;
        color: #409eff;
      }
    }
  }
}

#ai {
  position: fixed;
  font-size: 40px;
  right: 10px;
  bottom: 20px;
  color: #73afbd;
  cursor: pointer;
  transition: all 0.5s;
}

.el-popover {
  animation: slide-in-fwd-br 10s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes slide-in-fwd-br {
  0% {
    -webkit-transform: translateZ(-1400px) translateY(800px) translateX(1000px);
    transform: translateZ(-1400px) translateY(800px) translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0) translateY(0) translateX(0);
    transform: translateZ(0) translateY(0) translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-fwd-br {
  0% {
    -webkit-transform: translateZ(-1400px) translateY(800px) translateX(1000px);
    transform: translateZ(-1400px) translateY(800px) translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0) translateY(0) translateX(0);
    transform: translateZ(0) translateY(0) translateX(0);
    opacity: 1;
  }
}

.container {
  display: flex;
}

.change-lang {
  position: absolute;
  right: 10px;
  top: 30px;

  :deep {
    .change-lang {
      height: 20px;
      top: -3px;
      position: relative;

      &:hover {
        background: none;
      }

      .icon {
        font-size: 22px;
        color: #fff;
      }
    }
  }
}
</style>
