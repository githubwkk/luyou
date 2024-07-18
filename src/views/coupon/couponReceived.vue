<template>
  <div class="search-div">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="按领取日期查询">
          <el-date-picker
            v-model="datePick"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDatePick"
            value-format="YYYY-MM-DD"
            unlink-panels
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-button type="info" @click="reset">重置</el-button>
        <el-button
          type="danger"
          v-if="mutipleSelection.length !== 0"
          @click="deleteBatchIds"
          >删除选中
        </el-button>
      </el-col>
    </el-row>
  </div>
  <el-table @selection-change="handleSelectionChange" :data="list">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column
      type="index"
      label="序号"
      sortable
      width="55"
      align="center"
    />
    <el-table-column prop="cname" label="优惠券名称" align="center" />
    <el-table-column prop="uname" label="用户名称" align="center" />
    <el-table-column
      prop="receivedDate"
      label="领取日期"
      align="center"
      sortable
    />
    <el-table-column
      prop="expirationDate"
      label="有效期"
      align="center"
      sortable
    />
    <el-table-column
      prop="usageStatus"
      label="使用状态"
      align="center"
      sortable
    >
      <template #default="scope">
        <el-tag :type="scope.row.usageStatus === 1 ? 'success' : 'info'"
          >{{ scope.row.usageStatus === 1 ? '已使用' : '未使用' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" #default="scope" width="150">
      <el-button type="danger" size="small" @click="deleteById(scope.row)">
        删除
      </el-button>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[18, 35, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DeleteCouponReceivedBatchIds,
  DeleteCouponReceivedById,
  GetCouponReceivedList
} from '@/api/couponReceived.js'

const list = ref([])
const total = ref(0)
const pageParams = ref({
  page: 1,
  limit: 18
})
const datePick = ref([])
const queryDto = ref({
  startDate: null,
  endDate: null
})

onMounted(async () => {
  await fetchData()
})
const fetchData = async () => {
  const { data } = await GetCouponReceivedList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}
const handleDatePick = async () => {
  queryDto.value = {
    startDate: datePick.value[0],
    endDate: datePick.value[1]
  }
  if (datePick.value.length === 2) {
    await fetchData()
  }
}
const reset = async () => {
  datePick.value = []
  queryDto.value = {}
  await fetchData()
}
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const deleteBatchIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的记录', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteCouponReceivedBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else ElMessage.error('删除失败')
  })
}
const deleteById = async row => {
  ElMessageBox.confirm('此操作将删除记录', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteCouponReceivedById(row.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else ElMessage.error('删除失败')
  })
}
</script>

<style scoped lang="scss"></style>
