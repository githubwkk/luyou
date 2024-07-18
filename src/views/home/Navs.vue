<template>
  <div class="nav">
    <el-row>
      <el-col :span="navSpan" :class="{ slideRight: navAnimation }">
        <ul>
          <li>
            <router-link to="/">首页</router-link>
          </li>
          <li>
            <router-link to="/TouristListHome">旅行景点</router-link>
          </li>
          <li>
            <router-link to="/HotelListHome">经典酒店</router-link>
          </li>
          <li>
            <router-link to="/ArticleListHome">游玩攻略</router-link>
          </li>
          <li>
            <router-link to="/photoWaterFall">风景图库</router-link>
          </li>
          <li>
            <router-link to="/CouponList">优惠中心</router-link>
          </li>
        </ul>
      </el-col>
      <!--搜索框-->
      <transition name="search" @after-leave="onAfterLeave">
        <el-col :span="6" v-show="serviceShow">
          <div class="rightArea">
            <div class="searchPanel">
              <div class="search">
                <div>
                  <el-select-v2 v-model="keyword"
                                filterable
                                remote
                                value-key="value"
                                :loading="selectLoading"
                                :props="selectProps"
                                :options="options"
                                :remote-method="remoteMethod"
                                @blur="setKeyword"
                  >
                    <template #default="{ item }">
                      <span style="margin-right: 8px" @click.stop="jumpOne(item.id)">{{ item.name
                        }}</span>
                    </template>
                  </el-select-v2>
                </div>
                <div>
                  <button @click="searchArticle" class="SendButton">
                    <el-icon>
                      <Search />
                    </el-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </transition>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { SearchArticle } from '@/api/home/article'
import { onMounted, ref, watch } from 'vue'
import { ListItem } from 'element-plus'
import { View } from '@/api/home/article.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const navAnimation = ref(false)
const navSpan = ref(24)
const serviceShow = ref(false)
const headerHeight = ref(200)
//接受父组件传的值(默认true)(关闭banner)

const FaSearchShow = ref(false)
const props = defineProps({
  showBanner: { type: Boolean }
})
FaSearchShow.value = props.showBanner
watch(props, (newValue, oldValue) => {
  FaSearchShow.value = newValue.showBanner
  if (!FaSearchShow.value) {
    navSpan.value = 18
    serviceShow.value = true
  } else {
    serviceShow.value = false
  }
})
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
const handleScroll = () => {
  // 获取页面滚动的距离
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop
  if (!FaSearchShow.value) {
    navSpan.value = 18
    serviceShow.value = true
  } else if (scrollTop >= 280) {
    navSpan.value = 18
    serviceShow.value = true
  } else {
    serviceShow.value = false
  }
}
const onAfterLeave = () => {
  navSpan.value = 24
  navAnimation.value = true
  setTimeout(() => {
    navAnimation.value = false
  }, 200)
}
//打开单个新闻
const jumpOne = async id => {
  await View(id)
  await router.push({
    path: '/singleArticle',
    query: {
      id: id
    }
  })
}
//搜索栏
const selectLoading = ref(false)
const keyword = ref('')
const selectProps = {
  label: 'name',
  value: 'id'
}
const options = ref<ListItem[]>([])
const remoteMethod = async (query: string) => {
  if (query !== '') {
    selectLoading.value = true
    setTimeout(async () => {
      selectLoading.value = false
      const { data } = await SearchArticle(query)
      options.value = data
    }, 200)
  } else options.value = []
}
//搜索关键词
const searchArticle = async () => {
  await router.push({
    path: '/ArticleListHome',
    query: {
      keyword: keyword.value
    }
  })
}
//
const setKeyword = (e) => {
  keyword.value = e.target.value
}

</script>
<style scoped lang="scss">
.head {
  width: 100%;
  height: 50px;
  background-color: rgba(3, 169, 244, 0.32);
  transition: fade-in 5.5s;
}

ul,
ol {
  list-style: none;
  margin: 0;
}

.nav {
  box-shadow: 0 1px 3px hsla(0, 0%, 7%, 0.1);
  font-size: 17px;
  height: 70px;
  width: 100%;
  //background-color: rgba(151, 190, 185, 0.25);

  ul {
    width: 80%;
    height: 100%;
    overflow: hidden;
    margin-left: 10%;

    li {
      width: 16%;
      float: left;

      a {
        display: block;
        height: 100%;
        line-height: 70px;
        text-align: center;
        font-weight: bold;
        color: #8491a5;
      }
    }
  }

  .rightArea {
    margin-right: 100px;

    .searchPanel {
      height: 70px;
      width: 100%;

      padding: 12px 0;

      .search {
        display: flex;


        :deep {
          .el-select__wrapper {
            box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
            rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
            border: none;
            border-radius: 35px;
            width: 350px;
            height: 45px;
            font-size: 14px;
          }
        }

        .SendButton {
          border: none;
          cursor: pointer;
          position: absolute;
          margin-left: -65px;
          margin-top: -2px;
          background-color: #ff385c;
          width: 38px;
          height: 38px;
          transform: translate(20px, 5px);
          border-radius: 50px;
          transition: 0.3s;

          .el-icon {
            color: white;
            position: relative;
            top: 2px;
            font-size: 19px;
          }
        }
      }
    }
  }

  .search-enter-active {
    animation: scale-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .search-leave-active {
    animation: fade-out-bck 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .search-enter-to,
  .search-leave-to {
    opacity: 0;
  }
}

/**
 * ----------------------------------------
 * animation scale-in-top
 * ----------------------------------------
 */
@-webkit-keyframes scale-in-top {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 50% 0%;
    transform-origin: 50% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 50% 0%;
    transform-origin: 50% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-top {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 50% 0%;
    transform-origin: 50% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 50% 0%;
    transform-origin: 50% 0%;
    opacity: 1;
  }
}

/* ----------------------------------------------
 * Generated by Animista on 2024-4-7 0:7:46
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-out-bck
 * ----------------------------------------
 */
@-webkit-keyframes fade-out-bck {
  0% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateZ(-80px);
    transform: translateZ(-80px);
    opacity: 0;
  }
}

@keyframes fade-out-bck {
  0% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateZ(-80px);
    transform: translateZ(-80px);
    opacity: 0;
  }
}

.slideRight {
  animation: fade-in 0.1s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2024-4-7 0:53:7
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-in
 * ----------------------------------------
 */
@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
