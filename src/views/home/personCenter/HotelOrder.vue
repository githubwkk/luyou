<script setup>
import { Delete } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import {
  DeleteUserHotelOrder,
  GetUserHotelOrderList
} from '@/api/home/hotel.js'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageParams = ref({
  page: 1,
  limit: 4
})
const user = ref()
const list = ref([])
const total = ref(0)
onMounted(() => {
  const { userinfo } = useUserinfo()
  user.value = userinfo.value
  fetchData()
})
const fetchData = async () => {
  const { data } = await GetUserHotelOrderList(
    pageParams.value.page,
    pageParams.value.limit,
    user.value.id
  )
  total.value = data.total
  list.value = data.records
  console.log(data)
}
const deleteOrder = async id => {
  ElMessageBox.confirm('此操作将永久删除该订单记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteUserHotelOrder(id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<template>
  <div class="list">
    <div class="one" v-for="item in list" :key="item.id">
      <div class="status">
        <span v-if="item.orderStatus === 1 && item.checkOutStatus === 1"
          >已完成</span
        >
        <span v-else-if="item.orderStatus === 2">代付款</span>
        <span v-else-if="item.orderStatus === 0">未付款</span>&nbsp;|
        <el-button @click="deleteOrder(item.id)">
          <el-icon>
            <Delete />
          </el-icon>
        </el-button>
      </div>
      <div class="name">
        {{ item.hname }}&nbsp;<span>-{{ item.rname }}({{ item.rn }})</span>
      </div>
      <div class="address">{{ item.haddress }}</div>
      <div class="date">{{ item.checkInTime }}-{{ item.checkOutTime }}</div>
      <div class="pay">
        在线付<span>￥{{ item.totalAmount }}</span>
      </div>
    </div>
  </div>
  <div class="bottom">
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<style scoped lang="scss">
.list {
  .one {
    background: #ece9e6;
    background: linear-gradient(to right, #ffffff, #ece9e6);

    margin: 10px 0;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
    border: 1px solid #ccc;
    width: 700px;
    height: auto;
    padding: 10px 15px;

    .status {
      text-align: right;
      font-size: medium;

      .el-button {
        background-color: transparent;
        border: none;
        width: 20px;
        height: 30px;
      }
    }

    .name {
      font-size: 28px;

      span {
        font-size: 26px;
        color: #393939;
      }
    }

    .address {
      color: #5b5b5b;
      font-size: 15px;
      margin: 5px 0;
    }

    .date {
      color: #5b5b5b;
    }

    .pay {
      font-size: 18px;
      text-align: right;

      span {
        font-family: 'Microsoft YaHei', 'pf', sans-serif !important;
        font-size: 28px;
        font-weight: 500;
      }
    }
  }
}

.bottom {
  margin-top: 30px;
  width: 700px;
}
</style>
