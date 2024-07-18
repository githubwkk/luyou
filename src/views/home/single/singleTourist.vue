<template>
  <Navs/>
  <div class="main">
    <div class="images">
      <el-image
          v-if="t.photoUrls"
          :fit="'contain'"
          :src="t.photoUrls[0]"
          :preview-src-list="t.photoUrls"
      ></el-image>
      <el-image v-else :src="noPic">
      </el-image>
    </div>
    <div class="right">
      <div class="title" style=" font-family: '华文中宋', sans-serif">
        {{ t.name }}
      </div>
      <el-form label-width="auto" label-position="left">
        <el-form-item label="地址">
          <div class="address">
            {{ t.region1Name }}-{{ t.region2Name }}-{{ t.region3Name }} &nbsp;
            &nbsp; &nbsp;{{ t.address }}
          </div>
        </el-form-item>
        <el-form-item label="详细介绍">
          <div class="details">{{ t.details }}</div>
        </el-form-item>
        <el-form-item label="开放时间">
          {{ t.openingHours }} -
          {{ t.closingHours }}
        </el-form-item>
        <el-form-item label="景点类型">
          <div class="type">{{ t.tname }}</div>
        </el-form-item>
        <el-form-item label="门票价格">
          <div class="price">
            {{ t.ticketPrice === 0 ? '免费' : t.ticketPrice }}
          </div>
        </el-form-item>
        <el-form-item label="门票有效期/天">
          {{ t.ticketValidity }}
        </el-form-item>
      </el-form>
      <el-button type="warning" @click="toOrder(t.id, t.ticketPrice,t.ticketValidity)">立即购买</el-button>
    </div>
  </div>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="查看位置" name="1">
      <div class="map">
        <div class="mapHeader">
          <el-button type="primary" @click="locateTourist"
          >重新定位到景点
          </el-button>
          <el-button type="primary" @click="clearLine">清空路线</el-button>
          <el-button type="warning" @click="driveLine">
            <svg-icon name="car" style="font-size: 17px"></svg-icon>
            &nbsp;驾车路线
          </el-button>
          <el-button type="success" @click="walkLine">
            <svg-icon style="font-size: 19px" name="walk"></svg-icon>
            步行路线
          </el-button>
          <el-button type="info" @click="ridingLine" :icon="Bicycle">
            骑行路线
          </el-button>
          <transition name="way">
            <span style="margin-left: 5px" v-show="lineWayShow">
              <el-radio-group v-model="policy">
                <el-radio-button
                    label="最短时间"
                    value="BMAP_DRIVING_POLICY_LEAST_DISTANCE"/>
                <el-radio-button
                    label="最短距离"
                    value="BMAP_DRIVING_POLICY_LEAST_TIME"
                /></el-radio-group>
            </span>
          </transition>
        </div>
        <div style="margin:0 10px 0 5px;width: 400px">
          <transition name="el-zoom-in-center">
            <el-text v-show="currentPositionText !== ''">
              <el-icon>
                <Location/>
              </el-icon>
              当前位置：{{ currentPositionText }}
            </el-text>
          </transition>
        </div>
        <baidu-map
            v-loading="loading"
            ak="bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9"
            v="3.0"
            type="API"
            class="single-bm-view"
            :zoom="15"
            :center="centerPositionParams"
            :dragging="true"
            @ready="ready"
            :scroll-wheel-zoom="true"
        >
          <bm-marker
              :position="centerPositionParams"
              :dragging="true"
              :raiseOnDrag="true"
              animation="BMAP_ANIMATION_BOUNCE"
          >
          </bm-marker>
          <bm-geolocation
              anchor="BMAP_ANCHOR_TOP_RIGHT"
              :showAddressBar="true"
              :autoLocation="true"
          ></bm-geolocation>
          <bm-context-menu>
            <bm-context-menu-item
                :callback="locateTourist"
                text="定位到景点"
            ></bm-context-menu-item>
          </bm-context-menu>
          <bm-driving
              :start="currentPosition"
              :end="touristPosition"
              :auto-viewport="true"
              :policy="policy"
              :panel="true"
          >
          </bm-driving>
        </baidu-map>
      </div>
    </el-collapse-item>
  </el-collapse>
  <el-dialog
      v-model="showOrder"
      title="景点门票预定"
      width="800"
      destroy-on-close
      v-loading="orderLoading"
  >
    <div class="content">
      <el-form
          label-width="100"
          :model="orderForm"
          :rules="rules"
          ref="ruleFormRef"
      >
        <el-form-item label="用户名">
          <el-input v-model="user.name" disabled/>
        </el-form-item>
        <el-form-item label="预定日期" prop="orderTime">
          <el-date-picker
              v-model="orderForm.orderTime"
              type="date"
              :default-value="today"
              placeholder="选择门票预定日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
          />
          <span style="color: gray">&nbsp;&nbsp;最大能预定至未来三天</span>
        </el-form-item>
        <el-form-item label="有效期至">
          {{ orderForm.orderTime == '' ? '未选择预定时间' : ticketValidityDate }}
        </el-form-item>
        <el-form-item label="原价">
          ￥{{ orderForm.originalTotalAmount }}
        </el-form-item>
        <el-form-item label="选择优惠券">
          <el-select
              v-model="orderForm.couponAmount"
              :disabled="orderForm.checkInTime == ''"
              @change="handleCouponSelect"
          >
            <el-option label="不使用优惠券" value="0"/>
            <el-option
                v-for="item in userCouponList"
                :key="item.id"
                :label="item.name"
                :value="item.discountValue"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: left;color: gray"
              >&nbsp;&nbsp;&nbsp;{{ item.expirationDate }}过期</span
              >
              <span style="float: right;color: black;font-size: 19px;">
                ￥{{ item.discountValue }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠金额">
          ￥{{ orderForm.couponAmount }}
        </el-form-item>
        <el-form-item label="您需支付">
          <span style="font-size: 30px">￥{{ orderForm.totalAmount }}</span>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-radio-group v-model="orderForm.payType">
            <el-radio value="1" size="large" border style="color: #1ED76D">
              <svg-icon name="wechatpay"/>
              微信
            </el-radio>
            <el-radio value="2" size="large" border style="color: deepskyblue">
              <svg-icon name="alipay"/>
              支付宝
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showOrder = false">取消</el-button>
        <el-button type="primary" @click="submitOrder(ruleFormRef)">
          确认订单
        </el-button>
      </div>
    </template>
  </el-dialog>
  <Footer/>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {GetOneTA, OrderTA} from '@/api/home/tourist.js'
import Navs from '@/views/home/Navs.vue'
import {BaiduMap, BmContextMenu, BmContextMenuItem, BmDriving, BmGeolocation, BmMarker} from 'vue-baidu-map-3x'
import Footer from '@/views/home/Footer.vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {Bicycle, Location} from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {useUserinfo} from '@/components/Avatar/hooks/useUserinfo.js'
import {GetUserOrderCoupon} from '@/api/home/coupon.js'
const noPic = new URL('@/assets/no_pic.png', import.meta.url)
const user = ref({})
const router = useRouter()
const loading = ref(false)
const lineWayShow = ref(false)
const policy = ref('BMAP_DRIVING_POLICY_LEAST_TIME')
const currentPositionText = ref('')
const currentPosition = ref({
  lng: 0,
  lat: 0
})
const activeNames = ref('1')
const route = useRoute()
const touristPosition = ref({
  lng: 116.123,
  lat: 39.123
})

const centerPositionParams = ref({
  lng: 116.123,
  lat: 39.123
})
const t = ref({
  id: '',
  name: '',
  tid: '',
  description: '',
  details: '',
  grade: '',
  rating: 0,
  openingHours: '',
  closingHours: '',
  ticketPrice: 0,
  ticketValidity: null,
  photoUrls: [],
  lng: 116.404,
  lat: 39.915,
  address: '',
  region1Name: '',
  region2Name: '',
  region3Name: ''
})

const fetchData = async () => {
  const {data} = await GetOneTA(route.query.id)
  t.value = data
  if (data.photoUrls !== null && data.photoUrls !== '') {
    t.value.photoUrls = data.photoUrls.split(',')
  }
}
onMounted(async () => {
  await fetchData()
})
//初始化
const myMap = ref()
const myBMap = ref()
const ready = ({BMap, map}) => {
  touristPosition.value = {
    lng: t.value.lng,
    lat: t.value.lat
  }
  centerPositionParams.value = {
    lng: t.value.lng,
    lat: t.value.lat
  }
  myMap.value = map
  myBMap.value = BMap
}

const locateTourist = () => {
  var point = new myBMap.value.Point(t.value.lng, t.value.lat)
  var mk = new myBMap.value.Marker(point)
  mk.setAnimation('BMAP_ANIMATION_BOUNCE')
  myMap.value.addOverlay(mk)
  myMap.value.centerAndZoom(point, 15)
}
const driveLine = () => {
  loading.value = true
  clearLine()
  lineWayShow.value = true
  const geolocation = new myBMap.value.Geolocation()
  geolocation.getCurrentPosition(g => {
    if (g) {
      currentPositionText.value =
          g.address.city +
          g.address.district +
          g.address.province +
          g.address.street +
          g.address.street_number
      currentPosition.value = {
        lng: g.point.lng,
        lat: g.point.lat
      }
    } else ElMessage.error('获取位置失败')
  })
  loading.value = false
}
const walkLine = () => {
  loading.value = true
  clearLine()
  lineWayShow.value = false
  const geolocation = new myBMap.value.Geolocation()
  geolocation.getCurrentPosition(g => {
    if (g) {
      currentPositionText.value =
          g.address.city +
          g.address.district +
          g.address.province +
          g.address.street +
          g.address.street_number
      currentPosition.value = {
        lng: g.point.lng,
        lat: g.point.lat
      }
    } else ElMessage.error('获取位置失败')
  })
  // 创建步行路线实例
  var walkingRoute = new myBMap.value.WalkingRoute(myMap.value, {
    renderOptions: {map: myMap.value, autoViewport: true}
  })
  walkingRoute.search(currentPosition, touristPosition)
  loading.value = false
}
const ridingLine = () => {
  loading.value = true
  clearLine()
  lineWayShow.value = false
  const geolocation = new myBMap.value.Geolocation()
  geolocation.getCurrentPosition(g => {
    if (g) {
      currentPositionText.value =
          g.address.city +
          g.address.district +
          g.address.province +
          g.address.street +
          g.address.street_number
      currentPosition.value = {
        lng: g.point.lng,
        lat: g.point.lat
      }
    } else ElMessage.error('获取位置失败')
  })
  var walkingRoute = new myBMap.value.RidingRoute(myMap.value, {
    renderOptions: {map: myMap.value, autoViewport: true}
  })
  walkingRoute.search(currentPosition, touristPosition)
  loading.value = false
}
const clearLine = () => {
  lineWayShow.value = false
  myMap.value.clearOverlays()
  locateTourist()
}
//~~~~~~~~~~~~~~~订单~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const orderLoading = ref(false)
const orderForm = ref({
  tid: '',
  uid: '',
  payType: '',
  orderTime: '',
  ticketValidityDay: 0,
  couponId: '',
  couponAmount: 0,
  originalTotalAmount: 0,
  totalAmount: computed(() => {//应付金额
    return orderForm.value.originalTotalAmount - orderForm.value.couponAmount
  })
})
const today = new Date()
const disabledDate = (time) => {//日期选择器-禁用日期
  const now = new Date()
  return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) < time.getTime() || time.getTime() < new Date(now.getTime() - 24 * 60 * 60 * 1000)
}
const ticketValidityDate = computed(() => {//计算门票到期的时间
  if (orderForm.value.orderTime !== '') {
    const today = new Date()
    const validityDate = new Date(new Date(orderForm.value.orderTime).getTime() + orderForm.value.ticketValidityDay * 24 * 60 * 60 * 1000)
    const year = validityDate.getFullYear()
    const month = String(validityDate.getMonth() + 1).padStart(2, '0')
    const day = String(validityDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
})
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({
  payType: [
    {
      required: true,
      message: '请选择支付方式',
      trigger: 'blur'
    }
  ],
  orderTime: [
    {
      required: true,
      message: '请选择预定时间',
      trigger: 'blur'
    }
  ]
})
const showOrder = ref(false)
const toOrder = async (id, price, ticketValidity) => {
  //打开付款窗口
  const {userinfo} = useUserinfo()
  user.value = {...userinfo.value}
  if (!user.value.id) {
    await router.push({
      path: '/login',
      query: {
        redirect: route.fullPath,
        message: '请先登录'
      }
    })
  } else {
    showOrder.value = true
    orderForm.value.tid = id
    orderForm.value.uid = user.value.id
    orderForm.value.originalTotalAmount = price
    orderForm.value.ticketValidityDay = ticketValidity
  }
}
//查询可以使用优惠券的列表（当前日期《=过期日期，使用状态=0）
const userCouponList = ref([])
const fetchUserCouponList = async () => {
  const {data} = await GetUserOrderCoupon(
      2,
      user.value.id,
      orderForm.value.originalTotalAmount
  )
  userCouponList.value = data
}
const handleCouponSelect = val => {
  var obj = {}
  obj = userCouponList.value.find(function (item) {
    return item.discountValue === val
  })
  //将优惠券Id赋值给订单表
  orderForm.value.couponId = obj.id
}
//付款下单
const submitOrder = async formEl => {
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      orderLoading.value = true
      const {code} = await OrderTA(orderForm.value)
      if (code === 200) {
        ElMessage.success('下单成功')
        orderForm.value.payType = ''
        orderLoading.value = false
        showOrder.value = false
      } else ElMessage.success('下单失败')
    } else ElMessage.error('请填写完整信息')
  })
}
</script>

<style scoped lang="scss">
.main {
  margin: 20px 10% 0;
  display: flex;

  .images {
    .el-image {
      margin-right: 15px;
      height: 700px;
      width: 600px;
      border-radius: 2px;
    }
  }

  .right {
    margin-left: 20px;
    flex: 2;
    display: flex; /* 使用 flex 布局 */
    flex-direction: column; /* 设置为纵向布局 */
    .title {
      font-size: 35px;
      font-family: '宋体', sans-serif;
    }

    .price {
      color: red;
      font-size: 25px;
    }

    .el-button {
      width: 100px;
      height: 40px;
      font-size: 18px;
    }
  }
}

.el-collapse {
  margin: 30px 15vw;
}

.map {
  height: 70vh;

  .mapHeader {
    display: flex;
    margin-bottom: 15px;
  }

  .single-bm-view {
    border: #00f2fe 1px solid;
    width: 100%;
    height: 100%;
  }
}

.way-enter-active {
  animation: scale-in-hor-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.way-leave-active {
  animation: scale-out-hor-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

.way-enter-from,
.way-leave-to {
  opacity: 0;
}

/* ----------------------------------------------
 * Generated by Animista on 2024-4-26 17:4:20
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation scale-in-hor-left
 * ----------------------------------------
 */
@-webkit-keyframes scale-in-hor-left {
  0% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-hor-left {
  0% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

/* ----------------------------------------------
 * Generated by Animista on 2024-4-26 17:6:32
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation scale-out-hor-left
 * ----------------------------------------
 */
@-webkit-keyframes scale-out-hor-left {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    opacity: 1;
  }
}

@keyframes scale-out-hor-left {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    opacity: 1;
  }
}
</style>
