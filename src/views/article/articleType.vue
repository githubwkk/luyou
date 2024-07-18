<template>
  <div class="search-div">
    <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
    <transition name="el-fade-in">
      <el-button
        type="danger"
        @click="deleteBatchIds"
        v-show="mutipleSelection.length !== 0"
      >
        批量删除
      </el-button>
    </transition>
  </div>
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="60" align="center" />
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column prop="name" label="名称" align="center" />
    <el-table-column prop="status" label="状态" align="center">
      <template #default="scope">
        <el-tag
          :type="scope.row.status === 1 ? 'success' : 'danger'"
          disable-transitions
        >
          {{ scope.row.status === 1 ? '已启用' : '已禁用' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300" #default="scope">
      <el-button
        :disabled="scope.row.isLock === 1"
        :type="scope.row.status === 1 ? 'warning' : 'info '"
        size="small"
        @click="updateStatus(scope.row)"
      >
        {{ scope.row.status === 1 ? '禁用' : '启用  ' }}
      </el-button>
      <el-button
        type="primary"
        size="small"
        :disabled="scope.row.isLock === 1"
        @click="edit(scope.row)"
      >
        修改
      </el-button>
      <el-button
        type="danger"
        size="small"
        :disabled="scope.row.isLock === 1"
        @click="deleteType(scope.row)"
      >
        删除
      </el-button>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[20, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
  <el-dialog
    v-model="addDialogVisible"
    destroy-on-close
    title="添加文章类型"
    width="30%"
    @close="clear"
  >
    <el-form
      :rules="rules"
      ref="ruleFormRef"
      label-width="100px"
      :model="model"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="model.name"
          placeholder="请输入文章类型名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  DeleteArticleTypeBatchIds,
  DeleteArticleTypeById,
  disableStatus,
  enableStatus,
  GetArticleTypeListByPage,
  SaveArticleType,
  updateArticleType
} from '@/api/articleType.js'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()
const list = ref([])
const addDialogVisible = ref(false)
const mutipleSelection = ref([])
const total = ref()
const pageParams = ref({
  page: 1,
  limit: 20
})
const model = ref({
  name: null
})
const rules = ref<FormRules>({
  name: [
    {
      required: true,
      message: '请输入文章类型名称',
      trigger: 'blur'
    }
  ]
})
onMounted(async () => {
  await fetchData()
})
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const fetchData = async () => {
  const { data } = await GetArticleTypeListByPage(
    pageParams.value.page,
    pageParams.value.limit
  )
  list.value = data.records
  total.value = data.total
}
//addAndUpdate
const submit = async formEl => {
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 验证成功
      if (!model.value.id) {
        const { code } = await SaveArticleType(model.value)
        if (code === 200) {
          ElMessage.success('添加成功')
          clear()
          addDialogVisible.value = false
          await fetchData()
        } else {
          ElMessage.error('添加失败')
        }
      } else {
        const { code } = await updateArticleType(model.value)
        if (code === 200) {
          ElMessage.success('修改成功')
          clear()
          addDialogVisible.value = false
          await fetchData()
        } else {
          ElMessage.error('修改失败')
        }
      }
    } else {
      ElMessage.info('格式错误')
    }
  })
}
const edit = async row => {
  model.value = { ...row }
  addDialogVisible.value = true
}
//delete
const deleteType = async val => {
  const { code } = await DeleteArticleTypeById(val.id)
  if (code === 200) {
    ElMessage.success('删除成功')
    await fetchData()
  } else ElMessage.success('删除失败')
}
const deleteBatchIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的所有文章类型', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteArticleTypeBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
const updateStatus = async row => {
  if (row.status === 0) {
    const { code } = await enableStatus(row.id)
    if (code === 200) {
      ElMessage.success('启用成功')
      await fetchData()
    } else ElMessage.error('启用失败')
  } else if (row.status === 1) {
    const { code } = await disableStatus(row.id)
    if (code === 200) {
      ElMessage.success('禁用成功')
      await fetchData()
    } else ElMessage.error('禁用失败')
  }
}
const clear = () => {
  model.value = {}
}
</script>

<style scoped lang="scss">
.search-div {
  height: 35px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
