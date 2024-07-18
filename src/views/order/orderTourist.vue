<template>
  <div class="search-div">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-form-item label="地区选择">
          <el-cascader
            placeholder="请选择订单地址"
            v-model="dtoRegion"
            :props="propsDto"
            @change="handleDtoRegionChange()"
            style="width: 260px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="景点选择">
          <el-select
            :disabled="dtoRegion.length === 0"
            v-model="queryDto.tid"
            @change="fetchData"
            @visible-change="handleSelectTA"
          >
            <el-option
              v-for="item in taList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="订单号">
          <el-input v-model="queryDto.id" placeholder="请输入要查询的订单号" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="支付方式">
          <el-select
            placeholder="请选择付款方式"
            v-model="queryDto.payType"
            @change="fetchData"
          >
            <el-option
              v-for="item in payTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="fetchData()">搜索</el-button>
        <el-button type="info" @click="reset()">重置</el-button>
        <el-button
          type="danger"
          v-if="mutipleSelection.length !== 0"
          @click="deleteBatchIds"
          >删除
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="10">
        <el-form-item label="订单日期">
          <el-date-picker
            v-model="queryTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            end-placeholder="结束时间"
            start-placeholder="开始时间"
            type="datetimerange"
            range-separator="~"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
  <!--  数据表-->
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column type="index" label="序号" sortable width="55" />
    <el-table-column prop="id" label="订单号" align="center" />
    <el-table-column prop="uname" label="用户名称" />
    <el-table-column prop="tname" label="景点名称" />
    <el-table-column prop="payType" label="付款方式" #default="scope">
      {{ scope.row.payType === 1 ? '微信' : '支付宝' }}
    </el-table-column>
    <el-table-column
      prop="originalTotalAmount"
      label="原价总额"
      sortable
      align="center"
    />
    <el-table-column
      prop="couponAmount"
      label="优惠卷金额"
      width="120px"
      sortable
      align="center"
    />
    <el-table-column
      prop="totalAmount"
      label="支付金额"
      sortable
      align="center"
    />
    <el-table-column
      prop="orderStatus"
      label="订单状态"
      sortable
      align="center"
    >
      <template v-slot="scope">
        <span v-if="scope.row.orderStatus === 1"> 已使用</span>
        <span
          style="color: deepskyblue"
          v-else-if="
            scope.row.orderStatus === 2 && scope.row.validityTime > currentDate
          "
        >
          待使用</span
        >
        <span
          v-else-if="
            scope.row.orderStatus === 2 && scope.row.validityTime <= currentDate
          "
          style="color: darkgrey"
        >
          已过期</span
        ><span v-else>待付款</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="validityTime"
      label="有效日期"
      sortable
      align="center"
      width="200px"
    ></el-table-column>
    <el-table-column
      prop="paymentTime"
      label="支付日期"
      sortable
      align="center"
      width="200px"
    ></el-table-column>
    <el-table-column
      prop="userTime"
      label="使用日期"
      #default="scope"
      sortable
      align="center"
      width="200px"
    >
      <el-text
        v-if="scope.row.useTime == null || scope.row.useTime === ''"
        type="primary"
        >未使用
      </el-text>
      {{ scope.row.useTime }}
    </el-table-column>
    <el-table-column label="操作" align="center" #default="scope">
      <el-button type="danger" size="small" @click="deleteById(scope.row)" :disabled="scope.row.useTime == null || scope.row.useTime === ''">
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
</template>
<script setup>
//table
import { onMounted, ref } from 'vue'
import { findRegionList } from '@/api/sysRegion.js'
import {
  DeleteOrderTouristBatchIds,
  DeleteOrderTouristById,
  GetOrderTouristListByPage
} from '@/api/orderTourist.js'
import { GetTAIdNameListByRegion } from '@/api/touristAttractions.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取当前时间的 Date 对象
const getCurrentTime = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
const regionTree = ref([])
const currentDate = ref()
onMounted(async () => {
  getCurrentTime()
  await fetchData()
})
const list = ref([])
const total = ref(0)
const taList = ref()
const taDto = ref({
  region1Id: null,
  region2Id: null,
  region3Id: null
})
const queryTime = ref([])
const queryDto = ref({
  id: '',
  tid: '',
  payType: null,
  orderStatus: null,
  startTime: null,
  endTime: null
})
const reset = async () => {
  queryDto.value = {}
  queryTime.value = []
  await fetchData()
}
const pageParams = ref({
  page: 1,
  limit: 10
})
const handleSelectTA = async () => {
  const { data } = await GetTAIdNameListByRegion(taDto.value)
  taList.value = data
}
const fetchData = async () => {
  queryDto.value.startTime = queryTime.value[0]
  queryDto.value.endTime = queryTime.value[1]
  const { code, message, data } = await GetOrderTouristListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}
const payTypeOptions = ref([
  { value: null, label: '全部' },
  { value: 1, label: '微信' },
  { value: 2, label: '支付宝支' }
])
//地区
const dtoRegion = ref([])
const handleDtoRegionChange = () => {
  if (dtoRegion.value.length === 1) {
    taDto.value.region1Id = dtoRegion.value[0]
  } else if (dtoRegion.value.length === 2) {
    taDto.value.region1Id = dtoRegion.value[0]
    taDto.value.region2Id = dtoRegion.value[1]
  } else if (dtoRegion.value.length === 3) {
    taDto.value.region1Id = dtoRegion.value[0]
    taDto.value.region2Id = dtoRegion.value[1]
    taDto.value.region3Id = dtoRegion.value[2]
  }
  fetchData()
}
const propsDto = {
  lazy: true,
  checkStrictly: true,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {
    if (typeof node.value == 'undefined') node.value = 0
    const { data } = await findRegionList(node.value)
    data.forEach(function(item) {
      item.leaf = !item.hasChildren
    })
    resolve(data)
  }
}
//删除
const deleteById = async val => {
  ElMessageBox.confirm('是否删除此订单记录', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteOrderTouristById(val.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else ElMessage.error('删除失败')
  })
}
//多选删除
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const deleteBatchIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的订单', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteOrderTouristBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
</script>
<style scoped lang="scss">
.search-div {
  margin-bottom: 10px;
  padding: 15px 15px 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
