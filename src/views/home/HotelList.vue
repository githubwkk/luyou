<template>
  <Navs></Navs>
  <PersonMenu class="menu" />
  <div class="body">
    <div class="searchArea">
      <div class="searchInput">
        <button
          style=" cursor: pointer;
      border: none;
      background: none;
      color: #8b8ba7;"
          @click="fetchData"
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
          placeholder="输入要查找的酒店名称"
          required=""
          type="text"
        />
        <div class="ss">
          <el-button type="success" @click="fetchData">搜索</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="area">
        <el-form label-width="100" label-position="left">
          <el-form-item label="入住城市：">
            <el-cascader
              placeholder="请选择酒店地点"
              v-model="dtoRegion"
              :props="propsDto"
              @change="handleDtoRegionChange()"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="类型：">
            <el-radio-group
              @change="fetchData"
              v-model="queryDto.type"
              size="small"
              :key="index"
              v-for="(item, index) in tatList"
            >
              <el-radio-button :label="item.id"
                >{{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="星级酒店：">
            <el-rate
              v-model="queryDto.star"
              size="large"
              clearable
              @change="fetchData"
              :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
            />
          </el-form-item>
          <el-form-item label="酒店品牌">
            <el-select
              v-model="queryDto.brandId"
              placeholder="请选择酒店品牌"
              @change="fetchData"
              @visible-change="getBrandList"
              style="width: 200px"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="list">
      <TransitionGroup
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          class="one"
          v-for="(item, index) in list"
          :data-index="index"
          :key="index"
          @click="jump(item.id)"
        >
          <el-image :src="item.image"></el-image>
          <div class="name">{{ item.name }}</div>
          <div class="brand">
            <div class="logo">
              <el-avatar :size="17" :src="item.logo" :fit="'fill'" />
            </div>
            <div class="text">{{ item.company }}</div>
          </div>
          <div class="miniPrice">
            ￥<span>{{ item.minRoomPrice }}</span
            ><span class="q">起</span>
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            v-model:current-page="pageParams.page"
            v-model:page-size="pageParams.limit"
            :page-sizes="[8, 20, 50, 100]"
            @size-change="fetchData"
            @current-change="fetchData"
            layout="total, sizes, prev, pager, next"
            :total="total"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import Navs from '@/views/home/Navs.vue'
import { findRegionList } from '@/api/sysRegion.js'
import { GetHotelBrandList, GetHotelList } from '@/api/home/hotel.js'
import { useRouter } from 'vue-router'
import PersonMenu from '@/views/home/components/PersonMenu.vue'

const queryDto = ref({
  name: '',
  star: 0,
  brandId: ''
})
const pageParams = ref({
  page: 1,
  limit: 8
})
const user = ref()
const list = ref([])
const total = ref(0)
const tatList = ref([
  {
    id: 1,
    name: '商务型'
  },
  {
    id: 2,
    name: '民宿'
  },
  {
    id: 3,
    name: '星级酒店'
  },
  {
    id: 4,
    name: '特色酒店'
  }
])
const brandList = ref([])
const getBrandList = async () => {
  const { data } = await GetHotelBrandList()
  brandList.value = data
}
onMounted(async () => {
  await fetchData()
})
const fetchData = async () => {
  const { data } = await GetHotelList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}
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
    const { data } = await findRegionList(node.value)
    data.forEach(function(item) {
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
  fetchData()
}
const reset = () => {
  queryDto.value = {}
  dtoRegion.value = []
  fetchData()
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

.body {
  background-color: #f5f5f5;
  height: auto;
  box-sizing: border-box;
  min-height: calc(100% - 70px);

  .searchArea {
    margin: auto;
    padding: 20px 0;
    width: 1430px;
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
      padding: 10px 10px 5px 10px;
      width: 100%;
      box-sizing: border-box;
      height: 230px;
      background-color: white;
      border-radius: 3px;

      .el-radio-button {
        margin-right: 15px;
      }
    }
  }
}

.list {
  border-top: #4499ff 3px solid;
  padding: 20px 15px;
  width: 1430px;
  height: auto;
  margin: auto;
  background-color: white;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* 控制子元素在行上的对齐方式 */
  .one {
    position: relative;
    cursor: pointer;
    width: calc(25% - 20px); /* 每行两个子元素，减去间距 */
    margin-bottom: 30px; /* 设置子元素之间的间距 */
    box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
    height: 250px;
    box-sizing: border-box;

    .el-image {
      background: #f1f3f4;
      width: 330px;
      height: 180px;
    }

    .name {
      margin-left: 5px;
      font-size: 20px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
    }

    .brand {
      margin-left: 5px;
      margin-top: 10px;
      font-size: 13px;
      height: 20px;
      align-items: center;
      display: flex;

      .logo {
        width: 10px;
      }

      .el-avatar {
        margin-top: 2px;
      }

      .text {
        margin-left: 8px;
      }
    }

    .miniPrice {
      color: #ff5346;

      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0 10px 5px 0;
      font-size: 16px;

      span {
        font-size: 20px;
        font-family: Arial, serif !important;
      }

      .q {
        color: gray;
        font-size: 15px;
        font-family: 'Microsoft YaHei', 'pf', sans-serif !important;
      }
    }
  }
}

.bottom {
  width: 1630px;
}

.menu {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
