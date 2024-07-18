<template>
  <Navs></Navs>
  <PersonMenu class="menu"/>
  <div class="body">
    <div class="searchArea">
      <div class="searchInput">
        <button
            style=" cursor: pointer;
      border: none;
      background: none;
      color: #8b8ba7;"
            @click="fetchData2"
        >
          <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
          >
            <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                stroke-width="1.333"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <input
            v-model="queryDto.name"
            class="input"
            placeholder="输入要查找的景点名称"
            required=""
            type="text"
        />
        <div class="ss">
          <el-button type="success" @click="fetchData2">搜索</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </div>

      <div class="area">
        <el-form label-width="100" label-position="left">
          <el-form-item label="地区：">
            <el-cascader
                placeholder="请选择景点区域"
                v-model="dtoRegion"
                :props="propsDto"
                @change="handleDtoRegionChange()"
                style="width: 200px"
            />
          </el-form-item>
          <el-form-item label-width="100" label="距离（您）">
            <el-select v-model="queryDto.radius" style="width: 200px" @change="fetchData2()">
              <el-option v-for="item in KMList"
                         :key="item.value"
                         :value="item.value"

                         :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：">
            <el-radio-group
                @change="fetchData2"
                v-model="queryDto.tid"
                size="small"
                :key="index"
                v-for="(item, index) in tatList"
            >
              <el-radio-button :label="item.id"
              >{{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="等级：">
            <el-radio-group
                @change="fetchData2"
                v-model="queryDto.grade"
                size="small"
                :key="index"
                v-for="(item, index) in gradeOptions"
            >
              <el-radio-button :label="item.value"
              >{{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评分：">
            <el-radio-group
                @change="fetchData2"
                v-model="queryDto.rating"
                size="small"
                :key="index"
                v-for="(item, index) in ratingOptions"
            >
              <el-radio-button :label="item.value"
              >{{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开放时间：">
            <el-time-select
                @change="fetchData2"
                placeholder="景点开放时间"
                v-model="queryDto.openingHours"
                :max-time="queryDto.closingHours"
                start="00:00"
                step="00:05:00"
                end="24:00"
                format="HH:mm:ss"
                style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="关闭时间：">
            <el-time-select
                @change="fetchData2"
                placeholder="景点关闭时间"
                v-model="queryDto.closingHours"
                :min-time="queryDto.openingHours"
                start="00:00"
                step="00:05"
                end="24:00"
                format="HH:mm:ss"
                style="width: 200px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div
        class="list"
        v-infinite-scroll="onLoad"
        :infinite-scroll-distance="0"
        :infinite-scroll-delay="600"
        :infinite-scroll-immediate="false"
    >
      <TransitionGroup
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
      >
        <div
            class="one"
            @click="jump(item.id)"
            v-for="(item, index) in list"
            :data-index="index"
            :key="index"
        >
          <div class="img">
            <img :src="item.photoUrl" alt=""/>
          </div>

          <div class="title">
            {{
              item.name
            }}<span>[{{ item.region1Name }}·{{ item.region2Name }}]</span>
          </div>
          <div v-if="item.grade >= 2" class="grade">
            <span>{{ item.grade }}A景点</span>
          </div>
          <div class="address">地址：{{ item.address }}</div>
          <div class="time">
            开放时间： {{ formattedTime(item.openingHours) }} -
            {{ formattedTime(item.closingHours) }}
          </div>
          <div class="bottom">
            <div class="distance">
              <div>
                <el-icon>
                  <Location/>
                </el-icon>
                {{ item.distance.toFixed(2) }}千米
              </div>
            </div>
            <div>
              <div class="price" style="display: flex">
                <span
                    v-if="item.ticketPrice === 0"
                    style="color: rgba(128,128,128,0.84);font-size: 32px"
                >免费</span
                >
                <span v-else> ￥{{ item.ticketPrice }}</span>
                <div class="btn">
                  <button>查看详情</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
      <p v-if="loading" style="margin:20px auto;width: 100px;color: gray">
        <el-icon>
          <Loading/>
        </el-icon>
        Loading...
      </p>
      <el-divider v-if="finished">
        No More
      </el-divider>
    </div>
  </div>
</template>
<script setup>
import Navs from '@/views/home/Navs.vue'
import {onBeforeMount, onMounted, ref} from 'vue'
import {findRegionList} from '@/api/sysRegion.js'
import {GetAllTAT} from '@/api/touristAttractionsType.js'
import {GetTAList} from '@/api/home/tourist.js'
import {useRouter} from 'vue-router'
import PersonMenu from '@/views/home/components/PersonMenu.vue'
import {Location} from '@element-plus/icons-vue'
import {userLocationPinia} from '@/pinia/modules/userLocation.js'

const noPic = new URL('@/assets/no_pic.png', import.meta.url)
const pageParams = ref({
  page: 0,
  limit: 8
})

//搜索数据表单模型
const queryDto = ref({
  name: null,
  tid: null,
  rating: null,
  grade: null,
  openingHours: null,
  closingHours: null,
  region1Id: null,
  region2Id: null,
  region3Id: null,
  myLat: 0,
  myLng: 0,
  radius: null
})
//类型
const tatList = ref()
//距离km
const KMList = ref([
  {value: 1, label: '1千米'},
  {value: 2, label: '2千米'},
  {value: 5, label: '5千米'},
  {value: 8, label: '8千米'},
  {value: 10, label: '10千米'},
  {value: 20, label: '20千米'},
  {value: 50, label: '50千米'},
  {value: 100, label: '100千米'},
  {value: 200, label: '200千米'},
  {value: 300, label: '300千米'},
  {value: 500, label: '500千米'},
  {value: 1000, label: '1000千米'},
])
//等级
const gradeOptions = ref([
  {value: 1, label: '1A'},
  {value: 2, label: '2A'},
  {value: 3, label: '3A'},
  {value: 4, label: '4A'},
  {value: 5, label: '5A'}
])
//评分
const ratingOptions = ref([
  {value: 5, label: '5-4'},
  {value: 4, label: '4-3'},
  {value: 3, label: '3-2'},
  {value: 2, label: '2-1'},
  {value: 1, label: '1-0'}
])
//地区
const dtoRegion = ref([])
const propsDto = {
  lazy: true,
  checkStrictly: true,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {
    // 加载数据的方法
    if (typeof node.value == 'undefined') node.value = 0
    const {data} = await findRegionList(node.value)
    data.forEach(function (item) {
      //hasChildren判断是否有子节点
      item.leaf = !item.hasChildren
    })
    resolve(data) // 返回数据
  }
}
const handleDtoRegionChange = () => {
  if (dtoRegion.value.length === 1) {
    queryDto.value.region1Id = dtoRegion.value[0]
  } else if (dtoRegion.value.length === 2) {
    queryDto.value.region1Id = dtoRegion.value[0]
    queryDto.value.region2Id = dtoRegion.value[1]
  } else if (dtoRegion.value.length === 3) {
    queryDto.value.region1Id = dtoRegion.value[0]
    queryDto.value.region2Id = dtoRegion.value[1]
    queryDto.value.region3Id = dtoRegion.value[2]
  }
  fetchData2()
}
const userLocation = userLocationPinia()
onMounted(async () => {
  queryDto.value.myLng = userLocation.myPosition.longitude
  queryDto.value.myLat = userLocation.myPosition.latitude
  //类型
  const {data} = await GetAllTAT()
  tatList.value = data
  await fetchData2()
})

const reset = () => {
  list.value = []
  queryDto.value = {
    name: null,
    tid: null,
    rating: null,
    grade: null,
    openingHours: null,
    closingHours: null,
    region1Id: null,
    region2Id: null,
    region3Id: null,
    radius: null
  }
  dtoRegion.value = []
  fetchData()
}
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const onLoad = async () => {
  if (finished.value === false) {
    loading.value = true
    pageParams.value.page = pageParams.value.page + 1
    await fetchData()
  }
}
const fetchData2 = async () => {
  list.value = []
  pageParams.value.page = 1
  await fetchData()
}
const fetchData = async () => {
  finished.value = false
  const {data} = await GetTAList(
      pageParams.value.page,
      pageParams.value.limit,
      queryDto.value
  )
  if (data.records.length > 0) {
    list.value = list.value.concat(data.records)
    //处理照片url
    list.value.forEach(item => {
      // 将照片URLs字符串拆分为数组，并选择第一张照片URL
      if (item.photoUrls !== null && item.photoUrls !== '') {
        const photoUrlsArray = item.photoUrls.split(',')
        item.photoUrl = photoUrlsArray.length > 0 ? photoUrlsArray[0] : null
      } else {
        item.photoUrl = noPic
      }
    })
    loading.value = false
    //最后一夜
    if (data.records.length < pageParams.value.limit) {
      finished.value = true
    }
  } else {
    //没数据
    loading.value = false
    finished.value = true
  }
}
const formattedTime = d => {
  let date = new Date('1970-01-01T' + d + 'Z')
  let hours = date.getHours()
  let minutes = date.getMinutes()
  return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
}
const router = useRouter()
const jump = async id => {
  await router.push({
    path: '/singleTourist',
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
.menu {
  position: absolute;
  top: 10px;
  right: 20px;
}

.body {
  background-color: #f5f5f5;
  height: auto;

  .searchArea {
    margin: auto;
    padding: 20px 0;
    width: 1200px;
    height: auto;

    .ss {
      width: 200px;
      z-index: 33;
      position: absolute;
      margin-left: 330px;
    }

    /* styling of whole input container */
    .searchInput {
      --timing: 0.3s;
      --width-of-input: 300px;
      --height-of-input: 40px;
      --border-height: 2px;
      --input-bg: #fff;
      --border-color: #2f2ee9;
      --border-radius: 30px;
      --after-border-radius: 1px;
      position: relative;
      width: var(--width-of-input);
      height: var(--height-of-input);
      display: flex;
      align-items: center;
      padding-inline: 0.8em;
      border-radius: var(--border-radius);
      transition: border-radius 0.5s ease;
      background: var(--input-bg, #fff);
    }

    /* styling of Input */
    .input {
      font-size: 0.9rem;
      background-color: transparent;
      width: 100%;
      height: 100%;
      padding-inline: 0.5em;
      padding-block: 0.7em;
      border: none;
    }

    /* styling of animated border */
    .searchInput:before {
      content: '';
      position: absolute;
      background: var(--border-color);
      transform: scaleX(0);
      transform-origin: center;
      width: 100%;
      height: var(--border-height);
      left: 0;
      bottom: 0;
      border-radius: 1px;
      transition: transform var(--timing) ease;
    }

    /* Hover on Input */
    .searchInput:focus-within {
      border-radius: var(--after-border-radius);
    }

    input:focus {
      outline: none;
    }

    /* here is code of animated border */
    .searchInput:focus-within:before {
      transform: scale(1);
    }

    /* sizing svg icons */
    .searchInput svg {
      width: 17px;
      margin-top: 3px;
    }

    .area {
      border-top: #00bf6c solid 2px;
      margin-top: 20px;
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
      height: auto;
      background-color: white;
      border-radius: 3px;

      .el-radio-button {
        margin-right: 15px;
      }
    }
  }

  .list {
    padding: 20px 15px;
    width: 1200px;
  min-height: 410px;

    margin: auto;
    background-color: white;
    box-sizing: border-box;
    border-radius: 3px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; /* 控制子元素在行上的对齐方式 */
    .one {
      cursor: pointer;
      width: calc(50% - 10px); /* 每行两个子元素，减去间距 */
      margin-bottom: 20px; /* 设置子元素之间的间距 */
      box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
      height: 200px;
      padding: 10px;
      box-sizing: border-box;

      .img img {
        float: left;
        width: 210px;
        height: 120px;
        border-radius: 2px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
        rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
      }

      .title,
      .grade,
      .address,
      .time {
        margin: 1px 0 3px 10px;
      }

      .title {
        width: calc(100% - 230px);
        font-size: 25px;
        color: #409eff;
        float: left;
        white-space: nowrap; /* 禁止换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 使用省略号表示被隐藏的文本 */
        span {
          margin-left: 10px;
          color: gray;
          font-size: 15px;
        }
      }

      .grade {
        font-size: 13px;
        color: orange;
        border: orange 1.5px solid;
        padding: 1px 5px;
        border-radius: 5px;
        float: left;
      }

      .address {
        width: calc(100% - 220px);
        float: left;
        font-size: 13px;
        color: #666666;
        white-space: nowrap; /* 禁止换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 使用省略号表示被隐藏的文本 */
      }

      .time {
        color: #666666;
        float: left;
        margin-bottom: 0;
      }

      .bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .distance {
          color: #666666;
          margin-top: 10px;
        }

        .price {
          width: auto;
          font-size: 25px;
          color: #ff6633;

          span {
            font-size: 34px;
          }
        }

        .btn button {
          cursor: pointer;
          width: auto;
          margin-left: 10px;
          margin-top: 5px;
          height: 40px;
          background-color: #ff7800;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 3px;
        }
      }
    }
  }
}

/**
 * ----------------------------------------
 * animation scale-in-center
 * ----------------------------------------
 */
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
