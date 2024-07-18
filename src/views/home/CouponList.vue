<template>
  <Navs />
  <PersonMenu class="menu" />
  <div class="body">
    <div class="h">
      <svg-icon class="svg-icon" name="coupon-icons-yhq2"></svg-icon>
      优惠券中心
    </div>
    <div class="coupon-list">
      <div class="one" v-for="item in list" :key="item.id">
        <div
          :class="{
            top2: item.discountType === 0
          }"
          class="top1"
        >
          <div class="name">{{ item.name }}</div>
        </div>
        <div class="content">
          <div class="left">
            <svg-icon class="svg-icon" name="coupon-icons-yhq"></svg-icon>
          </div>
          <div class="right">
            <div class="top">
              <div class="info">￥</div>
              <div class="price">{{ item.discountValue }}</div>
              <div class="info">
                <span>满{{ item.minUseAmount }}可用</span>
                <span v-if="item.discountType === 2">(仅限酒店)</span>
                <span v-else-if="item.discountType === 1">(仅限景点)</span>
                <span v-else-if="item.discountType === 0">(无门槛)</span>
              </div>
            </div>
            <div class="bottom-left">
              <div class="text" v-if="item.stock !== 0">
                剩余{{ item.stock }}张
              </div>
              <div class="text" v-else>
                已领完
              </div>
              <el-button disabled v-if="userCidList.includes(item.id)"
                >已领取
              </el-button>
              <el-button disabled v-else-if="item.stock === 0"
                >已领完
              </el-button>
              <el-button
                v-else
                class="el-button1"
                type="warning"
                plain
                @click="receive(item.id)"
                >立即领取
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-pagination
        v-model:current-page="pageParams.page"
        v-model:page-size="pageParams.limit"
        @size-change="fetchData"
        @current-change="fetchData"
        background
        layout="prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>
<script setup>
import Navs from '@/views/home/Navs.vue'
import Footer from '@/views/home/Footer.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { onMounted, ref } from 'vue'
import {
  findPersonalCidList,
  GetCouponList,
  ReceivedCoupon
} from '@/api/home/coupon.js'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import { ElMessage } from 'element-plus'
import PersonMenu from '@/views/home/components/PersonMenu.vue'

const total = ref(0)
const list = ref()
const userCidList = ref([])
const pageParams = ref({
  page: 1,
  limit: 8
})
const user = ref()
onMounted(async () => {
  const { userinfo } = useUserinfo()
  user.value = userinfo.value
  const { data } = await findPersonalCidList(user.value.id)
  console.log(data)
  userCidList.value = data
  await fetchData()
})
const fetchData = async () => {
  list.value = []
  const { data } = await GetCouponList(
    pageParams.value.page,
    pageParams.value.limit
  )
  list.value = data.records
  total.value = data.total
}
const receive = async cid => {
  const { code } = await ReceivedCoupon(cid, user.value.id)
  if (code === 200) {
    ElMessage.success('领取成功')
    await fetchData()
  } else ElMessage.error('领取失败')
}
</script>
<style scoped lang="scss">
.body {
  height: 50vh;
  width: 1200px;
  margin: auto;

  .h {
    font-size: 30px;
    margin-top: 20px;
  }

  .coupon-list {
    display: flex;
    background: #f5f5f5;
    height: 80vh;
    margin-top: 30px;
    padding: 20px 20px;
    box-sizing: border-box;
    border-radius: 2px;

    .one {
      width: 380px;
      margin: 15px 10px;

      .top1 {
        background: url('@/assets/coupon/coupon-spring.png') -120px 0 no-repeat;
        height: 40px;
      }

      .top2 {
        background: url('@/assets/coupon/coupon-spring.png') -120px -40px
          no-repeat;
        height: 40px;
      }

      .name {
        font-size: 19px;
        line-height: 40px;
        margin-left: 10px;
        color: honeydew;
      }

      .content {
        width: 100%;
        height: 120px;
        display: flex;
        background: white;
        border-radius: 2px;

        .left {
          width: 30%;
          display: flex;

          .svg-icon {
            margin: auto;
            font-size: 80px;
          }
        }

        .right {
          width: 70%;
          padding: 10px 5px;
          box-sizing: border-box;
          color: #ff6600;
          display: flex;
          flex-direction: column;

          .top {
            display: flex;

            .info {
              font-size: 15px;
              margin: 18px 5px 0 10px;
            }

            .price {
              font-family: Impact, serif !important;
              font-size: 38px;
            }
          }

          .bottom-left {
            display: flex;
            color: gray;
            margin-left: 20px;
            margin-top: 10px;
          }

          .el-button {
            margin-left: 70px;
          }

          .el-button1 {
            margin-left: 70px;
            color: #ff6600;
          }
        }
      }
    }
  }
}

.bottom {
  margin-top: -60px;

  :deep {
    .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
      background-color: #ff6600 !important;
    }
  }
}

.menu {
  position: absolute;
  top: 10px;
  right: 20px;
}
</style>
