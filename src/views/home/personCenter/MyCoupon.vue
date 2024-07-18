<template>
  <div class="couponList">
    <div
      class="one"
      v-for="item in list"
      :key="item.id"
      :class="{ gray: buttonText(item.usageStatus, item.expirationDate) !== 3 }"
    >
      <el-row>
        <el-col :span="6" class="left">
          <div id="number">
            <span id="sign">￥</span>
            {{ item.discountValue }}
          </div>
          <div id="min" v-if="item.minUseAmount === 0">无门槛</div>
          <div id="min" v-else>满{{ item.minUseAmount }}可用</div>
        </el-col>
        <el-col :span="1">
          <!--  虚线 -->
          <div class="xx"></div>
        </el-col>
        <el-col :span="11" class="middle">
          <div class="name">{{ item.name }}</div>
          <div class="text">
            <span v-if="item.discountType === 2">仅限酒店使用</span>
            <span v-else-if="item.discountType === 1">仅限景点使用</span>
            <span v-else-if="item.discountType === 0">无门槛</span>
          </div>
          <div class="date">
            {{ item.receivedDate }} - {{ item.expirationDate }}
          </div>
        </el-col>
        <el-col :span="6" class="right">
          <el-button
            @click="jump"
            type="danger"
            :disabled="buttonText(item.usageStatus, item.expirationDate) !== 3"
          >
            {{
              buttonText(item.usageStatus, item.expirationDate) === 1
                ? '已使用'
                : buttonText(item.usageStatus, item.expirationDate) === 2
                ? '已过期'
                : '立即使用'
            }}
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
  <div class="bottom">
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[8, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { GetCouponReceivedList } from '@/api/home/coupon.js'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const pageParams = ref({
  page: 1,
  limit: 8
})

const total = ref(0)
const list = ref()
const user = ref()
onMounted(() => {
  fetchData()
})
const fetchData = async () => {
  list.value = []
  const { userinfo } = useUserinfo()
  user.value = userinfo.value
  const { data } = await GetCouponReceivedList(
    pageParams.value.page,
    pageParams.value.limit,
    user.value.id
  )
  list.value = data.records
  total.value = data.total
}
//同时判断使用状态到期时间
const buttonText = (s, t) => {
  /*
   * 1:已使用
   * 2:已过期
   * 3:立即使用*/
  const date = new Date(t)
  if (s === 1) {
    return 1
  } else if (s === 0 && new Date() > date) {
    return 2
  } else return 3
}
const jump = type => {
  if (type === 2) {
    router.push({
      path: '/HotelListHome',
      query: {
        type: type
      }
    })
  } else {
    router.push({
      path: '/TouristListHome',
      query: {
        type: type
      }
    })
  }
}
</script>
<style scoped lang="scss">
.gray {
  filter: grayscale(100%);
}

.couponList {
  display: block;
  height: 100%;
  width: 100%;
}

.one {
  float: left;
  margin: 20px 15px;
  --height: 160px;
  --color: #fe807e;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
  height: var(--height);
  width: 600px;

  .left {
    border-radius: 10px 0 0 10px;
    border-left: 10px solid var(--color);
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--height);
    width: 100%;
    color: var(--color);
    flex-direction: column;

    #number {
      font-size: 58px;
      font-weight: bold;

      display: flex;

      #sign {
        font-size: 20px;
        margin-top: 40px;
        margin-right: 0;
      }
    }

    #min {
      font-size: 16px;
      margin-top: -8px;
      margin-left: 10px;
    }
  }

  .xx {
    width: 10px;
    height: 90%;
    margin: 8px 0;
    box-sizing: border-box;
    border-right: 3px dashed lightgray;
  }

  .middle {
    overflow: hidden;
    padding: 20px 10px;
    position: relative;
    height: var(--height);
    box-sizing: border-box;

    .name {
      font-size: 26px;
      font-weight: bold;
    }

    .text {
      font-size: 16px;
      margin-top: 5px;
      color: #afafaf;
    }

    .date {
      color: #afafaf;
      position: absolute;
      bottom: 20px;
    }
  }

  .right {
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--height);

    .el-button {
      background-color: var(--color);
    }
  }
}

.bottom {
  width: 100%;
}
</style>
