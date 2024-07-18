<template>
  <Navs></Navs>
  <!--  右上角菜单-->
  <div class="menu">
    <PersonMenu />
  </div>
  <div class="top">
    <div class="tabs">
      <el-tabs v-model="selectTab" @tab-click="handleClick">
        <el-tab-pane disabled>
          <template v-slot:label>
            <router-link style="color: #5B5B5B" to="/">
              <div class="oneTab">
                <svg-icon class="el-icon" name="back" />
              </div>
            </router-link>
          </template>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="gl" />
              <span>找攻略</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="2">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="water" />
              <span>品湖韵</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="3">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="icon-mountains" />
              <span>登名山</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="4">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="island" />
              <span>游海岛</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="5">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="world" />
              <span>玩天下</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="6">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="mosque" />
              <span>赏风情</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="7">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="landmark" />
              <span>领文化</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="8">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="house-night" />
              <span>忆乡愁</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="9">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="sandwich" />
              <span>寻美食</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="10">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="confetti" />
              <span>寻新意</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="11">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="yin-yang" />
              <span>养身心</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="12">
          <template v-slot:label>
            <div class="oneTab">
              <svg-icon class="el-icon" name="tower-of-pisa" />
              <span>世界名城</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <div class="keyword" v-if="keyword">
    <el-button style="padding: 30px 40px">与“&nbsp;<span>{{ keyword }}&nbsp;</span>”相关的文章&nbsp;
      <el-icon size="20" @click.stop="unLinkKeyword">
        <CircleCloseFilled />
      </el-icon>
    </el-button>
  </div>

  <div
    class="content"
    v-infinite-scroll="onloads"
    infinite-scroll-delay="400"
    infinite-scroll-immediate="false"
  >
    <div
      class="article"
      v-for="(item, index) in list"
      :key="index"
      @click="jump(item.id)"
    >
      <div class="head">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="like">
          <span>{{ item.likes }}</span>
          <svg-icon class="el-icon" name="like2" />
        </div>
      </div>
      <div class="img">
        <img
          alt=""

          v-if="item.content !== ''"
          :src="item.content"
        />
      </div>
      <div class="info">
        {{ item.contentHtml }}
      </div>
      <div class="bInfo">
        {{ formattedTime(item.createTime) }} &nbsp;{{ item.views }}浏览
      </div>
    </div>
    <p v-if="loading" style="margin:20px auto;width: 100px;color: gray">
      <el-icon>
        <Loading />
      </el-icon>
      Loading...
    </p>
    <el-divider v-if="finished">
      No More
    </el-divider>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { GetList, View } from '@/api/home/article.js'
import PersonMenu from '@/views/home/components/PersonMenu.vue'
import Navs from '@/views/home/Navs.vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'

const loading = ref(false)
const finished = ref(false)
const router = useRouter()
const route = useRoute()
const pageParams = ref({
  page: 1,
  limit: 5
})
const selectTab = ref('1')
const list = ref([])
const keyword = ref('')
onMounted(async () => {
  //赋值选中的tab
  if (route.query.type) {
    selectTab.value = route.query.type
  }
  //赋值搜索关键词
  if (route.query.keyword) {
    keyword.value = route.query.keyword
  }
  await fetchData2()
})
const handleClick = async pane => {
  list.value = []
  selectTab.value = pane.paneName
  pageParams.value = {
    page: 1,
    limit: 5
  }
  await fetchData2()
}

const onloads = async () => {
  if (finished.value === false) {
    loading.value = true
    pageParams.value.page = pageParams.value.page + 1
    await fetchData2()
  }
}
const fetchData2 = async () => {
  finished.value = false
  const { data } = await GetList(
    {
      page: pageParams.value.page,
      limit: pageParams.value.limit,
      type: Number(selectTab.value),
      keyword: keyword.value
    }
  )
  if (data.records.length > 0) {
    list.value = list.value.concat(data.records)
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
//打开单个新闻
const jump = async id => {
  await View(id)
  await router.push({
    path: '/singleArticle',
    query: {
      id: id
    }
  })
}
const formattedTime = d => {
  const date = new Date(d)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)
  const minute = ('0' + date.getMinutes()).slice(-2)
  return `${month}-${day} ${hour}:${minute}`
}
const unLinkKeyword = async () => {
  keyword.value = ''
  pageParams.value = {
    page: 1,
    limit: 5
  }
  await fetchData2()
}
</script>
<style scoped lang="scss">
.top {
  display: flex;
  justify-content: center;
  align-items: center;

  .tabs {
    margin: 0 auto;

    .oneTab {
      font-size: 13px;
      width: 60px;
      display: flex;
      flex-direction: column;

      .el-icon {
        margin-left: 4px;
        font-size: 30px;
      }

      span {
        margin-top: 3px;
      }
    }

    :deep {
      .el-tabs__header .el-tabs__item {
        height: 90px;
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
        background-color: #ff9d00;
      }
    }
  }
}

.el-divider {
  margin: 0;
  clear: both;
}

.keyword {
  width: 800px;
  margin: 0 auto 10px;

  .el-icon {
    cursor: pointer;
  }

  .el-button:hover {
    background-color: transparent;
    cursor: default;
    color: #606266;
  }

  span {
    font-size: 26px;
  }
}

.content {
  font-family: '微软雅黑', sans-serif;
  width: 800px;
  margin: 20px auto 0;

  .article {
    height: 230px;
    padding: 10px 5px;
    box-sizing: border-box;
    border-radius: 2px;
    border-bottom: 1px #e5e5e5 solid;

    .head {
      display: flex;
      justify-content: space-between;

      .title {
        align-self: flex-start;
        width: 600px;
        height: 25px;
        overflow: hidden;
        text-overflow: ellipsis; /* 使用省略号表示 */
        white-space: nowrap; /* 文本不换行 */
        font-size: 20px;
        margin-bottom: 20px;
      }

      .like {
        padding: 0 10px;
        height: 30px;
        width: auto;
        border-radius: 15px;
        border: #ff9d00 1px solid;

        span {
          color: #ff9d00;
          font-size: 15px;
          line-height: 30px;
          margin-right: 5px;
        }

        .el-icon {
          font-size: 20px;
        }
      }
    }

    .img img,
    .img {
      width: 220px;
      height: 150px;
      float: left;
      border-radius: 2px;
    }

    .info {
      float: right;
      width: 550px;
      height: 94px;
      box-sizing: border-box;
      font-size: 15px;
      padding-top: 10px;
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }

    .bInfo {
      margin-top: 20px;
      color: #999;
      float: right;
      font-size: 12px;
    }
  }

  .article:hover {
    cursor: pointer;

    .title {
      color: #ff9d00;
    }

    background-color: #f8f8f8;
  }
}

.menu {
  position: absolute;
  top: 6px;
  right: 20px;
}
</style>
