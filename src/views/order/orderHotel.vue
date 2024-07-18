<template>
  <div class="search-div">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-form-item label="选择地区">
          <el-cascader
            placeholder="请选择酒店地址"
            v-model="regionModel"
            :props="propsDto"
            @change="handleRegionModelChange()"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="酒店选择">
          <el-select
            :disabled="regionModel.length === 0"
            v-model="queryDto.hid"
            placeholder="所有酒店"
            @change="fetchData"
          >
            <el-option
              v-for="(item, index) in hotelList"
              :key="index"
              :value="item.id"
              :value-key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="订单号">
          <el-input v-model="queryDto.id" placeholder="请输入订单号" />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="入住日期">
          <el-date-picker
            v-model="queryDto.checkInTime"
            type="date"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            placeholder="选择入住办理的日期"
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="退房日期">
          <el-date-picker
            v-model="queryDto.checkOutTime"
            type="date"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            placeholder="选择退房日期的订单"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-form-item label="订单状态">
          <el-select v-model="queryDto.orderStatus" @change="fetchData">
            <el-option
              v-for="item in orderStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="支付方式">
          <el-select
            :disabled="queryDto.orderStatus !== 1"
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
      <el-col :span="10">
        <el-form-item label="订单日期">
          <el-date-picker
            @change="orderDateHandle"
            v-model="orderDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            end-placeholder="结束时间"
            start-placeholder="开始时间"
            type="datetimerange"
            range-separator="~"
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <div style="float: right;margin-right: 30px">
          <el-button type="success" @click="fetchData()">搜索</el-button>
          <el-button type="info" @click="reset()">重置</el-button>
          <el-button
            type="danger"
            v-if="mutipleSelection.length !== 0"
            @click="deleteBatchIds"
            >删除选中
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-table
    :data="list"
    @selection-change="handleSelectionChange"
    border
    resizable
  >
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column
      type="index"
      label="序号"
      sortable
      width="55"
      align="center"
    />
    <el-table-column prop="id" show-overflow-tooltip label="订单号" align="center" />
    <el-table-column prop="uname" label="用户名称" align="center" />
    <el-table-column prop="hname" show-overflow-tooltip label="酒店名称" align="center" />
    <el-table-column prop="rname" label="房间名称" align="center" />
    <el-table-column prop="rn" label="房号" align="center" />
    <el-table-column
      prop="checkInTime"
      label="入住日期"
      sortable
      align="center"
      width="110px"
    />
    <el-table-column
      prop="checkOutTime"
      label="退房日期"
      sortable
      align="center"
      width="110px"
    />
    <el-table-column prop="payType" label="付款方式" #default="scope">
      {{ scope.row.payType === 1 ? '微信' : '支付宝' }}
    </el-table-column>
    <el-table-column
      prop="originalTotalAmount"
      label="原价总额"
      sortable
      width="110"
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
      width="110"
      sortable
      align="center"
    />
    <el-table-column
      prop="orderStatus"
      label="订单状态"
      width="105"
      sortable
      #default="scope"
      align="center"
    >
      {{
        scope.row.orderStatus === 2
          ? '未付款'
          : scope.row.orderStatus === 1
          ? '已付款'
          : '未支付'
      }}
    </el-table-column>
    <el-table-column
      prop="paymentTime"
      label="支付日期"
      sortable
      align="center"
      width="200px"
    />
    <el-table-column prop="checkOutStatus" label="退房状态" #default="scope">
      {{ scope.row.checkOutStatus === 1 ? '已退房' : '未退房' }}
    </el-table-column>
    <el-table-column label="操作" align="center" #default="scope" width="150">
      <el-button
        type="success"
        size="small"
        :disabled="scope.row.checkOutStatus === 1"
        @click="checkOut(scope.row)"
        >退房
      </el-button>
      <el-button type="danger" size="small" :disabled="scope.row.checkOutStatus===0" @click="deleteById(scope.row)">
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
import { onMounted, ref } from 'vue'
import {
  CheckOut,
  DeleteOrderHotelBatchIds,
  DeleteOrderHotelById,
  GetOrderHotelListByPage
} from '@/api/orderHotel.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetHotelNameList } from '@/api/hotel.js'
import { findRegionList } from '@/api/sysRegion.js'

const list = ref([])
const hotelList = ref()
const total = ref(0)
const pageParams = ref({
  page: 1,
  limit: 10
})
const payTypeOptions = ref([
  { value: null, label: '全部' },
  { value: 1, label: '微信' },
  { value: 2, label: '支付宝' }
])
const orderStatusList = ref([
  { value: null, label: '全部' },
  { value: 1, label: '已支付' },
  { value: 2, label: '待付款(15分内)' },
  { value: 0, label: '未支付' }
])
const queryDto = ref({
  hid: '', //宾馆
  id: '', //订单号
  payType: null,
  orderStatus: null,
  startTime: null,
  endTime: null,
  checkInTime: null,
  checkOutTime: null
})
onMounted(async () => {
  await fetchData()
})
const fetchData = async () => {
  const { data } = await GetOrderHotelListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}
//地区级联
const regionModel = ref([])
const regionForSelect = ref({
  region1Id: '',
  region2Id: '',
  region3Id: ''
})
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
//订单日期
const orderDate = ref()
const orderDateHandle = () => {
  queryDto.value.startTime = orderDate.value[0]
  queryDto.value.endTime = orderDate.value[1]
}
//入住退房时间
const shortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  }
]
const handleRegionModelChange = async () => {
  //地区级联监听

  if (regionModel.value.length === 1) {
    regionForSelect.value.region1Id = regionModel.value[0]
  } else if (regionModel.value.length === 2) {
    regionForSelect.value.region1Id = regionModel.value[0]
    regionForSelect.value.region2Id = regionModel.value[1]
  } else if (regionModel.value.length === 3) {
    regionForSelect.value.region1Id = regionModel.value[0]
    regionForSelect.value.region2Id = regionModel.value[1]
    regionForSelect.value.region3Id = regionModel.value[2]
  }
  const { data } = await GetHotelNameList(regionForSelect.value) // 获取酒店名称list
  hotelList.value = data
  await fetchData()
}
//删除
const deleteById = async val => {
  ElMessageBox.confirm('是否删除此订单记录', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteOrderHotelById(val.id)
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
    const { code } = await DeleteOrderHotelBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//重置
const reset = async () => {
  queryDto.value = {}
  regionModel.value = []
  orderDate.value = []
  await fetchData()
}
//退房
const checkOut = async val => {
  const { code } = await CheckOut(val.id)
  if (code === 200) {
    ElMessage.success('退房成功')
    await fetchData()
  } else ElMessage.error('操作失败')
}
</script>
<style scoped lang="scss"></style>
