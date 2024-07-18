<template>
  <div class="search-div">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="按领取日期查询">
          <el-date-picker
            v-model="datePick"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDatePick"
            value-format="YYYY-MM-DD hh:mm:ss"
            format="YYYY-MM-DD hh:mm:ss"
            unlink-panels
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-button type="info" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
  <el-table :data="list" style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      sortable
      width="55"
      align="center"
    />
    <el-table-column prop="title" label="模块标题"></el-table-column>
    <el-table-column
      prop="method"
      label="方法名称"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column prop="requestMethod" label="请求方式"></el-table-column>
    <el-table-column prop="operatorType" label="操作类别"></el-table-column>
    <el-table-column prop="businessType" label="业务类型" align="center">
      <template #default="scope">
        <!-- 根据业务类型动态显示不同内容 -->
        <span v-if="scope.row.operatorType === 0">其它</span>
        <span v-else-if="scope.row.operatorType === 1">新增</span>
        <span v-else-if="scope.row.operatorType === 2">修改</span>
        <span v-else-if="scope.row.operatorType === 3">删除</span>
        <span v-else>未知类型</span>
      </template>
    </el-table-column>
    <el-table-column prop="operName" label="操作人员"></el-table-column>
    <el-table-column prop="operUrl" label="请求URL"></el-table-column>
    <el-table-column prop="operIp" label="主机地址"></el-table-column>
    <el-table-column prop="operParam" label="请求参数" show-overflow-tooltip>
      <template #default="scope">
        <span v-if="!scope.row.operParam">
          无
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="jsonResult" label="返回参数">
      <template #default="scope">
        <el-tooltip effect="light" placement="top">
          <template v-slot:content>
            <pre>{{ scope.row.jsonResult }}</pre>
          </template>
          <el-popover
            placement="top-start"
            title="返回参数"
            width="200"
            trigger="hover"
            :content="scope.row.jsonResult"
          >
            <template #reference>
              <el-button type="text">
                {{ scope.row.jsonResult }}
              </el-button>
            </template>
          </el-popover>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="操作状态" align="center">
      <template #default="scope">
        <el-tag
          :type="scope.row.status === 1 ? 'success' : 'danger'"
          disable-transitions
        >
          {{ scope.row.status === 0 ? '正常' : '异常' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="errorMsg" label="错误消息">
      <template #default="scope">
        <span v-if="!scope.row.errorMsg">
          无
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="时间"></el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[12, 30, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { GetLogList } from '@/api/log.js'

const datePick = ref([])
const list = ref([])
const total = ref(0)
const pageParams = ref({
  page: 1,
  limit: 12
})
onMounted(() => {
  fetchData()
})
const fetchData = async () => {
  const { data } = await GetLogList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  console.log(data)
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
const queryDto = ref({
  startDate: null,
  endDate: null
})
const reset = async () => {
  datePick.value = []
  queryDto.value = {}
  await fetchData()
}
</script>
<style scoped lang="scss">
.search-div {
  height: 20px;
}
</style>
