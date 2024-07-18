<script setup>
import { onMounted, ref } from 'vue'
import { GetTAList } from '@/api/home/tourist.js'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useRouter } from 'vue-router'

const animate = ref(false)
const currentIndex = ref(0)
const description = ref([])
const changeCampus = val => {
  currentIndex.value = val
  animate.value = true
  setTimeout(() => {
    animate.value = false
  }, 1500)
}

const list = ref([])
onMounted(async () => {
  const { data } = await GetTAList(1, 5, null)
  list.value = data.records
  //处理照片url
  list.value.forEach(item => {
    item.photoUrls = item.photoUrls.split(',')
  })
  list.value.forEach(item => {
    description.value.push(item.description)
  })
})
const router = useRouter()
const jump = id => {
  router.push({
    path: '/singleTourist',
    query: {
      id: id
    }
  })
}
const removeProvinceCityDistrict = str => {
  // 去掉省
  str = str.replace(/省/g, '')
  // 去掉市
  str = str.replace(/市/g, '')
  // 去掉区
  str = str.replace(/自治区/g, '')
  str = str.replace(/区/g, '')
  return str
}
</script>

<template>
  <div class="main">
    <el-row justify="space-evenly">
      <el-col :span="12">
        <el-carousel
          @change="changeCampus"
          arrow="never"
          :interval="4000"
          ref="carouselRef"
          autoplay
          type="card"
          indicator-position="none"
          height="400px"
          style="width:600px;margin:0 auto;"
        >
          <el-carousel-item v-for="(item, index) in list" :key="item">
            <div
              class="medium"
              :class="[
                index === (currentIndex - 1 + 5) % 5
                  ? 'leftCls'
                  : index === (currentIndex + 1) % 5
                  ? 'rightCls'
                  : ''
              ]"
            >
              <div class="a">
                <div class="position" @click="jump(item.id)">
                  <svg-icon class="svg" name="Location"></svg-icon>
                  <div
                    class="text"
                    v-if="
                      removeProvinceCityDistrict(item.region1Name) ===
                        removeProvinceCityDistrict(item.region2Name)
                    "
                  >
                    {{ removeProvinceCityDistrict(item.region1Name) }}&nbsp;{{
                      removeProvinceCityDistrict(item.region3Name)
                    }}
                  </div>
                  <div v-else class="text">
                    {{ removeProvinceCityDistrict(item.region1Name) }}&nbsp;{{
                      removeProvinceCityDistrict(item.region2Name)
                    }}
                  </div>
                </div>
                <img :src="item.photoUrls[0]" alt="" />
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="12">
        <div class="description" :class="{ animated: animate }">
          {{ description[currentIndex] }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 1520px;
  margin: 10px auto 0;

  .description {
    font-family: '新宋体', '宋体', sans-serif !important;
    font-size: 39px;
    margin-top: 35px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
  }
}

.animated {
  /* 定义动画效果 */
  animation: slide-in-left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.medium {
  width: 0px;
  height: 100%;

  .a {
    margin: auto;
    height: 100%;

    .position {
      transition: opacity 1.5s ease-in;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;

      .svg {
        font-size: 85px;
      }

      .text {
        margin-top: 5px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-size: 32px;
      }
    }

    .position:hover {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.89);
    }

    img {
      border-radius: 25px;
      height: 100%;
      width: 300px;
      background-size: cover;
    }
  }
}

.medium .a :deep {
  .el-carousel__item.el-carousel__item--card.is-in-stage {
    background: #fff !important;
  }
}

:deep {
  .el-carousel__item.el-carousel__item--card.is-in-stage .medium.rightCls {
    transform: translateX(20%) scale(1) !important;

    .position {
      transition: none;
      opacity: 0;
    }
  }
}

:deep {
  .el-carousel__item.el-carousel__item--card.is-in-stage .medium.leftCls {
    transform: translateX(-12%) scale(1) !important;

    .position {
      transition: none;
      opacity: 0;
    }
  }
}

:deep {
  .el-carousel__arrow {
    border-radius: 0 !important;
    background: #3a5fc9 !important;
  }
}

//:deep {
//  .el-carousel__arrow--left {
//    left: calc(21.5%) !important;
//  }
//}
//
//:deep {
//  .el-carousel__arrow--right {
//    right: calc(21.5%) !important;
//  }
//}

/* ----------------------------------------------
 * Generated by Animista on 2024-4-10 16:38:6
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-left
 * ----------------------------------------
 */
@-webkit-keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
