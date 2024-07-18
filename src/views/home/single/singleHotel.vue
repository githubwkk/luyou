<template>
  <Navs />
  <PersonMenu class="menu" />
  <div class="body">
    <div class="company">
      <div class="logo">
        <el-image
          :src="h.logo"
          :fit="'contain'"
          style="border-radius: 80px;
height: 60px;width: 60px"
        ></el-image>
      </div>
      <div class="text">{{ h.company }}</div>
    </div>
    <div class="hName">{{ h.name }}</div>
    <div class="address">
      {{ h.address }} | {{ h.region3Name }},{{ h.region2Name }},{{
        h.region1Name
      }}
    </div>
    <div class="mm">
      <div class="image">
        <el-image :src="h.image"></el-image>
      </div>

      <div class="map">
        <baidu-map
          ak="bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9"
          v="3.0"
          type="API"
          class="single-bm-view"
          :zoom="15"
          @ready="ready"
          :center="centerPositionParams"
          :dragging="true"
          :scroll-wheel-zoom="true"
        >
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-marker
            :position="centerPositionParams"
            :dragging="true"
            :raiseOnDrag="true"
            animation="BMAP_ANIMATION_BOUNCE"
          ></bm-marker>
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
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
    </div>
    <el-collapse style="margin-top: 5px" v-model="activeNames">
      <el-collapse-item title="更多操作" name="1">
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
                  value="BMAP_DRIVING_POLICY_LEAST_DISTANCE" />
                <el-radio-button
                  label="最短距离"
                  value="BMAP_DRIVING_POLICY_LEAST_TIME"
                /></el-radio-group>
            </span>
          </transition>
        </div>
        <div style="margin:0 10px 0 0;width: 400px">
          <transition name="el-zoom-in-center">
            <el-text v-show="currentPositionText !== ''">
              <el-icon>
                <Location />
              </el-icon>
              当前位置：{{ currentPositionText }}
            </el-text>
          </transition>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="info">
      <el-row :gutter="15">
        <el-col :span="12">
          <div class="left">
            <div class="title">
              酒店介绍：（联系电话：<span>{{ h.phone }}</span
            >）
            </div>
            <div class="text">{{ h.introduction }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="right">
            <div class="title">
              设施
              <div class="span" @click="drawerShow = true">
                查看全部
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
            <div class="iconlist">
              <div class="icon">
                <img
                  src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/001.png"
                  alt=""
                />
                <div class="icon-name">停车场</div>
              </div>
              <div class="icon">
                <img
                  src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/021.png"
                  alt=""
                />
                <div class="icon-name">行李寄存</div>
              </div>
              <div class="icon">
                <img
                  src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/005.png"
                  alt=""
                />
                <div class="icon-name">24小时前台</div>
              </div>
              <div class="icon">
                <img
                  src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/006.png"
                  alt=""
                />
                <div class="icon-name">餐厅</div>
              </div>
              <div class="icon">
                <img
                  src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                  alt=""
                />
                <div class="icon-name">商务服务</div>
              </div>
              <div class="icon">
                <img
                  src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/027.png"
                  alt=""
                />
                <div class="icon-name">洗衣房</div>
              </div>
              <!--]-->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="roomList">
      <div class="room" v-for="(r, index) in roomList" :key="r.rid">
        <div class="imgR">
          <el-image
            :src="r.photoUrls[0]"
            :preview-src-list="r.photoUrls"
            :initial-index="0"
            fit="cover"
          ></el-image>
        </div>
        <div class="rightArea">
          <div class="rightArea-left">
            <div class="title">{{ r.rname }}</div>
            <div class="bf">
              <span v-if="r.bf === 1">含早餐</span
              ><span v-else-if="r.bf === 0">无早餐</span>
            </div>
            <div class="info">
              <span>{{ r.area }}㎡</span>&nbsp;&nbsp;|
              <span>可入住{{ r.maxMan }}人</span>
            </div>
            <div class="stock">
              剩余&nbsp;<span>{{ r.stock - r.sales }}</span
            >&nbsp;间
            </div>
            <div class="introduction">
              <el-tooltip
                effect="light"
                :content="r.rintroduction"
                placement="bottom-start"
              >
                {{ r.rintroduction }}
              </el-tooltip>
            </div>
          </div>
          <div class="rightArea-middle">
            <div class="price">
              ￥<span>{{ r.price }}</span>
            </div>
          </div>
          <!--           右边 -->
          <div class="rightArea-right">
            <div class="buttonArea">
              <div class="right" @click="toOrder(r.id, r.price, r.deposit)">
                <div class="btn-top">预定</div>
                <div class="btn-bottom">在线付</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="showOrder"
    title="酒店预定"
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
          <el-input v-model="user.name" disabled />
        </el-form-item>
        <el-form-item label="入住日期" prop="checkInTime">
          <el-date-picker
            v-model="datePicker"
            @change="datePickerHandle"
            type="daterange"
            range-separator="-"
            start-placeholder="入住日期"
            end-placeholder="退房日期"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
            :size="'large'"
          />
        </el-form-item>
        <el-form-item label="原价">
          ￥{{ orderForm.originalTotalAmount }}
        </el-form-item>
        <el-form-item label="押金"> ￥{{ deposit }}</el-form-item>
        <el-form-item label="选择优惠券">
          <el-select
            v-model="orderForm.couponAmount"
            :disabled="orderForm.checkInTime == ''"
            @change="handleCouponSelect"
          >
            <el-option label="不使用优惠券" value="0" />
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
          <span style="font-size: 30px">￥{{ lastPrice }}</span>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-radio-group v-model="orderForm.payType">
            <el-radio value="1" size="large" border style="color: #1ED76D">
              <svg-icon name="wechatpay" />
              微信
            </el-radio>
            <el-radio value="2" size="large" border style="color: deepskyblue">
              <svg-icon name="alipay" />
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
  <el-drawer v-model="drawerShow" title="设施" :direction="'rtl'">
    <div class="ss">
      <div class="module-content">
        <div class="amenities-info">
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/001.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>停车场</span><span class="amenities-tag">免费</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/021.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>行李寄存</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/005.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>24小时前台</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/005.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>叫醒服务</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/006.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>餐厅</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/005.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>机器人服务</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/028.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>公用区wifi</span><span class="amenities-tag">免费</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>儿童拖鞋</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>前台贵重物品保险柜</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>商务服务</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/029.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>无烟楼层</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/027.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>洗衣房</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>安保人员</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>自助入住机</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="amenities-info-item">
              <img
                src="http://m.elongstatic.com/hotel/h5/wechat-xcx/FacilitiesIcons/010.png"
                class="amenities-info-img"
              />
              <div>
                <div class="amenities-info-name">
                  <span>新风系统</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { GetHotelRoomList, GetOneHotel, OrderRoom } from '@/api/home/hotel.js'
import { GetUserOrderCoupon } from '@/api/home/coupon.js'
import Navs from '@/views/home/Navs.vue'
import {
  BaiduMap,
  BmContextMenu,
  BmContextMenuItem,
  BmDriving,
  BmGeolocation,
  BmMarker,
  BmNavigation
} from 'vue-baidu-map-3x'
import { ArrowRight, Bicycle, Location } from '@element-plus/icons-vue'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'
import PersonMenu from '@/views/home/components/PersonMenu.vue'

const orderLoading = ref(false)
const activeNames = ref('1')
const router = useRouter()
const drawerShow = ref(false)
const route = useRoute()
const showOrder = ref(false)
const h = ref({})
const roomList = ref([])
onMounted(async () => {
  const { data } = await GetOneHotel(route.query.id)
  h.value = { ...data }
  await fetchRoom(h.value.id)
})
//初始化
const loading = ref(false)
const lineWayShow = ref(false)
const touristPosition = ref({
  lng: 116.123,
  lat: 39.123
})
const policy = ref('BMAP_DRIVING_POLICY_LEAST_TIME')
const myMap = ref()
const myBMap = ref()
const currentPositionText = ref('')
const currentPosition = ref({
  lng: 0,
  lat: 0
})
const ready = ({ BMap, map }) => {
  touristPosition.value = {
    lng: h.value.lng,
    lat: h.value.lat
  }
  centerPositionParams.value = {
    lng: h.value.lng,
    lat: h.value.lat
  }
  myMap.value = map
  myBMap.value = BMap
}

const locateTourist = () => {
  var point = new myBMap.value.Point(h.value.lng, h.value.lat)
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
    renderOptions: { map: myMap.value, autoViewport: true }
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
    renderOptions: { map: myMap.value, autoViewport: true }
  })
  walkingRoute.search(currentPosition, touristPosition)
  loading.value = false
}

const clearLine = () => {
  lineWayShow.value = false
  myMap.value.clearOverlays()
  locateTourist()
}
const fetchRoom = async hid => {
  const { data } = await GetHotelRoomList(hid)
  roomList.value = data.data
  roomList.value.forEach(item => {
    item.photoUrls = item.photoUrls.split(',')
  })
}
const centerPositionParams = ref({
  lng: 116.123,
  lat: 39.123
})
const user = ref({})
const datePicker = ref([])
const datePickerHandle = async () => {
  await fetchUserCouponList()
  orderForm.value.checkInTime = datePicker.value[0]
  orderForm.value.checkOutTime = datePicker.value[1]
}
const deposit = ref(0) //押金
const djPrice = ref(0)
const orderForm = ref({
  hid: 0,
  rid: '',
  uid: 0,
  payType: '',
  checkInTime: '',
  checkOutTime: '',
  originalTotalAmount: computed(() => {
    return calculateDays() * djPrice.value + deposit.value
  }),
  totalAmount: 0,
  couponId: '',
  couponAmount: 0
})
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({
  checkInTime: [
    {
      required: true,
      message: '请选择日期',
      trigger: 'blur'
    }
  ],
  payType: [
    {
      required: true,
      message: '请选择支付方式',
      trigger: 'blur'
    }
  ]
})
//打开付款窗口
const toOrder = async (rid, price, d) => {
  const { userinfo } = useUserinfo()
  user.value = { ...userinfo.value }
  if (!user.value.id) {
    await router.push({
      path: '/login',
      query: {
        redirect: route.fullPath,
        message: '请先登录'
      }
    })
  } else {
    deposit.value = d //押金
    showOrder.value = true
    orderForm.value.rid = rid
    orderForm.value.hid = h.value.id
    orderForm.value.uid = user.value.id
    djPrice.value = price //每天单价
  }
}
//两个日期相减计算天数
const calculateDays = () => {
  if (
    orderForm.value.checkInTime !== '' &&
    orderForm.value.checkOutTime !== ''
  ) {
    const oneDay = 24 * 60 * 60 * 1000
    const firstDate = new Date(orderForm.value.checkInTime)
    const secondDate = new Date(orderForm.value.checkOutTime)
    return Math.round(Math.abs((firstDate - secondDate) / oneDay))
  } else return 0
}
//查询可以使用优惠券的列表（当前日期《=过期日期，使用状态=0）
const userCouponList = ref([])
const fetchUserCouponList = async () => {
  const { data } = await GetUserOrderCoupon(
    1,
    user.value.id,
    orderForm.value.originalTotalAmount
  )
  userCouponList.value = data
}
const handleCouponSelect = val => {
  var obj = {}
  obj = userCouponList.value.find(function(item) {
    return item.discountValue === val
  })

  //将优惠券Id赋值给订单表
  orderForm.value.couponId = obj.id
}
const lastPrice = computed(() => {
  return (
    calculateDays() * djPrice.value +
    deposit.value -
    orderForm.value.couponAmount
  )
})
//付款下单
const submitOrder = async formEl => {
  await formEl.validate(async (valid, fields) => {
    if (orderForm.value.checkInTime == orderForm.value.checkOutTime) {
      ElMessage.error('入住时间不能与退房时间相同')
    } else {
      if (valid) {
        orderLoading.value = true
        orderForm.value.totalAmount = lastPrice.value
        const { code } = await OrderRoom(orderForm.value)
        if (code === 200) {
          ElMessage.success('下单成功')
          orderForm.value.checkInTime = ''
          orderForm.value.checkOutTime = ''
          orderForm.value.payType = ''
          orderLoading.value = false
          showOrder.value = false
        } else ElMessage.success('下单失败')
      } else ElMessage.error('请填写完整信息')
    }
  })
}
const shortcuts = [
  {
    text: '未来三天',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
      return [start, end]
    }
  },
  {
    text: '未来五天',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '未来一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]
</script>
<style scoped lang="scss">
.body {
  width: 60%;
  height: 2000px;
  margin: 20px auto 0;

  .hName {
    font-size: 28px;
    font-weight: 700;
  }

  .company {
    display: flex;
    color: #5c5c5c;
    font-size: 16px;
    float: right;
    margin: 5px 10px 0 0;

    .el-image {
      width: 80px;
    }

    .text {
      margin-top: 15px;
    }
  }

  .address {
    font-size: 18px;
    margin: 5px 0;
  }

  .mm {
    --height1: 500px;
    display: flex;

    .image {
      height: var(--height1);
      width: 50%;

      .el-image {
        width: 100%;
        height: 100%;
      }
    }

    .map {
      margin-left: 10px;
      height: var(--height1);
      width: 50%;

      .single-bm-view {
        box-sizing: border-box;
        border: rgba(0, 242, 254, 0.6) 1px solid;
        width: 100%;
        height: 100%;
      }
    }
  }

  .info {
    width: 100%;
    margin-top: 20px;

    .left,
    .right {
      border: #eceff5 2px solid;
      box-sizing: border-box;
      padding: 20px;
      height: 150px;
      width: 100%;
      background-color: #ffffffcc;
    }

    .left {
      .title {
        font-size: 18px;

        span {
          color: cornflowerblue;
        }
      }

      .text {
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .right {
      .title {
        font-size: 18px;
        position: relative;

        .span {
          cursor: pointer;
          top: 1px;
          color: #8c8c8c;
          font-size: 15px;
          right: 0;
          position: absolute;
        }
      }

      .iconlist {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;

        .icon {
          width: calc(33.3%);
          display: flex;
          margin: 10px 0;
          font-size: 15px;

          img {
            width: 20px;
            height: 20px;
          }

          .icon-name {
            margin-left: 3px;
          }
        }
      }
    }
  }

  .roomList {
    width: 100%;
    margin-top: 20px;
    height: 290px;

    .room {
      padding: 25px 0;
      display: flex;

      .imgR {
        .el-image {
          width: 330px;
          height: 200px;
          border-radius: 5px;
        }
      }

      .rightArea {
        ---maginWidth: 20px;
        margin-left: var(---maginWidth);
        width: calc(100% - 330px - var(---maginWidth));
        height: 240px;
        padding: 10px 15px;
        box-sizing: border-box;
        background: linear-gradient(156deg, #fff6f3 18.27%, #fff 69.97%);
        border: 1px solid #f8d2c6;
        border-radius: 8px;
        display: flex;

        .rightArea-left {
          width: 75%;

          .title {
            color: #3f3e3d;
            font-size: 25px;
            font-weight: bold;
          }

          .bf,
          .info {
            color: #3f3e3d;
            margin: 5px 0;
            font-size: 17px;
          }

          .stock {
            font-size: 15px;

            span {
              font-size: 18px;
              color: grey;
            }
          }

          .introduction {
            color: grey;
            margin: 6px 0;
            width: 360px;
            height: 38px;
            overflow: hidden;
            text-overflow: ellipsis; /* 超出部分显示省略号 */
          }
        }

        .rightArea-middle {
          width: 100px;
          font-size: 25px;
          margin-top: 150px;
          margin-right: 15px;
          color: red;
          font-weight: 600;

          .price {
            text-align: right;

            span {
              font-size: 31px;
            }
          }
        }

        .rightArea-right {
          width: 15%;

          .buttonArea {
            cursor: pointer;
            display: block;
            position: relative;
            margin-top: 130px;

            .right {
              background: #07af53;
              border: 1px solid #07af53;
              border-radius: 6px;
              color: #fff;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              width: 92px;
              height: 63px;

              .btn-top {
                display: flex;
                height: 50%;
                color: white;
                justify-content: center;
                align-items: center;
              }

              .btn-bottom {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #ffffff;
                height: 50%;
                color: #07af53;
              }
            }
          }
        }
      }
    }
  }
}

.ss {
  overflow-y: auto;
  padding: 0;

  .amenities-info {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: start; /* 控制子元素在行上的对齐方式 */
    .amenities-info-item {
      margin: 20px 50px;
      display: flex;
      width: calc(50% - 20px);

      .amenities-info-name {
        margin-left: 5px;
        font-size: 16px;
        width: 110px;

        .amenities-tag {
          font-size: 12px;
          color: gray;
        }
      }

      img {
        width: 28px;
        height: 28px;
      }
    }
  }
}

.menu {
  position: absolute;
  top: 12px;
  right: 20px;
}

.mapHeader {
  display: flex;
  margin-bottom: 15px;
}
</style>
