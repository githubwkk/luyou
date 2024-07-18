<template>
  <!--  搜索区-->
  <div class="search-div">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-form-item label="地区选择">
          <el-cascader
              placeholder="请选择景点地址"
              v-model="regionDtoModel"
              :props="regionDtoProps"
              @change="regionDtoChangeHandle"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="景点名称">
          <el-input
              v-model="queryDto.name"
              style="width: 270px"
              placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="景点类型">
          <el-select v-model="queryDto.tid" @change="fetchData">
            <el-option
                v-for="item in tatList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="景点等级">
          <el-select v-model="queryDto.grade" @change="fetchData">
            <el-option
                v-for="item in gradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="景点评分">
          <el-select v-model="queryDto.rating" @change="fetchData">
            <el-option
                v-for="item in ratingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="addTA">添加景点</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="6">
        <el-form-item label="开放时间">
          <el-time-select
              placeholder="景点开放时间"
              v-model="queryDto.openingHours"
              :max-time="queryDto.closingHours"
              start="00:00"
              step="00:05:00"
              end="24:00"
              format="HH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="关闭时间">
          <el-time-select
              placeholder="景点关闭时间"
              v-model="queryDto.closingHours"
              :min-time="queryDto.openingHours"
              start="00:00"
              step="00:05"
              end="24:00"
              format="HH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="fetchData"  @keyup.enter="fetchData">
          搜索
        </el-button>
        <el-button type="info" @click="reset">重置</el-button>

        <el-button
            type="danger"
            :disabled="mutipleSelection.length === 0"
            @click="deleteBatchByIds"
        >删除多个
        </el-button>
      </el-col>
    </el-row>
  </div>
  <!--Table-->
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50"/>
    <el-table-column type="index" width="55" label="序号" align="center"/>
    <el-table-column label="名称" align="center" prop="name"/>
    <el-table-column label="类型" align="center" prop="tname" sortable/>
    <el-table-column
        label="简介"
        align="center"
        prop="description"
        :show-overflow-tooltip="true"
    />
    <el-table-column
        label="联系电话"
        align="center"
        prop="phone"
        :show-overflow-tooltip="true"
    />
    <el-table-column
        label="详细介绍"
        align="center"
        :show-overflow-tooltip="true"
        prop="details"
    />
    <el-table-column
        label="等级/A"
        prop="grade"
        align="center"
        #default="scope"
        sortable
    >{{ scope.row.grade }}A
    </el-table-column>
    <el-table-column label="评分" prop="rating" align="center" sortable/>
    <el-table-column
        label="开放时间"
        prop="openingHours"
        align="center"
        sortable
    />
    <el-table-column
        label="关闭时间"
        prop="closingHours"
        align="center"
        sortable
    />
    <el-table-column
        label="门票"
        sortable
        prop="ticketPrice"
        align="center"
        #default="scope"
    >{{ scope.row.ticketPrice === 0 ? '免费' : scope.row.ticketPrice + '￥' }}
    </el-table-column>
    <el-table-column
        label="门票有效天数"
        prop="ticketValidity"
        align="center"
    />
    <el-table-column
        label="景点图集"
        prop="photoUrls"
        align="center"
        #default="scope"
        width="200"
    >
      <el-image
          style="border-radius: 5px;border: white 1px solid;height: 80px;"
          :fit="'scale-down'"
          v-if="scope.row.photoUrls !== null"
          :src="scope.row.photoUrls[0]"
          :preview-src-list="scope.row.photoUrls"
          :preview-teleported="true"
          :zoom-rate="1.2"
          :max-scale="8"
          :min-scale="0.2"
          alt=""
      />
      <span v-else style="color: grey">无图片</span>
    </el-table-column>
    <el-table-column label="详细地址" prop="address"/>
    <el-table-column label="操作" align="center" #default="scope" width="230px">
      <el-button
          type="info"
          size="small"
          @click="openTableTAPosition(scope.row)"
      >查看位置
      </el-button>
      <el-button type="primary" size="small" @click="editTA(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteTAById(scope.row)">
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
  <!--查看景点地图-->
  <el-dialog
      v-model="tableTAPositionDialog"
      :destroy-on-close="true"
      width="880px"
      title="景点位置"
  >
    <baidu-map
        v-if="tableTAPositionDialog"
        ak="bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9"
        v="3.0"
        type="API"
        class="single-bm-view"
        :zoom="15"
        :center="tableTAPositionParams"
        :dragging="true"
        :scroll-wheel-zoom="true"
    >
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-marker
          :position="tableTAPositionParams"
          :dragging="true"
          :raiseOnDrag="true"
          animation="BMAP_ANIMATION_BOUNCE"
      ></bm-marker>
    </baidu-map>
  </el-dialog>
  <!--添加或修改窗体-->
  <el-dialog
      title="添加/修改景点信息"
      v-model="addDialog"
      :destroy-on-close="true"
      @close="clearAllData"
      width="50%"
      top="2%"
  >
    <el-form label-width="100">
      <el-row>
        <el-col :span="12">
          <el-form-item label="景点名称">
            <el-input v-model="TAForm.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="简介">
            <el-input v-model="TAForm.description"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="详细信息">
            <el-input
                type="textarea"
                rows="3"
                v-model="TAForm.details"
                placeholder="请输入关于景点的详细介绍"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在地区">
            <el-cascader
                clearable
                :options="regionTree"
                v-model="dialogRegionModel"
                :props="dialogRegionProps"
                @change="dialogRegionChangeHandle()"
                style="width:300px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="详细地址">
            <el-input v-model="TAForm.address"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="景点类型">
            <el-select v-model="TAForm.tid" style="width: 200px">
              <el-option
                  v-for="item in tatList"
                  :key="item.id"
                  :value="Number(item.id)"
                  :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="景点门票">
            <el-input-number
                :min="0"
                :max="999"
                :step="10"
                v-model="TAForm.ticketPrice"
            />
            &nbsp;￥
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有效天数">
            <el-input-number
                :disabled="TAForm.ticketPrice === 0"
                v-model="TAForm.ticketValidity"
                :min="0"
                :max="999"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开放时间">
            <el-time-select
                style="width: 200px"
                placeholder="景点开放时间"
                v-model="TAForm.openingHours"
                :max-time="TAForm.closingHours"
                start="00:00"
                step="00:05"
                end="24:00"
                format="HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关闭时间">
            <el-time-select
                style="width: 200px"
                placeholder="景点关闭时间"
                v-model="TAForm.closingHours"
                :min-time="TAForm.openingHours"
                start="00:00"
                step="00:05"
                end="24:00"
                format="HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="景点等级">
        <el-radio-group v-model="TAForm.grade">
          <el-radio
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="景点图片集">
        <el-upload
            v-model:file-list="fileList"
            action="http://localhost:8888/admin/system/fileUpload"
            list-type="picture-card"
            multiple
            :on-success="handleUploadPhotoSuccess"
            :on-remove="handleRemove"
            :headers="headers"
        >
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="景点位置">
        <baidu-map
            ak="bsg8hJwdNIUn2i2FTuCX9fe89B2LHcB9"
            v="3.0"
            type="API"
            class="bm-view"
            :center="{ lng: TAForm.lng, lat: TAForm.lat }"
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
        <el-button type="primary" @click="submit" @keyup.enter="submit">提交</el-button>
        <el-button @click="addDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import {
  DeleteTABatchIds,
  DeleteTAById,
  GetTAListByPage,
  SaveTA,
  updateTA
} from '@/api/touristAttractions.js'
import {DeleteTATById, GetAllTAT} from '@/api/touristAttractionsType.js'
import {ElMessage, ElMessageBox} from 'element-plus'
import {findRegionList} from '@/api/sysRegion.js'
import {BaiduMap, BmCityList, BmMarker, BmNavigation} from 'vue-baidu-map-3x'
import {initRegionTree} from '@/pinia/modules/regionTree.js'
import {Plus} from '@element-plus/icons-vue'
import {useApp} from '@/pinia/modules/app.js'

const regionTree = ref([])

onMounted(async () => {
  await fetchData()
  regionTree.value = await initRegionTree().getRegionTree()
  console.log(regionTree.value)
  const {data} = await GetAllTAT()
  tatList.value = data
})
//table
const list = ref([])
const total = ref(0)
const tatList = ref()
const pageParams = ref({
  page: 1,
  limit: 10
})
const regionDtoModel = ref([])
const regionDtoProps = {
  lazy: true,
  checkStrictly: true,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {
    if (typeof node.value == 'undefined') node.value = 0
    const {data} = await findRegionList(node.value)
    data.forEach(function (item) {
      item.leaf = !item.hasChildren
    })
    resolve(data)
  }
}
const regionDtoChangeHandle = async () => {
  if (regionDtoModel.value.length === 1) {
    queryDto.value.region1Id = regionDtoModel.value[0]
  } else if (regionDtoModel.value.length === 2) {
    queryDto.value.region1Id = regionDtoModel.value[0]
    queryDto.value.region2Id = regionDtoModel.value[1]
  } else if (regionDtoModel.value.length === 3) {
    queryDto.value.region1Id = regionDtoModel.value[0]
    queryDto.value.region2Id = regionDtoModel.value[1]
    queryDto.value.region3Id = regionDtoModel.value[2]
  }
  await fetchData()
}
const queryDto = ref({
  name: null,
  tid: null,
  rating: null,
  grade: null,
  openingHours: null,
  closingHours: null,
  region1Id: '',
  region2Id: '',
  region3Id: ''
})
const gradeOptions = ref([
  {value: 1, label: '1A'},
  {value: 2, label: '2A'},
  {value: 3, label: '3A'},
  {value: 4, label: '4A'},
  {value: 5, label: '5A'}
])
const ratingOptions = ref([
  {value: 5, label: '4~5'},
  {value: 4, label: '3~4'},
  {value: 3, label: '2~3'},
  {value: 2, label: '1~2'},
  {value: 1, label: '0~1'}
])
const fetchData = async () => {
  const {data} = await GetTAListByPage(
      pageParams.value.page,
      pageParams.value.limit,
      queryDto.value
  )
  list.value = data.records
  total.value = data.total
  //处理照片url
  list.value.forEach(item => {
    if (item.photoUrls !== '' && item.photoUrls != null) {

      item.photoUrls = item.photoUrls.split(',')
    }
  })
}
const reset = async () => {
    queryDto.value = {}
  await clearAllData()
  await fetchData()
}
const clearAllData = async () => {
  photoUrlList.value = []
  dialogRegionModel.value = []
  // queryDto.value = {}
  regionDtoModel.value = null
  fileList.value = []
  TAForm.value = {}
  TAForm.value.photoUrls = []
  TAForm.value.ticketPrice = 0
  TAForm.value.lng = 116.404
  TAForm.value.lat = 39.915
}
//查看位置
const tableTAPositionDialog = ref(false)
const tableTAPositionParams = ref({
  lng: 116,
  lat: 39
})
const openTableTAPosition = val => {
  tableTAPositionDialog.value = true
  tableTAPositionParams.value.lng = val.lng
  tableTAPositionParams.value.lat = val.lat
}
//当个删除
const deleteTAById = val => {
  ElMessageBox.confirm('此操作将删除此景点', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {message, data, code} = await DeleteTAById(val.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else ElMessage.error(message)
  })
}
//多选删除
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const deleteBatchByIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的景点信息', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {code} = await DeleteTABatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//添加
const addDialog = ref(false)
const TAForm = ref({
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
  photoUrls: '',
  lng: 116.404,
  lat: 39.915,
  address: '',
  region1Id: 0,
  region2Id: 0,
  region3Id: 0
})
const dialogRegionModel = ref([0, 0, 0])
const dialogRegionProps = {
  //全部加载出来Tree地区
  checkStrictly: false,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf'
}
const dialogRegionChangeHandle = () => {
  if (dialogRegionModel.value.length === 1) {
    TAForm.value.region1Id = dialogRegionModel.value[0]
  } else if (dialogRegionModel.value.length === 2) {
    TAForm.value.region1Id = dialogRegionModel.value[0]
    TAForm.value.region2Id = dialogRegionModel.value[1]
  } else if (dialogRegionModel.value.length === 3) {
    TAForm.value.region1Id = dialogRegionModel.value[0]
    TAForm.value.region2Id = dialogRegionModel.value[1]
    TAForm.value.region3Id = dialogRegionModel.value[2]
  }
}
const photoUrlList = ref([])
const headers = {
  token: useApp().authorization.token
}
const handleRemove = (uploadFile, uploadFiles) => {
  photoUrlList.value.splice(photoUrlList.value.indexOf(uploadFile.url), 1)
}
const fileList = ref([])
const handleUploadPhotoSuccess = (response, uploadFile) => {
  photoUrlList.value.push(response.data)
}
const addTA = async () => {
  addDialog.value = true
}
const markPoint = ref({lng: 116.404, lat: 39.915}) //标记点坐标
const mark = e => {
  //地图显示用
  markPoint.value.lng = e.point.lng
  markPoint.value.lat = e.point.lat
  //修改(添加）用
  TAForm.value.lng = e.point.lng
  TAForm.value.lat = e.point.lat
}
//修改
const editTA = async val => {
  addDialog.value = true
  //地区回显
  dialogRegionModel.value = [
    Number(val.region1Id),
    Number(val.region2Id),
    Number(val.region3Id)
  ]
  //地图回显
  markPoint.value.lat = val.lat
  markPoint.value.lng = val.lng
  TAForm.value = {...val}
  TAForm.value.tid = val.tid
  //酒店照片回显
  val.photoUrls.forEach(url => {
    fileList.value.push({url: url}) //放入显示变量中
  })
  photoUrlList.value = val.photoUrls //放入上传变量中
}
//修改/添加提交按钮
const submit = async () => {
  TAForm.value.photoUrls = photoUrlList.value.join(',')
  if (!TAForm.value.id) {
    const {code, message} = await SaveTA(TAForm.value)
    if (code === 200) {
      ElMessage.success('添加成功')
      addDialog.value = false
    } else {
      ElMessage.error(message)
    }
    ElMessage.success('添加成功')
  } else {
    const {code, message, data} = await updateTA(TAForm.value)
    if (code === 200) {
      ElMessage.success('修改成功')
      addDialog.value = false
    } else {
      ElMessage.error(message)
    }
  }
  await clearAllData()
  await fetchData()
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
</style>
