<template>
  <div class="main">
    <div class="bg"></div>
    <div class="bg2">
      <div class="headTab">
        <el-tabs v-model="selectTab" @tab-click="handleClick">
          <el-tab-pane name="1">
            <template v-slot:label>
              <div class="tab">
                <div class="icon">
                  <svg-icon class="svg-icon" name="hotel-icons-h1"></svg-icon>
                </div>
                <div class="text">商务酒店</div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="2">
            <template v-slot:label>
              <div class="tab">
                <div class="icon">
                  <svg-icon class="svg-icon" name="hotel-icons-h2"></svg-icon>
                </div>
                <div class="text">民宿酒店</div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="3">
            <template v-slot:label>
              <div class="tab">
                <div class="icon">
                  <svg-icon class="svg-icon" name="hotel-icons-h3"></svg-icon>
                </div>
                <div class="text">星级酒店</div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="4">
            <template v-slot:label>
              <div class="tab">
                <div class="icon">
                  <svg-icon class="svg-icon" name="hotel-icons-h4"></svg-icon>
                </div>
                <div class="text">特色酒店</div>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <div class="list">
          <TransitionGroup
              @before-enter="onBeforeEnter"
              @enter="onEnter"
              @leave="onLeave"
          >
            <div class="one" :data-index="index" v-for="(item, index) in list" :key="index" @click="jump(item.id)">
              <div class="img">
                <el-image :src="item.image" :fit="'fill'"/>
              </div>
              <div class="name">{{ item.name }}</div>
              <div class="price">￥{{ item.minRoomPrice }}<span>起</span></div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import {onMounted, ref} from 'vue'
import {GetHotelHomeList} from '@/api/home/hotel.js'
import {useRouter} from "vue-router"

const selectTab = ref('1')
const list = ref()
onMounted(async () => {
  await fetchData()
})
const fetchData = async () => {
  const {data} = await GetHotelHomeList(selectTab.value)
  list.value = data
}
const handleClick = async pane => {
  list.value = []
  selectTab.value = pane.paneName
  await fetchData()
}
const router = useRouter()
const jump = async id => {
  await router.push({
    path: '/singleHotel',
    query: {
      id: id
    }
  })
}
//列表动画
const onBeforeEnter = el => {
  el.style.opacity = 0
}
const onEnter = (el, done) => {
  let delay = (el.dataset.index * 100) % 800
  setTimeout(() => {
    el.style.opacity = 1
    el.style.transition = 'opacity .2s'
    el.style.animation = 'scale-in-center .5s'
  }, delay)
}
const onLeave = (el, done) => {
  done()
}
</script>
<style scoped lang="scss">
.main {
  position: relative;
  width: 1520px;
  height: auto;
  margin: 50px auto 0;

  .bg {
    z-index: -1;
    border-radius: 40px;
    width: 90%;
    height: 450px;
    margin: 0 auto;
    background-image: url('../../../public/home/hotel.jpg');
    background-size: cover;
    background-repeat: repeat-y;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  }

  .bg2 {
    --headHeight: -125px;
    --headHeight2: 125px;
    z-index: 1;
    border-radius: 40px;
    background-color: #fdfdfd;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
    width: 1200px;
    height: 680px;
    margin: var(--headHeight) auto 0;

    .headTab {
      border-radius: 40px 40px 0 0;
      width: 100%;
      height: var(--headHeight2);
      border-bottom: black 1px solid;

      .el-tabs {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center;

        el-tab-pane {
          width: 25%;
        }
      }

      .tab {
        margin-top: 20px;
        cursor: pointer;

        .icon {
          width: 80px;
          margin: auto;

          .svg-icon {
            font-size: 50px;
          }
        }

        .text {
          text-align: center;
          margin: 5px auto 0 auto;
          font-size: 17px;
          //color: #8d8d8d;
        }
      }

      :deep {
        .el-tabs__header .el-tabs__item {
          height: 90px;
          width: 300px;
        }

        .el-tabs__nav-wrap::after {
          background-color: white;
        }

        /*未选中时字体颜色*/
        .el-tabs__item {
          color: #5b5b5b;
        }

        /*选中时字体颜色*/
        .el-tabs__item.is-active {
          color: #ff9d00;
        }

        /*选中时底边颜色*/
        .el-tabs__active-bar {
          background-color: transparent;
        }
      }
    }

    .list {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;

      .one {
        cursor: pointer;
        border: 2px solid #eee;
        box-sizing: border-box;
        height: 230px;
        width: calc(25% - 16px); /* 计算每个项目的宽度，留出一些空间 */
        margin: 8px; /* 项目之间的间距 */

        .img {
          width: 100%;
          height: 66%;
          overflow: hidden;
        }

        .el-image {
          transition: 0.8s;
          width: 100%;
          height: 100%;
        }

        .el-image:hover {
          transform: scale(1.2);
        }

        .name {
          font-size: 19px;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 8px;
          margin-top: 5px;
          font-family: 'Microsoft YaHei', sans-serif !important;
        }

        .price {
          float: right;
          margin-top: 5px;
          margin-right: 5px;
          font-size: 26px;
          color: #ff5346;

          span {
            color: #ab99a1;
            margin-left: 2px;
            font-size: 15px;
          }
        }
      }

      .one:hover {
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
      }
    }
  }
}
@-webkit-keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}
</style>
