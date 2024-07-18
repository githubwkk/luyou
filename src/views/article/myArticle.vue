<template>
  <div class="search-div">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-form-item label="文章标题">
          <el-input
            v-model="queryDto.title"
            placeholder="请输入要搜索的文章标题"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="文章内容">
          <el-input
            v-model="queryDto.content"
            placeholder="文章包含的内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="fetchData">搜索</el-button>
        <el-button type="info" @click="clearAll">刷新</el-button>
        <el-button
          type="danger"
          @click="deleteBatchIds"
          :disabled="mutipleSelection.length === 0"
        >
          批量删除
        </el-button>
      </el-col>
    </el-row>
  </div>
  <!--list-->
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column type="index" label="序号" width="55" />
    <el-table-column
      prop="title"
      align="center"
      label="标题"
      show-overflow-tooltip
    />
    <el-table-column prop="aname" align="center" label="作者名称" />
    <el-table-column align="center" label="内容" #default="scope">
      <el-link type="primary" @click="openSingleContent(scope.row)"
        >点我查看
      </el-link>
    </el-table-column>
    <el-table-column prop="tname" align="center" label="提到景点" />
    <el-table-column prop="views" sortable align="center" width="120px">
      <template v-slot:header>
        <svg-icon name="eye" />
        浏览量
      </template>
    </el-table-column>
    <el-table-column
      prop="likes"
      sortable
      align="center"
      label="点赞数"
      width="120px"
    >
      <template v-slot:header>
        <svg-icon name="like" />
        点赞量
      </template>
    </el-table-column>
    <el-table-column
      prop="updateTime"
      sortable
      align="center"
      width="200px"
      label="发布/提交时间"
    ></el-table-column>
    <el-table-column
      prop="approvalStatus"
      sortable
      align="center"
      label="审核状态"
      #default="scope"
      ><span v-if="scope.row.approvalStatus === 2" style="color: #409EFF"
        >待审核</span
      ><span
        v-if="scope.row.approvalStatus === 1 && scope.row.publishStatus === 0"
        style="color: #67C23A"
        >待发布</span
      ><span
        v-if="scope.row.approvalStatus === 1 && scope.row.publishStatus === 1"
        style="color: purple"
        >已发布</span
      ><span v-if="scope.row.approvalStatus === 0" style="color: #F56C6C"
        >已驳回
        <el-tooltip
          class="box-item"
          effect="light"
          placement="top"
          hide-after="10"
        >
          <template #content>
            <el-text style="font-size: 20px">
              {{ scope.row.approvalReason }}</el-text
            >
          </template>

          <el-text type="primary">(查看原因)</el-text>
        </el-tooltip>
      </span>
    </el-table-column>
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button
        @click="publish(scope.row)"
        size="small"
        type="success"
        :disabled="
          scope.row.publishStatus === 1 || scope.row.approvalStatus !== 1
        "
        >发布
      </el-button>
      <el-button
        type="primary"
        size="small"
        :disabled="scope.row.approvalStatus !== 0"
        @click="editArticle(scope.row)"
      >
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteArticle(scope.row)">
        删除
      </el-button>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
  <!--内容编辑窗体-->
  <el-dialog
    top="5%"
    v-model="dialogEdit"
    style="background-color: #F5F5F5;height: 830px"
    title="编辑文章"
    :destroy-on-close="true"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="文章标题">
          <el-input v-model="ArticleForm.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="提到的景点">
          <el-select
            placeholder="选择文章提到的景点（如果提到）"
            v-model="ArticleForm.tid"
            @click="getTANameAndID"
          >
            <el-option
              v-for="item in TANameAndList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="文章内容" style="width: 100% ;height:600px">
      <wangEditor v-model="ArticleForm.content"></wangEditor>
    </el-form-item>
    <el-button
      style="float: right;margin-top: 50px;display: block"
      @click="submit"
      type="primary"
      >提交
    </el-button>
  </el-dialog>
  <!--内容查看窗体-->
  <el-dialog v-model="singleContentDialog">
    <div v-html="singleContent"></div>
  </el-dialog>
</template>
<script setup>
import { getTAIdNameList } from '@/api/touristAttractions.js'
import { onMounted, ref } from 'vue'
import {
  DeleteArticleBatchIds,
  DeleteArticleById,
  GetArticleArticleListByPage,
  PublishArticle,
  updateArticle
} from '@/api/article.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, View } from '@element-plus/icons-vue'
import WangEditor from '@/components/wangEditor.vue'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import SvgIcon from '@/components/SvgIcon/index.vue'

const user = ref()
const { userinfo } = useUserinfo()

const list = ref([])
const pageParams = ref({
  page: 1,
  limit: 10
})
const total = ref(0)
const queryDto = ref({ title: null, content: null, aid: 1, tid: null })
onMounted(async () => {
  user.value = { ...userinfo.value }
  await fetchData()
})
const fetchData = async () => {
  const { data } = await GetArticleArticleListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}
const TANameAndList = ref()
const getTANameAndID = async () => {
  const { data } = await getTAIdNameList()
  TANameAndList.value = data
}
const clearAll = () => {
  queryDto.value.title = null
  queryDto.value.content = null
  queryDto.value.tid = null
  fetchData()
}
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const deleteBatchIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的所有文章', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteArticleBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
const singleContentDialog = ref(false)
const singleContent = ref()
const openSingleContent = val => {
  singleContentDialog.value = true
  singleContent.value = val.content
}
//删除
const deleteArticle = async row => {
  ElMessageBox.confirm('此操作将删除此文章', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteArticleById(row.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//编辑
const ArticleForm = ref({
  title: '',
  content: '',
  tid: ''
})
const dialogEdit = ref(false)
const editArticle = val => {
  ArticleForm.value = { ...val }
  dialogEdit.value = true
}
const submit = async () => {
  const { code } = await updateArticle(ArticleForm.value)
  if (code === 200) {
    ElMessage.success('更新成功')
    await fetchData()
    dialogEdit.value = false
  } else ElMessage.error('更新失败')
}
//发布
const publish = async val => {
  const { code } = await PublishArticle(val.id)
  if (code === 200) {
    ElMessage.success('发布成功')
    await fetchData()
  } else ElMessage.error('发布失败')
}
</script>
<style scoped lang="scss"></style>
