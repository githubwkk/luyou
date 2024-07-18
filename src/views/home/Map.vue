<template>
  <div>
    <transition name="bounce">
      <div style="width: 1500px;margin: auto;">
        <el-button @click="reBackChinaMap" v-show="isreturn"
                   style="z-index:999;
      position: relative;

    ">返回
        </el-button>
      </div>
    </transition>
    <div ref="map" id="map" style="height: 1000px;width: 1500px;margin: auto"></div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import * as echarts from 'echarts'
import taiwan from '@/json/taiwan.json'
import beijing from '@/json/beijing.json'
import tianjin from '@/json/tianjin.json'
import hebei from '@/json/hebei.json'
import shanxi from '@/json/shanxi.json'
import neimenggu from '@/json/neimenggu.json'
import liaoning from '@/json/liaoning.json'
import jilin from '@/json/jilin.json'
import heilongjiang from '@/json/heilongjiang.json'
import shanghai from '@/json/shanghai.json'
import jiangsu from '@/json/jiangsu.json'
import zhejiang from '@/json/zhejiang.json'
import anhui from '@/json/anhui.json'
import fujian from '@/json/fujian.json'
import jiangxi from '@/json/jiangxi.json'
import shandong from '@/json/shandong.json'
import henan from '@/json/henan.json'
import hubei from '@/json/hubei.json'
import hunan from '@/json/hunan.json'
import guangdong from '@/json/guangdong.json'
import guangxi from '@/json/guangxi.json'
import hainan from '@/json/hainan.json'
import chongqing from '@/json/chongqing.json'
import sichuan from '@/json/sichuan.json'
import guizhou from '@/json/guizhou.json'
import yunnan from '@/json/yunnan.json'
import xizhang from '@/json/xizhang.json'
import shangxi from '@/json/shangxi.json'
import gansu from '@/json/gansu.json'
import qinghai from '@/json/qinghai.json'
import ningxia from '@/json/ningxia.json'
import xinjiang from '@/json/xinjiang.json'
import xianggang from '@/json/xianggang.json'
import aomen from '@/json/aomen.json'
import chinaJson from '@/json/china.json'
import {GetTouristLocationJson} from '@/api/home/home.js'
import {useRouter} from "vue-router"
const router = useRouter()
const jump1 = async id => {
  await router.push({
    path: '/singleTourist',
    query: {
      id: id
    }
  })
}
window.jump = jump1
let cityList = [
  {
    name: '北京市',
    code: 110000,
    data: beijing
  },
  {
    name: '天津市',
    code: 120000,
    data: tianjin
  },
  {
    name: '河北省',
    code: 130000,
    data: hebei
  },
  {
    name: '山西省',
    code: 140000,
    data: shanxi
  },
  {
    name: '内蒙古自治区',
    code: 150000,
    data: neimenggu
  },
  {
    name: '辽宁省',
    code: 210000,
    data: liaoning
  },
  {
    name: '吉林省',
    code: 220000,
    data: jilin
  },
  {
    name: '黑龙江省',
    code: 230000,
    data: heilongjiang
  },
  {
    name: '上海市',
    code: 310000,
    data: shanghai
  },
  {
    name: '江苏省',
    code: 320000,
    data: jiangsu
  },
  {
    name: '浙江省',
    code: 330000,
    data: zhejiang
  },
  {
    name: '安徽省',
    code: 340000,
    data: anhui
  },
  {
    name: '福建省',
    code: 350000,
    data: fujian
  },
  {
    name: '江西省',
    code: 360000,
    data: jiangxi
  },
  {
    name: '山东省',
    code: 370000,
    data: shandong
  },
  {
    name: '河南省',
    code: 410000,
    data: henan
  },
  {
    name: '湖北省',
    code: 420000,
    data: hubei
  },
  {
    name: '湖南省',
    code: 430000,
    data: hunan
  },
  {
    name: '广东省',
    code: 440000,
    data: guangdong
  },
  {
    name: '广西壮族自治区',
    code: 450000,
    data: guangxi
  },
  {
    name: '海南省',
    code: 460000,
    data: hainan
  },
  {
    name: '重庆市',
    code: 500000,
    data: chongqing
  },
  {
    name: '四川省',
    code: 510000,
    data: sichuan
  },
  {
    name: '贵州省',
    code: 520000,
    data: guizhou
  },
  {
    name: '云南省',
    code: 530000,
    data: yunnan
  },
  {
    name: '西藏自治区',
    code: 540000,
    data: xizhang
  },
  {
    name: '陕西省',
    code: 610000,
    data: shangxi
  },
  {
    name: '甘肃省',
    code: 620000,
    data: gansu
  },
  {
    name: '青海省',
    code: 630000,
    data: qinghai
  },
  {
    name: '宁夏回族自治区',
    code: 640000,
    data: ningxia
  },
  {
    name: '新疆维吾尔自治区',
    code: 650000,
    data: xinjiang
  },
  {
    name: '香港特别行政区',
    code: 810000,
    data: xianggang
  },
  {
    name: '澳门特别行政区',
    code: 820000,
    data: aomen
  },
  {
    name: '台湾省',
    code: 710000,
    data: taiwan
  }
]
const isreturn = ref(false)
const map = ref()
const bgImage = new URL('@/assets/regionsImg/main.jpg', import.meta.url).href
//鼠标移入板块的边框颜色
const borderColor = '#ffffff'
const mapOption = ref()
const myMapChart = ref()
const dataList = ref([])
echarts.registerMap('china', chinaJson)

const initChinaMap = async () => {
  myMapChart.value = echarts.init(map.value)
  // myMapChart.value.showLoading()
  const {data} = await GetTouristLocationJson()
  dataList.value = data


  mapOption.value = {
    // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
    roam: false,
    scaleLimit: {
      min: 1,
      max: 55
    },
    animation: true,
    backgroundColor: '#ffffff',
    //鼠标移入提示框
    tooltip: {
      trigger: 'item',
      triggerOn: 'click',                 //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发
      enterable: true,
      alwaysShowContent: true,
      backgroundColor: '#ffffff',
      borderColor: '#a3cae5',
      formatter: function (one) {
        return '<div style="font-size: 18px;font-weight: bold">' + one.data.name + '</div>' +
            '<div style="margin-top: 5px">价格：￥' + one.data.ticketPrice + '</div>' +
            '<div>地址：' + one.data.region2Name + '-' + one.data.region3Name + '</div> ' +
            '<span  onclick="jump(' + one.data.id + ')" target="_blank">点击查看更多</span>'
      }
    },

    geo: {
      map: 'china',
      label: {
        // 文字状态下的样式
        normal: {
          show: false,
          textStyle: {
            color: '#eceaea'
          }
        },
        // 文字-鼠标放上去高亮的样式
        emphasis: {
          show: false,
          textStyle: {
            color: '#ffffff'
          }
        }
      },
      /*
      * ··················自定义地区················
      */
      regions: [
        {
          name: '南海诸岛',
          itemStyle: {
            // 隐藏地图
            normal: {
              opacity: 0 // 为 0 时不绘制该图形
            }
          },
          label: {
            show: false // 隐藏文字
          }
        },
        {
          name: '广西壮族自治区',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
            // borderColor: 'rgba(0, 10, 52, 1)',
          }
          // label: {
          //   show: true,
          //   color: "#bb0932"
          // }
        },
        {
          name: '广东省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '云南省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '浙江省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '北京市',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '天津市',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '河北省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '山西省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '内蒙古自治区',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '辽宁省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '吉林省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '黑龙江省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '上海市',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '江苏省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '安徽省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '福建省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '江西省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '山东省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '河南省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '湖北省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '湖南省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '海南省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '重庆市',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '四川省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '贵州省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '西藏自治区',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '陕西省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '甘肃省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '青海省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '宁夏回族自治区',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '新疆维吾尔自治区',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        },
        {
          name: '台湾省',
          itemStyle: {
            areaColor: {
              image: bgImage
            },
            emphasis: {
              areaColor: {
                image: bgImage
              },
              borderColor: borderColor
            }
          }
        }
      ],
      // 地图区域的样式设置
      itemStyle: {
        normal: {
          borderColor: '#b8bbaa',
          borderWidth: 1.2
          // shadowColor: "#457b9d",
          // shadowOffsetX: -2,
          // shadowOffsetY: 2,
          // shadowBlur: 10,
        },
        // 鼠标放上去高亮的样式
        emphasis: {
          areaColor: {},
          borderWidth: 2
        }
      }
    },
    title: [{
      text: '',
      left: 'center',
      top: 20,
      textStyle: { //设置字体样式
        color: '#497fcf',
        fontSize: 35,
        fontFamily: '微软雅黑'
      }
    }],
    series: [
      {
        id: 'touristMap',
        name: '中国',
        coordinateSystem: 'geo',
        type: 'scatter',
        map: 'china',
        Symbol: 'circle',
        animationDurationUpdate: 1500,
        universalTransition: true,
        label: {//波点的label
          show: false, //显示省份名称
          color: 'red', //未选字体颜色
          fontSize: 12,
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          }
        },
        itemStyle: {
          emphasis: {
            borderWidth: 15,
            borderColor: '#D1CA7C',
            color: '#D1CA7C',
            scale: 10
          },
          //每个波点的设计
          normal: {
            color: '#D1CA7C'
            // 虚化程度
            // shadowBlur: 1,
            // shadowColor: 'rgba(189,243,249)'

          }
        },
        symbolSize: 6,
        data: []
      }
    ]
  }


  myMapChart.value.setOption(mapOption.value)
  // myMapChart.value.hideLoading()
  window.addEventListener('resize', () => {
    myMapChart.value.resize()
  })
  myMapChart.value.on('click', function (params) {
    // 获取点击的省份名称
    let provinceName = params.name
    // 判断点击的省份是否有标记点 有则只显示该省的标记 否则会将其他省份的坐标点一起显示
    mapOption.value.series[0].data = []

    dataList.value.map(item => {
      if (item.region1Name === provinceName) {
        mapOption.value.series[0].data.push(item)
      }
    })
    cityList.map(value => {
      if (value.name.indexOf(provinceName) !== -1) {
        myMapChart.value.clear()
        mapOption.value.geo.map = 'Pmap'
        mapOption.value.title[0].text = provinceName
        mapOption.value.roam = true
        echarts.registerMap('Pmap', value.data)
        myMapChart.value.setOption(mapOption.value)
        isreturn.value = true
      }
    })
  })
}

onMounted(async () => {
  await initChinaMap()
})
const reBackChinaMap = () => { //返回全国地图
  myMapChart.value.clear()
  mapOption.value.series[0].data = []
  mapOption.value.geo.map = 'china'
  mapOption.value.title[0].text = ''
  mapOption.value.roam = false
  echarts.registerMap('china', chinaJson)
  myMapChart.value.setOption(mapOption.value)
  isreturn.value = false
}


</script>
<style scoped lang="scss">
.bounce-enter-active {
  animation: bounce-in 2s;
}

.bounce-leave-active {
  animation: bounce-in 2s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

#map {
  /* 过渡效果 */
  animation: scale-up-center 1.34s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}


@keyframes scale-up-center {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

</style>
