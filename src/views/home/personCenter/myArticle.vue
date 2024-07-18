<template>
  <div class="body">
    <div class="top">
      <el-button size="large" @click="dialogVisible = true">
        发布
      </el-button>
      <el-dialog
        @close="closeDialog"
        v-model="dialogVisible"
        title="添加文章"
        width="80%"
        top="1vh"
        style="height: 95vh;overflow: auto"
      >
        <article-insert />
      </el-dialog>
    </div>
    <div
      v-infinite-scroll="onLoading"
      infinite-scroll-delay="400"
      infinite-scroll-immediate="false"
    >
      <div class="one-article" v-for="(item, index) in list" :key="index">
        <div class="article-title">{{ item.title }}</div>
        <div class="user-info">
          <div class="user-info-left">
            <el-image :src="user.avatar"></el-image>
          </div>
          <div class="user-info-right">
            <div class="username">{{ user.username }}</div>
            <div class="jj">
              {{ user.description }}
            </div>
          </div>
        </div>
        <div class="content" @click="jump(item.id)">
          <div class="img">
            <el-image :src="getImgUrl(item.content)"></el-image>
          </div>
          <div class="text">{{ getText(item.content) }}</div>
        </div>
        <div class="bottom">
          <el-button size="large">
            <svg-icon class="icon" name="like4"></svg-icon>
            {{ item.likes }}
          </el-button>
          <el-button
            size="large"
            :icon="Delete"
            @click.stop="deleteArticle(item.id)"
          ></el-button>
          <el-popover placement="top-start" trigger="hover">
            <template #reference>
              <el-button size="large" class="el-button2" :icon="Promotion">
                分享
              </el-button>
            </template>
            <template #default>
              <div class="share">
                <div class="share-item">
                  <svg-icon name="share-qq"></svg-icon>
                  <el-link :underline="false" @click="toQQ(url, title)"
                    >QQ
                  </el-link>
                </div>
                <div class="share-item">
                  <svg-icon name="share-qqzone"></svg-icon>
                  <el-link :underline="false" @click="toQQzone(url, title)"
                    >QQ空间
                  </el-link>
                </div>
                <div class="share-item">
                  <svg-icon name="share-weibo"></svg-icon>
                  <el-link :underline="false" @click="toWeibo(url, title)"
                    >新浪微博
                  </el-link>
                </div>
              </div>
            </template>
          </el-popover>
          <span v-if="item.approvalStatus === 2" style="color: #409EFF"
            >待审核</span
          ><span
            v-if="item.approvalStatus === 1 && item.publishStatus === 0"
            style="color: #67C23A"
            >待发布<el-button
              type="success"
              @click.stop="lastPublish(item.id)"
              style="margin-left: 10px;color: #67C23A"
              >发布</el-button
            > </span
          ><span
            v-if="item.approvalStatus === 1 && item.publishStatus === 1"
            style="color: #8491A5"
            >已发布</span
          >
          <el-tooltip
            effect="dark"
            :content="item.approvalReason"
            placement="top"
          >
            <span v-if="item.approvalStatus === 0" style="color: #F56C6C"
              >已驳回-查看原因</span
            >
          </el-tooltip>
          <span style="color: #8491A5">
            {{ formattedDateTime(item.createTime) }}</span
          >
        </div>
      </div>
    </div>
    <p v-if="loading" style="margin:20px auto;width: 700px;color: gray">
      <el-icon>
        <Loading />
      </el-icon>
      Loading...
    </p>
    <el-divider
      style="width: 700px;color: rgba(128,128,128,0.52)"
      v-if="finished"
    >
      No More
    </el-divider>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { Delete, Promotion } from '@element-plus/icons-vue'
import { toQQ, toQQzone, toWeibo } from '@/utils/share.js'
import {
  DeleteArticle,
  GetPersonalArticle,
  PublishPersonalArticle
} from '@/api/home/article.js'
import { useRouter } from 'vue-router'
import ArticleInsert from '@/views/article/articleInsert.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const pageParams = ref({
  page: 1,
  limit: 6
})
const list = ref([])
const user = ref({})
const router = useRouter()
let url = ''
let title = '111'
const app = getCurrentInstance()
onMounted(async () => {
  //获取个人信息
  const { userinfo } = useUserinfo()
  if (userinfo) {
    user.value = userinfo.value
    await fetchData()
  }
  url =
    app.appContext.config.globalProperties.$baseUrl +
    router.currentRoute.value.fullPath
})
const loading = ref(false)
const finished = ref(false)
const onLoading = async () => {
  if (finished.value === false) {
    loading.value = true
    pageParams.value.page = pageParams.value.page + 1
    await fetchData()
  }
}
const fetchData = async () => {
  const { data } = await GetPersonalArticle(
    pageParams.value.page,
    pageParams.value.limit,
    user.value.id
  )
  if (data.records.length > 0) {
    list.value = list.value.concat(data.records)
    loading.value = false
    if (data.records.length < pageParams.value.limit) {
      finished.value = true
    }
  } else {
    loading.value = false
    finished.value = true
  }
}
const getText = htmlContent => {
  // 创建一个临时 div 元素
  const tempDiv = document.createElement('div')
  // 将 HTML 内容作为该 div 的 innerHTML
  tempDiv.innerHTML = htmlContent
  // 获取 <p> 标签
  const paragraph = tempDiv.querySelector('p')
  if (paragraph) {
    // 获取 <p> 标签内的文本内容
    return paragraph.textContent.trim()
  }
}
const getImgUrl = htmlContent => {
  // 创建一个正则表达式来匹配 img 标签的 src 属性值
  const imgSrcRegex = /<img.*?src=['"](.*?)['"].*?>/
  // 通过正则表达式匹配获取第一个 img 标签的 src 属性值
  const match = htmlContent.match(imgSrcRegex)
  if (match) {
    // 第一个匹配项就是 img 标签的 src 属性值
    return match[1]
  } else {
    return null
  }
}
//打开单个新闻
const jump = async id => {
  await router.push({
    path: '/singleArticle',
    query: {
      id: id
    }
  })
}
const closeDialog = async () => {
  dialogVisible.value = false
  list.value = []
  await fetchData()
}
//审核后的发布
const lastPublish = async id => {
  const { code } = await PublishPersonalArticle(id)
  if (code === 200) {
    ElMessage.success('发布成功')
    list.value = []
    await fetchData()
  } else ElMessage.error('发布失败')
}
const deleteArticle = async id => {
  ElMessageBox.confirm('确定删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteArticle(id)
    if (code === 200) {
      ElMessage.success('删除成功')
      list.value = []
      await fetchData()
    } else ElMessage.error('删除失败')
  })
}

function formattedDateTime(d) {
  const date = new Date(d)
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}
</script>
<style scoped lang="scss">
.body {
  height: 100vh;

  .top {
    margin: 20px 0;

    .el-button {
      background-color: #eaf2ff;
      color: #6daefa;
      border: none;
      font-size: 15px;
    }
  }

  .one-article {
    width: 700px;
    height: 260px;
    padding: 15px 20px;
    margin: 20px 0;
    box-sizing: border-box;
    border-radius: 1px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    .article-title {
      font-size: 23px;
      font-weight: 600;
      height: 30px;
      box-sizing: border-box;
      line-height: 30px;
    }

    .user-info {
      height: 55px;
      display: flex;

      .user-info-left {
        height: 45px;
        width: 45px;
        margin: 5px;

        .el-image {
          border-radius: 3px;
        }
      }

      .user-info-right {
        margin-left: 10px;

        .username {
          font-size: 15px;
        }

        .jj {
          overflow: hidden;
          text-overflow: ellipsis; /* 使用省略号表示 */
          white-space: nowrap; /* 文本不换行 */
          width: 300px;
          font-size: 14px;
          margin-top: 2px;
        }
      }
    }

    .content {
      height: 100px;
      display: flex;

      .img {
        height: 100px;
        width: 190px;
      }

      .el-image {
        border-radius: 3px;
        height: 100px;
        width: 190px;
      }

      .text {
        height: 81px;
        margin-left: 10px;
        margin-top: 10px;
        font-size: 15px;
        box-sizing: border-box;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }

      :hover {
        cursor: pointer;
      }
    }

    .bottom {
      height: 45px;
      padding-top: 10px;
      box-sizing: border-box;

      .icon {
        color: #8bb8fa;
      }

      .el-button {
        background-color: #f3f8ff;
        color: #8bb8fa;
        border: none;
        font-size: 15px;
      }

      .el-button2 {
        background-color: transparent;
        color: #8491a5;
      }

      span {
        font-size: 15px;
        margin-left: 5px;
        line-height: 45px;
      }
    }
  }
}

.el-popper .is-light .el-popover .el-popover-self {
  min-width: 20px !important;
  width: 20px !important;
  padding: 0 !important;
}

:deep {
  .el-popover.el-popper {
    min-width: 20px !important;
    width: 20px !important;
    padding: 0 !important;
  }
}

.share {
  text-align: center;
  font-size: 20px;

  .share-item {
    cursor: pointer;

    .el-link {
      color: #191818;
      margin-left: 5px;
      font-size: 16px;
    }

    margin: 5px 0;
  }

  .share-item:hover {
    background-color: rgba(0, 242, 254, 0.71);
  }
}
</style>
