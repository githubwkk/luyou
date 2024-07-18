<template>
  <Navs />
  <div id="body">
    <div class="main">
      <el-row>
        <el-col :span="3">
          <h5 style="margin: 20px;font-size: 30px">个人中心</h5>
          <el-menu :default-active="'personalInformation'" router>
            <el-menu-item index="personalInformation">
              <el-icon>
                <User />
              </el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="myAccount">
              <el-icon>
                <Cellphone />
              </el-icon>
              <span>账号绑定</span>
            </el-menu-item>
            <el-menu-item index="hotelOrder">
              <el-icon>
                <OfficeBuilding />
              </el-icon>
              <span>酒店订单</span>
            </el-menu-item>
            <el-menu-item index="touristOrder">
              <el-icon>
                <PictureRounded />
              </el-icon>
              <span>门票订单</span>
            </el-menu-item>
            <el-menu-item index="myCoupon">
              <el-icon>
                <TakeawayBox />
              </el-icon>
              <span>我的优惠券</span>
            </el-menu-item>
            <el-menu-item index="myArticleCenter">
              <el-icon>
                <Document />
              </el-icon>
              <span>我的文章</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21">
          <div class="container">
            <router-view />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import Navs from '@/views/home/Navs.vue'
import {
  Cellphone,
  Document,
  OfficeBuilding,
  PictureRounded,
  TakeawayBox,
  User
} from '@element-plus/icons-vue'
</script>
<style scoped lang="scss">
#body {
  //background-color: #f4f6f9;
}

.main {
  width: 1520px;
  height: 100%;
  margin: auto;

  //.el-menu-item {
  //  background-color: #f4f6f9;
  //}

  .el-menu-item:hover {
    background-color: #f56c6c !important; /* 鼠标移入时的背景色 */
    color: #fff; /* 鼠标移入时的文字颜色 */
  }

  .container {
    width: 100%;
    height: 100%;
    margin: 60px 0 0 20px;
  }
}
</style>
