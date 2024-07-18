<template>
  <Header></Header>
  <PersonMenu class="menu" />
  <el-image
    z-index="-999"
    style="width: 100%; height: 600px;"
    :src="bg"
    :fit="'cover'"
  />
  <div class="bg2"></div>
  <div class="main">
    <div class="tx">
      <el-avatar :src="article.uavatar" />
    </div>
    <div class="title">{{ article.title }}</div>
    <div class="date">
      <span class="author">{{ article.aname }}</span
      >&nbsp;&nbsp;&nbsp;
      {{ formattedTime(article.createTime) }}&nbsp;&nbsp;&nbsp;

      <span>
        <svg-icon class="svg-icon" name="eye-fill" />&nbsp;{{
          article.views
        }}</span
      >
    </div>
    <div class="like" @click="like(article.id)">
      <div class="icon">
        <svg-icon class="svg-icon" name="like3" />
      </div>
      <div class="likeText">{{ article.likes }}</div>
    </div>
  </div>
  <div class="content">
    <div class="touristP">
      <div class="tourist" v-if="article.tid" :class="{ fixed: gd }">
        <div class="header">提到的景点：</div>
        <div class="img">
          <img :src="t.photoUrl" alt="" />
        </div>
        <div class="title">
          {{ t.name }}<span>[{{ t.region1Name }}·{{ t.region2Name }}]</span>
        </div>

        <div v-if="t.grade >= 3" class="grade">
          <span>{{ t.grade }}A景点</span>
        </div>
        <div class="address">地址：{{ t.address }}</div>
        <div class="bottom">
          <div class="btn">
            <button @click="jump(t.id)">查看详情</button>
          </div>
        </div>
      </div>
      <div class="touristNO" v-else></div>
    </div>
    <div class="nr" v-html="article.content"></div>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { GetOne, GetTourist, Like } from '@/api/home/article.js'
import Header from '@/views/home/Navs.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { ElMessage } from 'element-plus'
import PersonMenu from '@/views/home/components/PersonMenu.vue'

const route = useRoute()
const t = ref({
  id: '',
  name: '',
  region1Name: '',
  region2Name: '',
  grade: '',
  address: '',
  photoUrl: ''
})
const article = ref({
  title: '',
  aname: '',
  content: '',
  type: '',
  createTime: '',
  views: '',
  likes: '',
  tname: '',
  tid: '',
  uavatar: ''
})
onMounted(async () => {
  await fetchData()
})
const fetchData = async () => {
  const { data } = await GetOne(route.query.id)
  article.value = data
  bg.value = getImgUrl(data.content)
  if (article.value.tid !== null && article.value.tid !== '') {
    const data2 = await GetTourist(article.value.tid)
    t.value = { ...data2.data }
    // 将照片URLs字符串拆分为数组，并选择第一张照片URL
    let photoUrlsArray = []
    if (t.value.photoUrls !== '' && t.value.photoUrl !== null) {
      photoUrlsArray = t.value.photoUrls.split(',')
    }
    t.value.photoUrl = photoUrlsArray.length > 0 ? photoUrlsArray[0] : null
    window.addEventListener('scroll', handleScroll)
  }
}
const bg = ref('')
//图片
const getImgUrl = htmlContent => {
  // 创建一个正则表达式来匹配 img 标签的 src 属性值
  const imgSrcRegex = /<img.*?src=['"](.*?)['"].*?>/
  // 通过正则表达式匹配获取第一个 img 标签的 src 属性值
  const match = htmlContent.match(imgSrcRegex)
  if (match) {
    // 第一个匹配项就是 img 标签的 src 属性值
    return match[1]
  } else {
    return new URL('@/assets/error/404.jpg', import.meta.url).href
  }
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
//格式化日期
const formattedTime = d => {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)
  const minute = ('0' + date.getMinutes()).slice(-2)
  const second = ('0' + date.getSeconds()).slice(-2)
  return `${year}-${month}-${day} ${hour}:${minute}`
}
//点赞
const like = async id => {
  const { code } = await Like(id)
  if (code === 200) {
    ElMessage.success('点赞成功')
  } else if (code === 205) {
    ElMessage.error('未登录')
  }
  await fetchData()
}
const gd = ref(false)
const handleScroll = () => {
  // 获取页面滚动的距离
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop
  gd.value = scrollTop >= 750
}


</script>
<style scoped lang="scss">
.el-image {
  z-index: -999;
}

.fixed {
  position: fixed;
  top: 15px;
  left: 30px;
}

.bg2 {
  z-index: -999;
  border-bottom: 1px solid #d7d7d7;
  position: absolute;
  margin-top: -5px;
  width: 100%;
  height: 80px;
  background-color: white;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
}

.main {
  font-family: '微软雅黑', sans-serif;
  width: auto;
  height: auto;
  margin: -60px 30% 0;

  .tx {
    float: left;

    .el-avatar {
      width: 90px;
      height: 90px;
      box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
    }
  }

  .title {
    color: white;
    height: 50px;
    z-index: 999;
    font-size: 35px;
    font-weight: 600;
    line-clamp: none;
    text-align: center;
    margin: 0 auto 0;
    white-space: nowrap; /* 禁止换行 */
    text-overflow: ellipsis; /* 使用省略号表示被隐藏的文本 */
  }

  .date {
    float: left;
    text-align: center;
    margin: 20px 0 0 70px;
    color: gray;

    .svg-icon {
      font-size: 18px;
    }

    .author {
      color: #1f2d3d;
    }
  }

  .like {
    cursor: pointer;
    height: 80px;
    width: 80px;
    float: right;
    margin-top: 10px;

    .svg-icon {
      font-size: 40px;
    }

    .likeText {
      font-size: 16px;
      color: #ff972e;
      margin-left: 5px;
    }
  }
}

.content {
  display: flex;
  margin: 90px auto 0;

  .nr {
    width: 50vw;
    overflow: hidden;
  }

  .touristP {
    width: 560px;
    margin: 15px 30px 0;
  }

  .touristNO {
    width: 500px;
    height: 200px;
    box-sizing: border-box;
    margin: 15px 30px 0;
    padding: 10px 20px;
  }

  .tourist {
    border-radius: 10px;
    width: 700px;
    height: 200px;
    box-sizing: border-box;
    margin: 15px 30px 0;
    padding: 10px 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;

    .header {
      font-size: 23px;
    }

    .title,
    .grade,
    .address {
      margin: 5px 0 0 10px;
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

    .img img {
      float: left;
      width: 210px;
      height: 120px;
      border-radius: 2px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
      rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
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

    .bottom {
      width: 100%;
      display: flex; /* 使用 Flexbox 布局 */
      justify-content: flex-end; /* 将元素置于容器的右侧 */
      .btn button {
        cursor: pointer;
        width: auto;
        margin-left: 10px;
        margin-top: -20px;
        height: 40px;
        background-color: #ff7800;
        color: white;
        font-size: 14px;
        border: none;
        border-radius: 3px;
      }
    }
  }
}

.menu {
  position: absolute;
  top: 12px;
  right: 20px;
}
</style>
