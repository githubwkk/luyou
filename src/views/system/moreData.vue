<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue"
import * as echarts from 'echarts'
const loading =ref(true)
const appStore = useApp()
const {sidebar} = storeToRefs(appStore)
const {setCollapse} = appStore
var t = null;
t = setTimeout(time, 1000); //開始运行
const nowTime = ref('')
const year=new Date().getFullYear()
function time() {
  clearTimeout(t); //清除定时器
  var dt = new Date();
  var y = dt.getFullYear();
  var mt = dt.getMonth() + 1;
  var day = dt.getDate();
  var h = dt.getHours(); //获取时
  var m = dt.getMinutes(); //获取分
  var s = dt.getSeconds(); //获取秒
  nowTime.value =
      y + "年" + mt + "月" + day + "      " + h + ":" + m + ":" + s ;
  t = setTimeout(time, 1000); //设定定时器，循环运行
}


const setHtmlFontSize = () => {
  const whei = window.innerWidth;
  document.querySelector('html').style.fontSize = `${whei / 20}px`;
}
const allData = ref()
const yearOfTouristCount=ref(0)
const yearOfTouristSales=ref(0)
onMounted(async () => {
  const {data} = await GetDark()
  allData.value = data
  yearOfTouristCount.value=allData.value.yearOfTouristCount
  yearOfTouristSales.value=allData.value.yearOfTouristSales
  //最小化边栏
  setCollapse(1)
  setHtmlFontSize()
  window.addEventListener('resize', setHtmlFontSize);
  echarts_1(); //左上角
  echarts_2(); //左中

  echarts_31();//饼图123
  echarts_32();
  echarts_33();
  echarts_4();//右上角
  echarts_5();//右中
  echarts_6();//右下角

  map();//中间大地图
  loading.value=false
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setHtmlFontSize);
})
// 左上角
const echart1 = ref(null)
const echarts_1 = () => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(echart1.value)

  const option = {
    //  backgroundColor: '#00265f',
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "0%",
      top: "10px",
      right: "0%",
      bottom: "4%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: allData.value.tt7.name,
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,.1)",
            width: 1,
            type: "solid",
          },
        },

        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          // rotate:50,
          show: true,
          splitNumber: 15,
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          //formatter: '{value} %'
          show: true,
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12",
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,.1	)",
            width: 1,
            type: "solid",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: allData.value.tt7.value,
        barWidth: "35%", //柱子宽度
        // barGap: 1, //柱子之间间距
        itemStyle: {
          normal: {
            color: "#2f89cf",
            opacity: 1,
            barBorderRadius: 5,
          },
        },
      },
    ],
  };

  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}
//左中
const echart2 = ref(null)

function echarts_2() {
  const myChart = echarts.init(echart2.value)
  const option = {
    //  backgroundColor: '#00265f',
    tooltip: {
      trigger: "axis",
      axisPointer: {type: "shadow"},
    },
    grid: {
      left: "0%",
      top: "10px",
      right: "0%",
      bottom: "4%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: allData.value.tt7s.name,
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,.1)",
            width: 1,
            type: "solid",
          },
        },

        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          // rotate:50,
          show: true,
          splitNumber: 15,
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          //formatter: '{value} %'
          show: true,
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12",
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,.1	)",
            width: 1,
            type: "solid",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: allData.value.tt7s.value,
        barWidth: "35%", //柱子宽度
        // barGap: 1, //柱子之间间距
        itemStyle: {
          normal: {
            color: "#27d08a",
            opacity: 1,
            barBorderRadius: 5,
          },
        },
      },
    ],
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

//饼图
const echart31 = ref(null)
const echart32 = ref(null)
const echart33 = ref(null)

function echarts_31() {
  const myChart = echarts.init(echart31.value)
  const option = {
    title: [
      {
        text: "消费用户性别比例",
        left: "center",
        textStyle: {
          color: "#fff",
          fontSize: "16",
        },
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: function (p) {
        //其中p为当前鼠标的位置
        return [p[0] + 10, p[1] - 10];
      },
    },
    legend: {
      top: "70%",
      itemWidth: 10,
      itemHeight: 10,
      data: ["男", "女"],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12",
      },
    },
    series: [
      {
        name: "用户消费性别比例",
        type: "pie",
        center: ["50%", "42%"],
        radius: ["40%", "60%"],
        color: [
          "#065aab",
          "#06f0ab",
        ],
        label: {show: false},
        labelLine: {show: false},
        data: allData.value.sex,
      },
    ],
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

function echarts_32() {
  const myChart = echarts.init(echart32.value);
  const option = {
    title: [
      {
        text: "酒店类型消费",
        left: "center",
        textStyle: {
          color: "#fff",
          fontSize: "16",
        },
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: function (p) {
        //其中p为当前鼠标的位置
        return [p[0] + 10, p[1] - 10];
      },
    },
    legend: {
      top: "70%",
      itemWidth: 10,
      itemHeight: 10,
      data: ["商务酒店", "民宿酒店", "星级酒店", "特色酒店"],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12",
      },
    },
    series: [
      {
        name: "酒店类型消费",
        type: "pie",
        center: ["50%", "42%"],
        radius: ["40%", "60%"],
        color: [
          "#065aab",
          "#0682ab",
          "#06a0ab",
          "#06f0ab",
        ],
        label: {show: false},
        labelLine: {show: false},
        data: allData.value.hotelSalesType,
      },
    ],
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

function echarts_33() {
  const myChart = echarts.init(echart33.value);
  const option = {
    title: [
      {
        text: "酒店类型数量",
        left: "center",
        textStyle: {
          color: "#fff",
          fontSize: "16",
        },
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: function (p) {
        //其中p为当前鼠标的位置
        return [p[0] + 10, p[1] - 10];
      },
    },
    legend: {
      top: "70%",
      itemWidth: 10,
      itemHeight: 10,
      data: ["商务酒店", "民宿酒店", "星级酒店", "特色酒店"],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12",
      },
    },
    series: [
      {
        name: "酒店类型数量",
        type: "pie",
        center: ["50%", "42%"],
        radius: ["40%", "60%"],
        color: [
          "#065aab",
          "#066eab",
          "#0682ab",
          "#0696ab",
          "#06a0ab",
          "#06b4ab",
          "#06c8ab",
          "#06dcab",
          "#06f0ab",
        ],
        label: {show: false},
        labelLine: {show: false},
        data: allData.value.hotelCountType,
      },
    ],
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

//右上角
const echart4 = ref(null)

function echarts_4() {
  const myChart = echarts.init(echart4.value);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#dddc6b",
        },
      },
      formatter: function (params) {
        return params[0].axisValue + '时<br/>' + '<span style="font-size: 18px">' + params[0].data + '￥</span>';
      }
    },
    grid: {
      left: "10",
      top: "30",
      right: "10",
      bottom: "10",
      containLabel: true,
    },

    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.2)",
          },
        },
        //name
        data:allData.value.hotelSales24.name,
      },
      {
        axisPointer: {show: false},
        axisLine: {show: false},
        position: "bottom",
        offset: 20,
      },
    ],

    yAxis: [
      {
        type: "value",
        axisTick: {show: false},
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
          },
        },

        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
      },
    ],
    series: [
      {
        name: "酒店",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#00d887",
            width: 2,
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 216, 135, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 216, 135, 0.1)",
                  },
                ],
                false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)",
          },
        },
        itemStyle: {
          normal: {
            color: "#00d887",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12,
          },
        },
        data:allData.value.hotelSales24.value,
      },
    ],
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

//右中
const echart5 = ref(null)

function echarts_5() {
  const myChart = echarts.init(echart5.value);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#dddc6b",
        },
      },
      formatter: function (params) {
        return params[0].axisValue + '时<br/>' + '<span style="font-size: 18px">' + params[0].data + '￥</span>';
      }
    },
    grid: {
      left: "10",
      top: "30",
      right: "10",
      bottom: "10",
      containLabel: true,
    },

    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.2)",
          },
        },
        //name
        data:allData.value.touristSales24.name,
      },
      {
        axisPointer: {show: false},
        axisLine: {show: false},
        position: "bottom",
        offset: 20,
      },
    ],

    yAxis: [
      {
        type: "value",
        axisTick: {show: false},
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
          },
        },

        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
      },
    ],
    series: [
      {
        name: "景点",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#0184d5",
            width: 2,
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)",
                  },
                ],
                false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)",
          },
        },
        itemStyle: {
          normal: {
            color: "#0184d5",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12,
          },
        },
        data: allData.value.touristSales24.value,
      }
    ],
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

//右下角
const echart6 = ref(null)

function echarts_6() {
  const myChart = echarts.init(echart6.value);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#dddc6b",
        },
      },
      formatter: function (params) {
        return params[0].axisValue + '时<br/>' + '<span style="font-size: 18px">' + params[0].data + '￥</span>';
      }
    },
    grid: {
      left: "10",
      top: "30",
      right: "10",
      bottom: "10",
      containLabel: true,
    },

    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.2)",
          },
        },
        //name
        data: allData.value.touristCount24.name,
      },
      {
        axisPointer: {show: false},
        axisLine: {show: false},
        position: "bottom",
        offset: 20,
      },
    ],

    yAxis: [
      {
        type: "value",
        axisTick: {show: false},
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12,
          },
        },

        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)",
          },
        },
      },
    ],
    series: [
      {
        name: "景点",
        type: "line",
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#69dcd3",
            width: 2,
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)",
                  },
                ],
                false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)",
          },
        },
        itemStyle: {
          normal: {
            color: "#0184d5",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12,
          },
        },
        data: allData.value.touristCount24.value,
      }
    ],
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

//中间地图
import chinaJson from '@/json/china.json'
import {storeToRefs} from "pinia"
import {useApp} from "@/pinia/modules/app.js"
import {GetDark} from "@/api/statistics.js"
import {GetTouristLocationJson} from "@/api/home/home.js"

const chinaMap = ref(null)

async function map() {
  //地图数据
  const {data} = await GetTouristLocationJson()
  const dataList = data
  const myChart = echarts.init(chinaMap.value)
  myChart.showLoading()
  echarts.registerMap('china', chinaJson)
  const option = {
    title: {
      text: "全国景点分布",
      left: "center",
      textStyle: {
        color: "#fff",
      },
    },
    // tooltip: {
    //   trigger: "item",
    //   formatter: function (params) {
    //     if (typeof params.value[2] == "undefined") {
    //       return params.name + " : " + params.value;
    //     } else {
    //       return params.name + " : " + params.value[2];
    //     }
    //   },
    // },

    geo: {
      map: "china",
      label: {
        emphasis: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          areaColor: "#4c60ff",
          borderColor: "#002097",
        },
        emphasis: {
          areaColor: "#293fff",
        },
      },
    },
    series: [
      {
        large:true,
        name: "消费金额",
        type: "scatter",
        coordinateSystem: "geo",
        data: dataList,
        symbolSize: 1,
        label: {
          normal: {
            formatter: "{b}",
            position: "right",
            show: false,
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: "#ffeb7b",
          },
        },
      },

      // {
      //   name: "Top 5",
      //   type: "effectScatter",
      //   coordinateSystem: "geo",
      //   data: convertData(
      //       data
      //           .sort(function (a, b) {
      //             return b.value - a.value;
      //           })
      //           .slice(0, 6)
      //   ),
      //   symbolSize: function (val) {
      //     return val[2] / 20;
      //   },
      //   showEffectOn: "render",
      //   rippleEffect: {
      //     brushType: "stroke",
      //   },
      //   hoverAnimation: true,
      //   label: {
      //     normal: {
      //       formatter: "{b}",
      //       position: "right",
      //       show: true,
      //     },
      //   },
      //   itemStyle: {
      //     normal: {
      //       color: "#ffd800",
      //       shadowBlur: 10,
      //       shadowColor: "rgba(0,0,0,.3)",
      //     },
      //   },
      //   zlevel: 1,
      // },
    ],
  };
  myChart.setOption(option);

  window.addEventListener("resize", function () {
    myChart.resize();
  });
  myChart.hideLoading()
}
</script>
<template>
  <div class="body" v-loading="loading">
    <div class="head">
      <h1>
        <a href="https://gitee.com/iGaoWei/big-data-view" style="color: white"
        >景点数据智慧大屏</a
        >
      </h1>
      <div class="weather">
        <span>{{ nowTime }}</span>
      </div>
    </div>
    <div class="mainbox">
      <ul class="clearfix">
        <li>
          <div class="boxall" style="height: 3.2rem">
            <div class="alltitle">年度景点销售前七</div>
            <div class="allnav" ref="echart1"></div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 3.2rem">
            <div class="alltitle">景点数量前七</div>
            <div class="allnav" ref="echart2"></div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 3.2rem">
            <div style="height: 100%; width: 100%">
              <div class="sy" ref="echart31"></div>
              <div class="sy" ref="echart32"></div>
              <div class="sy" ref="echart33"></div>
            </div>
            <div class="boxfoot"></div>
          </div>
        </li>
        <li>
          <div class="bar">
            <div class="barbox">
              <ul class="clearfix">
                <li class="pulll_left counter">{{ yearOfTouristCount }}</li>
                <li class="pulll_left counter">{{ yearOfTouristSales }}</li>
              </ul>
            </div>
            <div class="barbox2">
              <ul class="clearfix">
                <li class="pulll_left">{{ year }}年景点门票销售量</li>
                <li class="pulll_left">{{ year }}年景点门票销售额</li>
              </ul>
            </div>
          </div>
          <div class="map">
            <div class="map1"><img src="@/assets/moreData/lbx.png" alt=""/></div>
            <div class="map2"><img src="@/assets/moreData/jt.png" alt=""/></div>
            <div class="map3"><img src="@/assets/moreData/map.png" alt=""/></div>
            <div class="map4" id="map_1" ref="chinaMap"></div>
          </div>
        </li>
        <li>
          <div class="boxall" style="height: 3.4rem">
            <div class="alltitle">酒店24h内订单销售额</div>
            <div class="allnav" ref="echart4"></div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 3.2rem">
            <div class="alltitle">景点24h内订单销售额</div>
            <div class="allnav" ref="echart5"></div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 3rem">
            <div class="alltitle">景点24h内订单数量</div>
            <div class="allnav" ref="echart6"></div>
            <div class="boxfoot"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="back"></div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box
}

*, body {
  padding: 0px;
  margin: 0px;
  color: #222;
  font-family: "微软雅黑", serif;
}

@font-face {
  font-family: electronicFont;
  src: url(@/assets/font/DS-DIGIT.TTF)
}

.body {
  background: #000d4a url(@/assets/moreData/bg.jpg) center top;
  background-size: cover;
  color: #666;
  font-size: .1rem;
}

li {
  list-style-type: none;
}


i {
  margin: 0px;
  padding: 0px;
  text-indent: 0px;
}

img {
  border: none;
  max-width: 100%;
}

a {
  text-decoration: none;
  color: #399bff;
}

a.active, a:focus {
  outline: none !important;
  text-decoration: none;
}

ol, ul, p, h1, h2, h3, h4, h5, h6 {
  padding: 0;
  margin: 0
}

a:hover {
  color: #06c;
  text-decoration: none !important
}


.clearfix:after, .clearfix:before {
  display: table;
  content: " "
}

.clearfix:after {
  clear: both
}

.pulll_left {
  float: left;
}

.pulll_right {
  float: right;
}

/*谷哥滚动条样式*/

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  position: absolute
}

::-webkit-scrollbar-thumb {
  background-color: #5bc0de
}

::-webkit-scrollbar-track {
  background-color: #ddd
}

/***/

.allnav {
  height: calc(100% - 30px);
}


.head {
  height: 1.05rem;
  background: url(@/assets/moreData/head_bg.png) no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
}

.head h1 {
  color: #fff;
  text-align: center;
  font-size: .4rem;
  line-height: .8rem;
}

.head h1 img {
  width: 1.5rem;
  display: inline-block;
  vertical-align: middle;
  margin-right: .2rem
}

.weather {
  position: absolute;
  right: .3rem;
  top: 0;
  line-height: .75rem;
}

.weather img {
  width: .37rem;
  display: inline-block;
  vertical-align: middle;
}

.weather span {
  color: rgba(255, 255, 255, .7);
  font-size: .18rem;
  padding-right: .1rem;
}

.mainbox {
  padding: .1rem .1rem 0rem .1rem;
}


.mainbox > ul > li {
  float: left;
  padding: 0 .1rem
}

.mainbox > ul > li {
  width: 30%
}

.mainbox > ul > li:nth-child(2) {
  width: 40%;
  padding: 0
}

.boxall {
  border: 1px solid rgba(25, 186, 139, .17);
  padding: 0 .2rem .4rem .15rem;
  background: rgba(255, 255, 255, .04) url(@/assets/moreData/line.png);
  background-size: 100% auto;
  position: relative;
  margin-bottom: .15rem;
  z-index: 10;
}

.boxall:before,
.boxall:after {
  position: absolute;
  width: .1rem;
  height: .1rem;
  content: "";
  border-top: 2px solid #02a6b5;
  top: 0;
}

.boxall:before, .boxfoot:before {
  border-left: 2px solid #02a6b5;
  left: 0;
}

.boxall:after, .boxfoot:after {
  border-right: 2px solid #02a6b5;
  right: 0;
}

.alltitle {
  font-size: .2rem;
  color: #fff;
  text-align: center;
  line-height: .5rem;
}

.boxfoot {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}

.boxfoot:before,
.boxfoot:after {
  position: absolute;
  width: .1rem;
  height: .1rem;
  content: "";
  border-bottom: 2px solid #02a6b5;
  bottom: 0;
}

.bar {
  background: rgba(101, 132, 226, .1);
  padding: .15rem;
}

.barbox li, .barbox2 li {
  width: 50%;
  text-align: center;
  position: relative;
  z-index: 100;
}

.barbox:before,
.barbox:after {
  position: absolute;
  width: .3rem;
  height: .1rem;
  content: "";
}

.barbox:before {
  border-left: 2px solid #02a6b5;
  left: 0;
  border-top: 2px solid #02a6b5;
}

.barbox:after {
  border-right: 2px solid #02a6b5;
  right: 0;
  bottom: 0;
  border-bottom: 2px solid #02a6b5;
}

.barbox li:first-child:before {
  position: absolute;
  content: "";
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, .2);
  right: 0;
  top: 25%;
}

.barbox {
  border: 1px solid rgba(25, 186, 139, .17);
  position: relative;
}

.barbox li {
  font-size: .7rem;
  color: #ffeb7b;
  padding: .05rem 0;
  font-family: electronicFont;
  font-weight: bold;
}

.barbox2 li {
  font-size: .19rem;
  color: rgba(255, 255, 255, .7);
  padding-top: .1rem;
}

.map {
  position: relative;
  height: 7.2rem;
  z-index: 9;
}

.map4 {
  width: 200%;
  height: 7rem;
  position: relative;
  left: -50%;
  top: 4%;
  margin-top: .2rem;
  z-index: 5;
}

.map1, .map2, .map3 {
  position: absolute;
  opacity: .5
}

.map1 {
  width: 6.43rem;
  z-index: 2;
  top: .45rem;
  left: .7rem;
  animation: myfirst2 15s infinite linear;
}

.map2 {
  width: 5.66rem;
  top: .85rem;
  left: 1.2rem;
  z-index: 3;
  opacity: 0.2;
  animation: myfirst 10s infinite linear;
}

.map3 {
  width: 5.18rem;
  top: 1.07rem;
  left: 1.4rem;
  z-index: 1;
}


.tabs {
  text-align: center;
  padding: .1rem 0 0 0;
}

.tabs a {
  position: relative;
  display: inline-block;
  margin-left: 1px;
  padding: .05rem .2rem;
  color: #898989;
  transition: all .3s ease-out 0s;
  font-size: 14px;
}

.tabs li {
  display: inline-block;
}

.tabs a:after {
  position: absolute;
  width: 1px;
  height: 10px;
  background-color: rgba(255, 255, 255, .1);
  content: '';
  margin-left: 0;
  right: -1px;
  margin-top: 7px;


}

.tabs li a.active {
  border: 1px solid rgba(25, 186, 139, .17);
  background: rgba(255, 255, 255, .05);
  color: #fff;
}

.tit02 {
  text-align: center;
  margin: .1rem 0;
  position: relative
}

.tit02 span {
  border: 1px solid rgba(25, 186, 139, .17);
  letter-spacing: 2px;
  padding: .01rem .2rem;
  background: rgba(255, 255, 255, .05);
  font-size: .18rem;
  color: #49bcf7;
}

.tit02:before, .tit02:after {
  position: absolute;
  width: 26%;
  height: 1px;
  background: rgba(25, 186, 139, .2);
  content: "";
  top: .12rem;
}

.tit02:after {
  right: 0;
}

.tit02:before {
  left: 0;
}

.wrap {
  height: 2.54rem;
  overflow: hidden;
}

.wrap li {
  line-height: .42rem;
  height: .42rem;
  font-size: .18rem;
  text-indent: .24rem;
  margin-bottom: .1rem;
}

.wrap li p {
  border: 1px solid rgba(25, 186, 139, .17);
  color: rgba(255, 255, 255, .6);
}

.sy {
  float: left;
  width: 33%;
  height: 95%;
  margin-top: .25rem;
}


.adduser {
  height: 1.5rem;
  overflow: hidden;
}

.adduser li {
  height: .5rem;
}

.adduser img {
  width: .40rem;
  border-radius: .5rem;
  margin-right: .1rem;
  display: inline-block;
  vertical-align: middle;
}

.adduser span {
  line-height: .5rem;
  font-size: .18rem;
  color: rgba(255, 255, 255, .6);
}

.sycm ul {
  margin-left: -.5rem;
  margin-right: -.5rem;
  padding: .16rem 0;
}

.sycm li {
  float: left;
  width: 33.33%;
  text-align: center;
  position: relative
}

.sycm li:before {
  position: absolute;
  content: "";
  height: 30%;
  width: 1px;
  background: rgba(255, 255, 255, .1);
  right: 0;
  top: 15%;
}

.sycm li:last-child:before {
  width: 0;
}

.sycm li h2 {
  font-size: .3rem;
  color: #c5ccff;
}

.sycm li span {
  font-size: .18rem;
  color: #fff;
  opacity: .5;
}

@keyframes myfirst2 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

@keyframes myfirst {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-359deg);
  }
}


/*Plugin CSS*/
.str_wrap {
  overflow: hidden;
  width: 100%;
  position: relative;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  white-space: nowrap;
}


.str_move {
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  cursor: move;
}

.str_move_clone {
  display: inline-block;
  vertical-align: top;
  position: absolute;
  left: 100%;
  top: 0;
}

.str_vertical .str_move_clone {
  left: 0;
  top: 100%;
}

.str_down .str_move_clone {
  left: 0;
  bottom: 100%;
}

.str_vertical .str_move,
.str_down .str_move {
  white-space: normal;
  width: 100%;
}

.str_static .str_move,
.no_drag .str_move,
.noStop .str_move {
  cursor: inherit;
}

.str_wrap img {
  max-width: none !important;
}
</style>
