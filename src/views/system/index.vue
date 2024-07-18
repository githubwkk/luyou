<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="toDayHotel.amount">
          <template #title>
            <div
                style="display: inline-flex; font-size: large;align-items: center"
            >
              今日酒店销售额
              <el-tooltip
                  effect="dark"
                  content="酒店的销售量总额"
                  placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>

        <div class="statistic-footer">
          <div class="footer-item">
            <span>相比昨天</span>
            <span class="green" v-if="toDayHotel.amountPercentage >= 0">
              {{ toDayHotel.amountPercentage }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            <span class="red" v-if="toDayHotel.amountPercentage < 0">
              {{ Math.abs(toDayHotel.amountPercentage) }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="toDayTourist.amount">
          <template #title>
            <div
                style="display: inline-flex; font-size: large;align-items: center"
            >
              今日景点销售额
              <el-tooltip effect="dark" content="" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>相比昨天</span>
            <span class="green" v-if="toDayTourist.amountPercentage >= 0">
              {{ toDayTourist.amountPercentage }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            <span class="red" v-if="toDayTourist.amountPercentage < 0">
              {{ Math.abs(toDayTourist.amountPercentage) }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="toDayTourist.num" title="New transactions today">
          <template #title>
            <div
                style="display: inline-flex;font-size: large; align-items: center"
            >
              今日景点订单总数
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>相比昨天</span>
            {{ output }}
            <span class="green" v-if="toDayTourist.numPercentage >= 0">
              {{ toDayTourist.numPercentage }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            <span class="red" v-if="toDayTourist.numPercentage < 0">
              {{ Math.abs(toDayTourist.numPercentage) }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value="693700">
          <template #title>
            <div
                style="display: inline-flex;font-size: large; align-items: center"
            >
              今日酒店订单总数
              <el-tooltip effect="dark" content="" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>相比昨天</span>
            <span class="green" v-if="toDayHotel.numPercentage >= 0">
              {{ toDayHotel.numPercentage }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            <span class="red" v-if="toDayHotel.numPercentage < 0">
              {{ Math.abs(toDayHotel.numPercentage) }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-dialog fullscreen append-to-body v-model="moreDataDialog"><more-data/></el-dialog>
  <el-row :gutter="16" style="margin-top: 20px">
    <!-- 条形图   -->
    <el-col :span="18">
      <div class="wb">
        <div class="card-header">
          <div class="card-title">景点销售情况</div>
          <div class="yearSelect">
            <el-select
                placeholder="Select"
                size="small"
                v-model="lineYear"
                @change="yearSelectHandle"
            >
              <el-option
                  v-for="item in optionsYear"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div id="line" ref="line" class="wb"></div>
      </div>
    </el-col>
    <el-col :span="6">
      <!-- 在线人数     -->
      <div class="wb" style="height: 137px">
        <div class="statistic-card">
          <el-statistic
              :value="onlineUser"
              value-style="color:#67C23A;font-weight:400;font-size:40px;"
              style="width: 200px"
          >
            <template #title>
              <div
                  style="display: inline-flex;font-size: large; align-items: center"
              >
                <el-icon size="20">
                  <UserFilled/>
                </el-icon>&nbsp; 在线人数
              </div>
            </template>
          </el-statistic>
        </div>

      </div>
      <!-- 饼图   -->
      <div class="wb" style="margin-top:20px;">
        <div class="card-header">
          <div class="card-title">景点类型销售占比</div>
        </div>
        <div id="pie" ref="pie"></div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="16" style="margin-top: 20px">
    <!-- 中国地图   -->
    <el-col :span="12">
      <div class="wb">
        <div class="card-header">
          <div class="card-title">全国酒店销售额发布图</div>
          <div class="switchMap">
            <div class="toggle-button-cover">
              <div id="button-3" class="button r">
                <input class="checkbox" type="checkbox" @click="switchMap"/>
                <div class="knobs"></div>
                <div class="layer"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="map" ref="map"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="wb" style="height: 280px">
        <div class="card-header">
          <div class="card-title">实时监控</div>
        </div>
        <el-row :gutter="16">
          <!--          左边-->
          <el-col :span="12">
            <div class="statistic-card">
              <el-statistic
                  :value="hotelNoCheckOutUIdList.length"
                  value-style="color:red;font-weight:600;font-size:50px"
              >
                <template #title>
                  <div
                      style="display: inline-flex;font-size: large; align-items: center"
                  >
                    <el-icon size="20">
                      <Avatar/>
                    </el-icon>&nbsp;
                    未退房用户/人
                  </div>
                </template>
              </el-statistic>
              <div style="margin: 10px 0">
                <el-button type="warning">一键提醒</el-button>
                <el-button>查看用户</el-button>
              </div>
            </div>
          </el-col>
          <el-divider direction="vertical" style="height: 220px"/>
          <!--     右边边     -->
          <el-col :span="11">
            <div style="padding: 15px;box-sizing: border-box;font-size: 18px">
              <div style="margin: 5px 0">
                <el-switch
                    size="large"
                    v-model="hotelSwitch"
                    @change="setSwitch('hotelCheckOut')"
                />
                提前退房提醒
              </div>
              <div style="margin: 8px 0">
                <el-switch
                    size="large"
                    v-model="couponSwitch"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #DCDFE6"
                    @change="setSwitch('coupon')"
                />
                优惠券过期提醒
              </div>
              <div style="margin: 8px 0">
                <el-switch
                    size="large"
                    v-model="touristSwitch"
                    style="--el-switch-on-color: #c2ce13; --el-switch-off-color: #DCDFE6"
                    @change="setSwitch('tourist')"
                />
                景点门票使用提醒
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="wb" style="margin-top: 20px">
        <div class="card-header">
          <div class="card-title">酒店品牌排名</div>
          <div class="days">
            <el-row>
              <div class="text">
                <el-tag size="large" class="tag" type="success">日期</el-tag>
              </div>
              <el-tabs v-model="activeDay" @tab-click="handleBrandDaysClick">
                <el-tab-pane
                    v-for="item in daysList"
                    :key="item"
                    :label="item"
                    :name="item"
                ></el-tab-pane>
              </el-tabs>
            </el-row>
          </div>
        </div>
        <div id="brandLine" ref="brandLine"></div>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import {markRaw, onMounted, ref} from 'vue'
import * as echarts from 'echarts'
import chinaJson from '@/json/china.json'
import {
  Avatar,
  CaretBottom,
  CaretTop,
  UserFilled,
  Warning
} from '@element-plus/icons-vue'
import {
  GetBrandRank,
  GetHotelMap,
  GetPieData,
  GetSwitch,
  GetTodayInfo,
  GetTouristLine,
  SetSwitch
} from '@/api/statistics.js'
import MoreData from "@/views/system/moreData.vue"

const moreDataDialog = ref(false)
const hotelMap = ref([]) //地图数据
const map = ref()
const brandLine = ref()
const brandLineList = ref([])
const line = ref()
const pie = ref()
const myMapChart = ref()
const myBrandLine = ref()
const myLineChart = ref()
const myPieChart = ref()
const lineYear = ref()
const toDayHotel = ref({})
const toDayTourist = ref({})
const onlineUser = ref(0)
const hotelNoCheckOutUIdList = ref([]) //未退房用户
lineYear.value = new Date().getFullYear()
const optionsYear = [
  {
    value: '2024',
    label: '2024'
  },
  {
    value: '2023',
    label: '2023'
  },
  {
    value: '2022',
    label: '2022'
  }
]
const yearSelectHandle = async () => {
  await initEchartsMap()
  await initEchartsLine()
  await initEchartsPie()
}

const touristLine = ref()
const pieData = ref()
onMounted(async () => {
  // 为窗口加上宽度变化事件，当宽高发生改变时，调用echarts的resize()方法，调整图表尺寸
  window.onresize = () => {
    myPieChart.value.resize()
    myLineChart.value.resize()
  }
  await initSwitch()
  await initToDayInfo()
  await initEchartsMap()
  await initEchartsLine()
  await initEchartsPie()
  await initBrandRankLine()
})
//初始化开关
const hotelSwitch = ref(true)
const couponSwitch = ref(true)
const touristSwitch = ref(true)
const setSwitch = async name => {
  // 设置开关值的方法
  await SetSwitch(name)
  await initSwitch()
}
const initSwitch = async () => {
  const {data} = await GetSwitch()
  hotelSwitch.value = data.hotelCheckOut
  touristSwitch.value = data.tourist
  couponSwitch.value = data.coupon
}
//品牌折线图
const daysList = ref([])
const activeDay = ref() //默认激活哪个日期
const initBrandRankLine = async () => {
  //获取前四天的日
  for (let i = 1; i < 5; i++) {
    let currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - i)
    let formattedDate = currentDate
        .getDate()
        .toString()
        .padStart(2, '0')
    daysList.value.push(formattedDate)
  }
  // 初始化品牌折线图
  activeDay.value = daysList.value[0]
  const {data} = await GetBrandRank(activeDay.value)
  brandLineList.value = data.brandRank
  myBrandLine.value = markRaw(
      echarts.init(brandLine.value, null, {renderer: 'svg'})
  )
  const option = {
    xAxis: {
      name: '订单量'
    },
    yAxis: {
      type: 'category',
      data: brandLineList.value.map(function (item) {
        return item.name
      }),
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 6 // only the largest 3 bars will be displayed
    },
    series: [
      {
        realtimeSort: true,
        name: '',
        type: 'bar',
        data: brandLineList.value.map(function (item) {
          return item.value
        }),
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        },
        itemStyle: {
          color: function (params) {
            const colorList = [
              '#5470c6',
              '#91cc75',
              '#fac858',
              '#ee6666',
              '#73c0de',
              '#3ba272',
              '#fc8452',
              '#9a60b4',
              '#ea7ccc'
            ]
            return colorList[params.dataIndex]
          }
        }
      }
    ],
    legend: {
      show: false
    },
    animationDuration: 0,
    animationDurationUpdate: 2800,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  }
  myBrandLine.value.setOption(option)
}
const refreshBrandLine = async () => {
  if (daysList.value.length === i) {
    i = 0
  } else {
    activeDay.value = daysList.value[i]
    i++
  }
  const {data} = await GetBrandRank(activeDay.value)
  brandLineList.value = data.brandRank
  myBrandLine.value.setOption({
    series: [
      {
        type: 'bar',
        data: brandLineList.value.map(function (item) {
          return item.value
        })
      }
    ]
  })
}
//排名折线图定时手动切换
const handleBrandDaysClick = async tab => {
  i = tab.index
  await refreshBrandLine()
}
//排名折线图定时自动切换
var i = 1
setInterval(async function () {
  await refreshBrandLine()
}, 4000)
//今日数据
const initToDayInfo = async () => {
  const {data} = await GetTodayInfo()
  hotelNoCheckOutUIdList.value = data.hotelNoCheckOutUIdList
  onlineUser.value = data.onlineUser
  toDayHotel.value = data.toDayHotel
  toDayTourist.value = data.toDayTourist
}
//折线图
const initEchartsLine = async () => {
  const {data} = await GetTouristLine(lineYear.value)
  touristLine.value = data
  myLineChart.value = markRaw(
      echarts.init(line.value, null, {renderer: 'svg'})
  )
  const option = {
    animationDuration: 2000,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    legend: {
      top: '5px',
      type: 'plain',
      data: ['门票销量', '销售总额']
    },
    xAxis: [
      {
        type: 'category',
        data: touristLine.value.dateList.slice(-10),
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '门票销售数',
        max: 15000
      },
      {
        type: 'value',
        name: '销售额',
        axisLabel: {
          formatter: '{value} ￥'
        }
      }
    ],
    series: [
      {
        name: '门票销量',
        type: 'bar',
        color: '#B4B5E7',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 张'
          }
        },
        data: touristLine.value.numList.slice(-10)
      },
      {
        name: '销售总额',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ￥'
          }
        },
        data: touristLine.value.amountList.slice(-10)
      }
    ]
  }
  myLineChart.value.setOption(option)
}
//饼图
const initEchartsPie = async () => {
  const {data} = await GetPieData(lineYear.value)
  pieData.value = data
  myPieChart.value = markRaw(echarts.init(pie.value, null, {renderer: 'svg'}))
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      padding: 10,
      // orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '景点类型',
        type: 'pie',
        //  radius: [50, 250],
        // center: ['50%', '50%'],
        // roseType: 'area',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData.value
      }
    ]
  }
  myPieChart.value.setOption(option)
}
//中国地图
const barOption = ref()
const mapOption = ref()
const initEchartsMap = async () => {
  echarts.registerMap('china', chinaJson)
  const {data} = await GetHotelMap()
  hotelMap.value = data
  hotelMap.value.sort(function (a, b) {
    return a.value - b.value
  })
  //地图变换参数
  const values = hotelMap.value.map(item => item.value)
  mapOption.value = {
    //鼠标移入提示框
    tooltip: {
      trigger: 'item',
      borderColor: '#a3cae5',
      formatter: function (data) {
        return '<b>' + data.name + '<b><br>' + data.value + '￥'
      }
    },
    //左侧小导航图标
    visualMap: {
      left: '20',
      min: Math.min(...values),
      max: Math.max(...values),
      inRange: {
        color: [
          '#8e92e4',
          '#5a6b91',
          '#7390b5',
          '#8da1c7',
          '#c2e6d7',
          '#f7fcf7',
          '#fdf7e4',
          '#fae6d9',
          '#f6bd8e',
          '#d9855e',
          '#b24c3c'
        ]
      },
      text: ['High', 'Low'],
      calculable: true
    },
    series: [
      {
        id: 'touristMap',
        name: '中国',
        type: 'map',
        map: 'china',
        animationDurationUpdate: 1000,
        //全局相同id动画关联
        universalTransition: true,
        label: {
          show: false, //显示省份名称
          color: 'red', //未选字体颜色
          fontSize: 12
        },
        itemStyle: {
          //每个板块的设计
          normal: {
            borderColor: 'rgba(255, 255, 255, 0.4)',
            areaColor: 'rgba(18,77,178,0.2)',
            borderWidth: 0.5,
            // 虚化程度
            // shadowBlur: 1,
            shadowColor: 'rgba(189,243,249)'
          },
          emphasis: {
            show: false,
            // 每个区域的颜色
            // 鼠标滑过颜色
            areaColor: '#97EFF4',
            // 鼠标滑过边框颜色
            shadowColor: '#05EFF7',
            // XY轴的偏移量
            shadowOffsetX: 5,
            shadowOffsetY: 5
          }
        },
        data: hotelMap.value
      }
    ]
  }
  //柱状图变换参数
  barOption.value = {
    tooltip: {
      trigger: 'axis',
      borderColor: '#a3cae5',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (data) {
        return '<b>' + data[0].name + '<b><br>' + data[0].value
      }
    },
    xAxis: {
      type: 'value',
      name: '订单总数',
      axisLabel: {
        formatter: '{value} ￥'
      }
    },
    yAxis: {
      type: 'category',
      axisLabel: {},
      data: hotelMap.value.map(function (item) {
        return item.name
      })
    },
    series: {
      type: 'bar',
      id: 'touristMap',
      data: hotelMap.value.map(function (item) {
        return item.value
      }),
      animationDurationUpdate: 1000,
      universalTransition: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: '#83bff6'},
          {offset: 0.5, color: '#188df0'},
          {offset: 1, color: '#188df0'}
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#2378f7'},
            {offset: 0.7, color: '#2378f7'},
            {offset: 1, color: '#83bff6'}
          ])
        }
      }
    }
  }
  myMapChart.value = markRaw(echarts.init(map.value, null, {renderer: 'svg'}))
  currentOption = mapOption.value
  myMapChart.value.setOption(mapOption.value)
}
let currentOption
const switchMap = () => {
  if (currentOption === mapOption.value) {
    currentOption = barOption.value
  } else currentOption = mapOption.value
  myMapChart.value.setOption(currentOption, true)
}
</script>
<style scoped lang="scss">
.wb {
  box-shadow: 0 2px 4px rgba(31, 30, 47, 0.03);
  background-color: #ffffff;
  border-radius: 4px;
}

.card-header {
  box-sizing: border-box;
  padding: 0 15px;
  width: 100%;
  height: 55px;
  display: flex;
  border-bottom: 1px solid #eceff5;
  align-items: center;

  .card-title {
    line-height: 55px;
    width: auto;
    text-transform: capitalize;
    letter-spacing: 0.02em;
    font-weight: 500;
    color: #2c3652;
    text-shadow: 0 0 1px rgba(241, 245, 250, 0.1);
    font-size: 20px;
    font-family: 'Roboto', sans-serif;
  }

  .yearSelect {
    margin-left: auto;
    width: 80px;
  }
}

#map {
  padding: 10px;
  width: 900px;
  height: 800px;
}

#brandLine {
  padding: 10px;
  height: 500px;
}

#line {
  width: 100%;
  height: 600px;
}

#pie {
  //width: 400px;
  height: 440px;
  width: 100%;
  //height: 100%;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

/*日期列表tags*/
.days {
  margin-left: auto;

  .text {
    margin-right: 20px;
    line-height: 55px;

    .tag {
      height: 60%;
      width: 60px;
      font-size: 15px;
    }
  }
}

:deep {
  .el-tabs {
    box-sizing: border-box;
    height: 55px;
  }

  .el-tabs__item {
    height: 55px;
  }

  .el-tabs__active-bar.is-top {
    background-color: transparent;
  }

  .el-tabs__item.is-top.is-active {
    background-color: rgba(0, 242, 254, 0.4);
    border-radius: 5px;
    padding: 0;
    width: 50px;
  }

  .el-tabs__nav .is-top {
    width: 60px;
    font-size: 16px;
  }

  .el-tabs__active-bar {
    width: 15px;
  }
}

/*切换图型按钮*/
.switchMap {
  margin-left: auto;
}

.toggle-button-cover {
  display: table-cell;
  position: relative;
  width: 100px;
  height: 50px;
  box-sizing: border-box;
  float: right;
}

.button-cover {
  height: 80px;
  margin: 15px;
  background-color: #fff;
  box-shadow: 0 10px 20px -8px #c5d6d6;
  border-radius: 4px;
}

.button-cover:before {
  counter-increment: button-counter;
  content: counter(button-counter);
  position: absolute;
  right: 0;
  bottom: 0;
  color: #d7e3e3;
  font-size: 12px;
  line-height: 1;
  padding: 5px;
}

.button-cover,
.knobs,
.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.button {
  position: relative;
  top: 50%;
  width: 64px;
  height: 28px;
  margin: -15px auto 0 auto;
  overflow: hidden;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: 0.3s ease all;
  z-index: 1;
}

.button.r,
.button.r .layer {
  border-radius: 100px;
}

#button-3 .knobs:before {
  content: 'Map';
  position: absolute;
  top: 0px;
  left: 4px;
  width: 20px;
  height: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  background-color: #03a9f4;
  border-radius: 50%;
  transition: 0.3s ease all, left 0.3s;
}

#button-3 .checkbox:active + .knobs:before {
  width: 50px;
  border-radius: 100px;
}

#button-3 .checkbox:checked:active + .knobs:before {
  margin-left: -29px;
}

#button-3 .checkbox:checked + .knobs:before {
  content: 'Bar';
  left: 36px;
  background-color: #f44336;
}

#button-3 .checkbox:checked ~ .layer {
  background-color: #fcebeb;
}
</style>
