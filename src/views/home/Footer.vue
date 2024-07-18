<template>
  <div>
    <div class="header">
      <div class="inner-header flex"></div>
      <div>
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <!-- 定义一个defs元素，用于存储各种元素的定义，可以被其他元素引用。
              在defs元素中定义了一个名为“gentle-wave”的路径元素，用于描述波浪形状
              改路径秒苏联一系列二次贝塞尔曲线的控制点坐标，从而实现了波浪形状 -->
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <!-- 定义一个g元素，用于讲多个图形组合在一期，并应用一些样式
              在g元素中使用use元素多次引用了赚钱定义的名为gentle-wave的路径元素
              通过设置不同的x，y坐标和填充颜色，实现了波浪形状和渐变效果 -->
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(142,190,226,0.7)"
            />
            123
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(142,190,226,0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="6"
              fill="rgba(245,245,245,0.3)"
            ></use>

            <use
              xlink:href="#gentle-wave"
              x="48"
              y="7"
              fill="rgb(245, 245, 245)"
            />
          </g>
        </svg>
      </div>
    </div>
    <div class="content1 flex">
      <div><p>智慧旅游网站</p></div>
      &nbsp;&nbsp;&nbsp;<span>|</span>&nbsp;&nbsp;&nbsp;
      <p>联系电话：8338899</p>
      &nbsp;&nbsp;&nbsp;<span>|</span>&nbsp;&nbsp;&nbsp;
      <el-dropdown trigger="hover">
        <div class="change-lang">
          {{ l === 'zh-cn' ? '简体中文' : 'English' }}
          <el-icon style="color: #AFAFAF">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="changeLang(item.value)"
              v-for="item in langlist"
              :key="item.value"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import useLang from '@/i18n/useLang'
import { CaretBottom } from '@element-plus/icons-vue'

let l = localStorage.getItem('__VEA__lang')
const langlist = [
  {
    name: '简体中文',
    value: 'zh-cn'
  },
  {
    name: 'English',
    value: 'en'
  }
]
const { changeLang } = useLang()
</script>
<style scoped lang="scss">


h1 {
  font-weight: 300;
  letter-spacing: 2px;
  font-size: 48px;
}

p {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
  font-size: 30px;
  color: #333333;
}

.header {
  position: relative;
  text-align: center;
  color: #409eff;
}

.inner-header {
  height: 150px;
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.waves {
  position: relative;
  width: 100%;
  height: 10px;
  margin-bottom: -17px;
  min-height: 100px;
  max-height: 150px;
}

.content1 {
  position: absolute;
  height: 10vh;
  text-align: center;
  width: 100%;
  background-color: rgba(245, 245, 245);

  span {
    color: gray;
  }

  p {
    font-size: 14px;
    color: #818d94;
  }

  .el-dropdown {
    color: #818d94;
    margin-bottom: 3px;
  }
}

.parallax > use {
  /* 使use元素执行move-forever动画 */
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
  /* 延迟2秒启动动画  */
  animation-delay: -2s;
  /* 设置动画持续时间为7秒 */
  animation-duration: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }

  .content {
    height: 30vh;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
