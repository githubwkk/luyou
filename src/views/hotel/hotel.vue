<template>
  <div class="search-div">
    <el-row :gutter="30" justify="space-between">
      <el-col :span="6">
        <el-form-item label="地区选择">
          <el-cascader
            placeholder="请选择酒店地址"
            v-model="dtoRegion"
            :props="propsDto"
            @change="handleDtoRegionChange()"
            style="width: 260px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="酒店名称">
          <el-input
            v-model="queryDto.hotelName"
            placeholder="请输入要查找的酒店名称"
            style="width: 270px"
          >
          </el-input>
          <el-button type="info" @click="clearAllDto" style="margin-left: 30px"
            >重置
          </el-button>
          <el-button type="primary" @click="fetchData" style="margin-left: 10px"
            >搜索
          </el-button>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <div class="rightFloat">
          <el-button
            type="danger"
            @click="deleteHotelByIds"
            :disabled="mutipleSelection.length === 0"
          >
            批量删除
          </el-button>
          <el-button type="success" @click="addHotel">添加</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
  <!--  数据表-->
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" sortable align="center" label="名称" />
    <el-table-column prop="type" align="center" label="类型">
      <template #default="scope">
        <span v-if="scope.row.type === 1">商务酒店</span>
        <span v-else-if="scope.row.type === 2">民宿酒店</span>
        <span v-else-if="scope.row.type === 3">星级酒店</span>
        <span v-else-if="scope.row.type === 4">特色酒店</span>
      </template>
    </el-table-column>
    <el-table-column prop="star" label="星级" align="center">
      <template #default="scope">
        <el-rate
          v-if="scope.row.star !== 0 && scope.row.star !== null"
          v-model="scope.row.star"
          disabled
          show-score
          text-color="#ff9900"
        />
        <span v-else>无</span>
      </template>
    </el-table-column>
    <el-table-column prop="introduction" label="简介" show-overflow-tooltip />
    <el-table-column prop="image" label="图片" #default="scope">
      <el-image
        :src="scope.row.image"
        style="width: auto; height:50px;background-color: ghostwhite"
        alt=""
      />
    </el-table-column>
    <el-table-column prop="address" label="详细地址" #default="scope">
    </el-table-column>
    <el-table-column prop="phone" label="联系电话" />
    <el-table-column prop="company" label="所属集团" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button
        type="info"
        size="small"
        @click="openSingleHotelPosition(scope.row)"
        >查看位置
      </el-button>
      <el-button type="primary" size="small" @click="editHotel(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteHotelById(scope.row)">
        删除
      </el-button>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
  <!--  添加/修改弹窗-->
  <el-dialog
    v-model="dialogVisible"
    title="添加/修改酒店信息"
    width="50%"
    top="2%"
    @close="clearAll"
    :destroy-on-close="true"
  >
    <el-form label-width="100">
      <el-row>
        <el-col :span="12">
          <el-form-item label="酒店名称">
            <el-input type="text" v-model="hotelForm.name" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="hotelForm.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="酒店品牌">
        <el-select
          style="width: 300px"
          placeholder="选择一个公司/品牌"
          v-model="hotelForm.brandId"
          value-key="id"
        >
          <el-option
            v-for="(item, index) in brandList"
            :key="index"
            :value="Number(item.id)"
            :label="item.name"
          >
            <!--自定义选择器-->
            <span style="float: left">{{ item.name }}</span>
            <span
              style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        "
              >{{ item.company }}</span
            >
          </el-option>
        </el-select>
        <div class="brandCompany" v-if="brandSelect.company">
          所属集团：{{ brandSelect.company }}
        </div>
      </el-form-item>
      <el-form-item label="类型">
        <el-select style="width: 200px" v-model="hotelForm.type">
          <el-option label="商务酒店" :value="1"></el-option>
          <el-option label="民宿酒店" :value="2"></el-option>
          <el-option label="星级酒店" :value="3"></el-option>
          <el-option label="特色酒店" :value="4"></el-option>
          <el-option label="其它" :value="5"></el-option>
        </el-select>
        <el-rate v-model="hotelForm.star" v-show="hotelForm.type === 3" />
      </el-form-item>
      <el-form-item label="酒店简介">
        <el-input
          type="textarea"
          v-model="hotelForm.introduction"
          :rows="2"
          placeholder="请简单介绍一下酒店"
          clearable
        />
      </el-form-item>
      <el-form-item label="酒店相片">
        <el-upload
          action="http://localhost:8888/admin/system/fileUpload"
          :show-file-list="false"
          list-type="picture"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img
            v-if="hotelForm.image"
            width="200px"
            height="150px"
            :src="hotelForm.image"
            alt="酒店相片"
          />
          <el-icon v-else class="uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地区">
            <el-cascader
              clearable
              :options="regionTree"
              v-model="regionValue"
              :props="props"
              @change="handleRegionChange()"
              style="width:300px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址">
            <el-input v-model="hotelForm.address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="酒店定位">
        <baidu-map
          ak="bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9"
          v="3.0"
          type="API"
          class="bm-view"
          :center="{ lng: hotelForm.lng, lat: hotelForm.lat }"
          :zoom="15"
          :dragging="true"
          :scroll-wheel-zoom="true"
          @click="mark"
        >
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-marker
            :position="markPoint"
            :dragging="true"
            :raiseOnDrag="true"
            animation="BMAP_ANIMATION_BOUNCE"
          ></bm-marker>
        </baidu-map>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--~~~~~~~~~~~~~查看位置(地图iframe)-->
  <el-dialog
    width="850px"
    v-model="singleHotelPosition"
    @open="open"
    :destroy-on-close="true"
  >
    <baidu-map
      v-if="singleHotelPosition"
      ak="bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9"
      v="3.0"
      type="API"
      class="single-bm-view"
      :zoom="15"
      :center="singleHotelPositionPointParams"
      :dragging="true"
      :scroll-wheel-zoom="true"
    >
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-marker
        :position="singleHotelPositionPointParams"
        :dragging="true"
        :raiseOnDrag="true"
        animation="BMAP_ANIMATION_BOUNCE"
      ></bm-marker>
    </baidu-map>
  </el-dialog>
</template>
<script setup>
import { BaiduMap, BmCityList, BmMarker, BmNavigation } from 'vue-baidu-map-3x'
import { onMounted, ref } from 'vue'
import {
  DeleteHotelBatchIds,
  DeleteHotelById,
  GetHotelListByPage,
  SaveHotel,
  updateHotel
} from '@/api/hotel.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findRegionList } from '@/api/sysRegion.js'
import { Plus } from '@element-plus/icons-vue'
import { useApp } from '@/pinia/modules/app.js'
import { FindAllBrand } from '@/api/brand.js'
import { initRegionTree } from '@/pinia/modules/regionTree.js'
//数据表格
const list = ref([])
const pageParams = ref({
  page: 1,
  limit: 10
})
const total = ref(0)
const fetchData = async () => {
  const { code, message, data } = await GetHotelListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}

onMounted(async () => {
  regionTree.value = await initRegionTree().getRegionTree()
  await fetchData()
})
//~~~~~~~~~~~~~~~~~地图~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const markPoint = ref({ lng: 116.404, lat: 39.915 }) //标记点坐标
const mark = e => {
  //图用
  markPoint.value.lng = e.point.lng
  markPoint.value.lat = e.point.lat
  //修改用
  hotelForm.value.lng = e.point.lng
  hotelForm.value.lat = e.point.lat
}
//~~~~~~~~~~单个酒店位置查看
const singleHotelPositionPointParams = ref({
  lng: 116,
  lat: 39
})

const singleHotelPosition = ref(false)

const openSingleHotelPosition = val => {
  singleHotelPositionPointParams.value.lat = val.lat
  singleHotelPositionPointParams.value.lng = val.lng
  singleHotelPosition.value = true
}
//地区级联选择框
const regionValue = ref([0, 0, 0])
const handleRegionChange = () => {
  if (regionValue.value.length === 1) {
    hotelForm.value.region1Id = regionValue.value[0]
  } else if (regionValue.value.length === 2) {
    hotelForm.value.region1Id = regionValue.value[0]
    hotelForm.value.region2Id = regionValue.value[1]
  } else if (regionValue.value.length === 3) {
    hotelForm.value.region1Id = regionValue.value[0]
    hotelForm.value.region2Id = regionValue.value[1]
    hotelForm.value.region3Id = regionValue.value[2]
  }
}

const props = {
  //全部加载出来Tree地区
  checkStrictly: false,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf'
}
const propsDto = {
  lazy: true,
  checkStrictly: true,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {
    // 加载数据的方法
    if (typeof node.value == 'undefined') node.value = 0
    const { data } = await findRegionList(node.value)
    data.forEach(function(item) {
      //hasChildren判断是否有子节点
      item.leaf = !item.hasChildren
    })
    resolve(data) // 返回数据
  }
}
//删除
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
//多选删除
const deleteHotelByIds = async () => {
  ElMessageBox.confirm('此操作将删除此酒店及酒店的所有房间', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteHotelBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//单选删除
const deleteHotelById = async row => {
  ElMessageBox.confirm('此操作将删除的酒店及酒店的所有房间', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteHotelById(row.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//添加
const dialogVisible = ref(false)
const brandList = ref([])
const brandSelect = ref({
  name: '',
  company: ''
})
//查询所有品牌数据的方法
const getBrandList = async () => {
  const { code, message, data } = await FindAllBrand()
  brandList.value = data
}
const addHotel = async () => {
  await getBrandList()
  dialogVisible.value = true
}
//清空置空(不清空添加时的默认经纬度)
const clearAll = () => {
  regionValue.value = []
  hotelForm.value.name = ''
  hotelForm.value.image = ''
  hotelForm.value.introduction = ''
  hotelForm.value.address = ''
  hotelForm.value.phone = ''
  hotelForm.value.lng = 116.404
  hotelForm.value.lat = 39.915
  hotelForm.value.region1Id = ''
  hotelForm.value.region2Id = ''
  hotelForm.value.region3Id = ''
  hotelForm.value.brandId = null
}
const defaultForm = {
  name: '',
  image: '',
  introduction: '',
  address: '',
  type: 1,
  star: 0,
  phone: '',
  lng: 116.404,
  lat: 39.915,
  brandId: null,
  region1Id: '',
  region2Id: '',
  region3Id: ''
}
const hotelForm = ref(defaultForm)
//“提交submit"按钮
const submit = async () => {
  if (!hotelForm.value.id) {
    await SaveHotel(hotelForm.value)
    ElMessage.success('添加成功')
  } else {
    const { code, message, data } = await updateHotel(hotelForm.value)
    if (code === 200) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(message)
    }
  }
  dialogVisible.value = false
  clearAll()
  await fetchData()
}
const headers = {
  token: useApp().authorization.token // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}
//    头像图像上传成功以后的事件处理函数
const handleAvatarSuccess = (response, uploadFile) => {
  hotelForm.value.image = response.data
}
//修改
const regionTree = ref()
const editHotel = async row => {
  await getBrandList()
  dialogVisible.value = true
  //绘制点
  markPoint.value.lat = row.lat
  markPoint.value.lng = row.lng
  //地区回显
  regionValue.value = [
    Number(row.region1Id),
    Number(row.region2Id),
    Number(row.region3Id)
  ]
  hotelForm.value = { ...row }
}
//~~~~~~~~~~~搜索区
//搜索数据表单模型
const queryDto = ref({
  hotelName: null,
  region1Id: null,
  region2Id: null,
  region3Id: null
})
const clearAllDto = () => {
  queryDto.value = {}
  dtoRegion.value = []
  fetchData()
}
//地区
const dtoRegion = ref([])
//搜索框查询
const handleDtoRegionChange = () => {
  if (dtoRegion.value.length === 1) {
    queryDto.value.region1Id = dtoRegion.value[0]
  } else if (dtoRegion.value.length === 2) {
    queryDto.value.region1Id = dtoRegion.value[0]
    queryDto.value.region2Id = dtoRegion.value[1]
  } else if (dtoRegion.value.length === 3) {
    queryDto.value.region1Id = dtoRegion.value[0]
    queryDto.value.region2Id = dtoRegion.value[1]
    queryDto.value.region3Id = dtoRegion.value[2]
  }
  fetchData()
}
</script>
<style scoped lang="scss">
.single-bm-view {
  width: 800px;
  height: 700px;
}

.bm-view {
  width: 800px;
  height: 580px;
}

.rightFloat {
  float: right;
}

.search-div {
  height: 35px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.brandCompany {
  font-size: 16px;
  margin-left: 10px;
}

.uploader-icon {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  text-align: center;
}

.uploader-icon:hover {
  border-color: var(--el-color-primary);
}
</style>
