<template>
  <div class="search-div">
    <el-button type="success" @click="addTAT">添加类型</el-button>
  </div>
  <el-dialog v-model="dialogVisible" title="添加或修改类型" width="30%">
    <el-form label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="tat.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="saveOrUpdate()"
          @enter="saveOrUpdate()"
        >
          提交
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-table :data="list">
    <el-table-column
      type="index"
      align="center"
      header-align="center"
      width="60"
      label="序号"
    ></el-table-column>
    <el-table-column
      prop="name"
      header-align="center"
      align="center"
      label="类型名称"
    ></el-table-column>
    <el-table-column
      prop="createTime"
      header-align="center"
      align="center"
      :label="$t('public.creationTime')"
    />
    <el-table-column
      prop="updateTime"
      header-align="center"
      align="center"
      :label="$t('public.updateTime')"
    />
    <el-table-column label="操作" align="center" #default="scope">
      <el-button type="primary" size="small" @click="edit(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        删除
      </el-button>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[15, 30, 60, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import {
  DeleteTATById,
  GetTATPageList,
  SaveTAT,
  UpdateTATById
} from '@/api/touristAttractionsType.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const total = ref(0)
const pageParams = ref({
  page: 1, // 页码
  limit: 15 // 每页记录数
})
const dialogVisible = ref(false)
const tat = ref({
  id: '',
  name: ''
})
const addTAT = () => {
  tat.value = {}
  dialogVisible.value = true
}
onMounted(() => {
  fetchData()
})
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}
const saveOrUpdate = async () => {
  if (!tat.value.id) {
    await saveData()
  } else {
    await updateData()
  }
}
const saveData = async () => {
  const { data, code } = await SaveTAT(tat.value)
  if (code === 200) {
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await fetchData()
  } else ElMessage.error('保存失败')
}

const updateData = async () => {
  const { data, code } = await UpdateTATById(tat.value)
  if (code === 200) {
    ElMessage.success('更新成功')
    dialogVisible.value = false
    await fetchData()
  } else ElMessage.error('更新失败')
}
const remove = async id => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data, code } = await DeleteTATById(id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else ElMessage.error('删除失败')
  })
}
const edit = async val => {
  tat.value = { ...val }
  dialogVisible.value = true
}
const fetchData = async () => {
  const { data } = await GetTATPageList(
    pageParams.value.page,
    pageParams.value.limit
  )
  list.value = data.records
  total.value = data.total
}
</script>
<style scoped lang="scss">
.search-div {
  margin-bottom: 10px;
  padding: 10px 15px 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
