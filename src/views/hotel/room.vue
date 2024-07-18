<template>
  <div class="search-div">
    <el-row :gutter="30" justify="space-between">
      <el-col :span="6">
        <el-form-item label="地区选择">
          <el-cascader
            placeholder="请选择酒店地址"
            v-model="regionModel"
            :props="propsDto"
            @change="handleRegionModelChange()"
            style="width: 260px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="酒店选择">
          <el-select
            :disabled="regionModel.length === 0"
            v-model="queryDto.hid"
            placeholder="所有酒店"
            @change="fetchData"
          >
            <el-option
              v-for="(item, index) in hotelNameList"
              :key="index"
              :value="item.id"
              :value-key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="房间名称">
          <el-input
            v-model="queryDto.rName"
            placeholder="请输入要查找的房间名称"
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
            @click="deleteRoomBatchIds"
            :disabled="mutipleSelection.length === 0"
          >
            批量删除
          </el-button>
          <el-button type="success" @click="addRoom">添加</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
  <!--表-->
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column
      type="index"
      label="序号"
      sortable
      align="center"
      width="80"
    ></el-table-column>
    <el-table-column
      prop="rname"
      sortable
      align="center"
      label="房间名称"
    ></el-table-column>
    <el-table-column prop="hname" sortable label="酒店名称"></el-table-column>
    <el-table-column
      prop="rintroduction"
      :show-overflow-tooltip="true"
      label="详细介绍"
    >
    </el-table-column>
    <el-table-column
      prop="area"
      sortable
      align="center"
      label="面积"
      #default="scope"
      >{{ scope.row.area }} ㎡
    </el-table-column>
    <el-table-column
      prop="photoUrls"
      label="酒店照片"
      align="center"
      #default="scope"
      width="200"
    >
      <div style="height: 80px;">
        <el-image
          style="border-radius: 5px;border: white 1px solid"
          :fit="'scale-down'"
          :src="scope.row.photoUrls[0]"
          :preview-src-list="scope.row.photoUrls"
          :preview-teleported="true"
          :zoom-rate="1.2"
          :max-scale="8"
          :min-scale="0.2"
          alt=""
        />
      </div>
    </el-table-column>
    <el-table-column
      prop="bf"
      sortable
      label="早餐"
      align="center"
      #default="scope"
    >
      {{ scope.row.bf === 1 ? '免费' : '无' }}
    </el-table-column>
    <el-table-column prop="price" sortable label="单价" #default="scope">
      ¥{{ scope.row.price }}
    </el-table-column>
    <el-table-column prop="deposit" align="center" sortable label="押金">
      <template #default="scope">
        {{ scope.row.deposit === 0 ? '无' : scope.row.deposit }}
      </template>
    </el-table-column>
    <el-table-column
      prop="maxMan"
      align="center"
      sortable
      label=" 人数"
      #default="scope"
    >
      {{
        scope.row.maxMan === 1
          ? '单人房'
          : scope.row.maxMan === 2
          ? '双人房'
          : scope.row.maxMan + '人房'
      }}
    </el-table-column>
    <el-table-column
      prop="sales"
      align="center"
      label="已定/间"
    ></el-table-column>
    <el-table-column
      prop="stock"
      align="center"
      sortable
      label="总房间数"
    ></el-table-column>
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="editRoom(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteRoomById(scope.row)">
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
  <!--  添加/修改用户弹窗-->
  <el-dialog
    v-model="dialogVisible"
    title="添加/修改房间信息"
    width="50%"
    @close="clearAll"
    :destroy-on-close="true"
  >
    <el-form label-width="110">
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择所属酒店">
            <el-cascader
              placeholder="选择地区"
              :options="regionTree"
              v-model="AddRegionModel"
              :props="props"
              @change="handleAddRegionModelChange"
              style="width: 260px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-select
            :disabled="AddRegionModel.length === 0"
            v-model="roomForm.hid"
            placeholder="选择酒店"
          >
            <el-option
              v-for="(item, index) in AddHotelNameList"
              :key="index"
              :value="item.id"
              :value-key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-form-item label="房间名称">
        <el-input type="text" v-model="roomForm.rname" clearable></el-input>
      </el-form-item>
      <el-form-item label="酒店介绍">
        <el-input
          v-model="roomForm.rintroduction"
          type="textarea"
          :rows="2"
          placeholder="请详细介绍一下酒店的配置"
        ></el-input>
      </el-form-item>
      <el-form-item label="房间照片">
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
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="更多">
        <el-checkbox
          label="是否提供早餐"
          v-model="roomForm.bf"
          :true-label="1"
          :false-label="0"
        ></el-checkbox>
      </el-form-item>
      <el-form-item label="面积(㎡)">
        <el-input-number v-model="roomForm.area" :min="1" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="价格(￥)">
            <el-input-number
              v-model="roomForm.price"
              :min="1"
              :step="100"
              :max="99999"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="押金(￥)">
            <el-checkbox
              label="有"
              size="large"
              :checked="roomForm.deposit !== 0"
              v-model="haveDeposit"
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <el-input-number
              :disabled="!haveDeposit"
              v-model="roomForm.deposit"
              :min="0"
              :step="100"
              :max="99999"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="房间人数(人)">
        <el-input-number v-model="roomForm.maxMan" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="房间数(间)">
        <el-input-number v-model="roomForm.stock" :min="1" :max="99" />
      </el-form-item>
      <el-form-item style="margin-top: 30px">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import {
  DeleteRoomBatchIds,
  DeleteRoomById,
  GetRoomListByPage,
  SaveRoom,
  UpdateRoom
} from '@/api/room.js'
import { findRegionList } from '@/api/sysRegion.js'
import { DeleteHotelBatchIds, GetHotelNameList } from '@/api/hotel.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app.js'
import { Plus } from '@element-plus/icons-vue'
import { initRegionTree } from '@/pinia/modules/regionTree.js'

//~~~~~~~~~~~~~~~~~~~~~~地区级联~~~~~~~~~~~~~~~~~~~~~~~~~~
const regionModel = ref([])
const regionForSelect = ref({
  region1Id: '',
  region2Id: '',
  region3Id: ''
})
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
const handleRegionModelChange = async () => {
  //地区级联监听

  if (regionModel.value.length === 1) {
    queryDto.value.region1Id = regionModel.value[0]
    regionForSelect.value.region1Id = regionModel.value[0]
  } else if (regionModel.value.length === 2) {
    queryDto.value.region1Id = regionModel.value[0]
    regionForSelect.value.region1Id = regionModel.value[0]
    queryDto.value.region2Id = regionModel.value[1]
    regionForSelect.value.region2Id = regionModel.value[1]
  } else if (regionModel.value.length === 3) {
    queryDto.value.region1Id = regionModel.value[0]
    queryDto.value.region2Id = regionModel.value[1]
    queryDto.value.region3Id = regionModel.value[2]
    regionForSelect.value.region1Id = regionModel.value[0]
    regionForSelect.value.region2Id = regionModel.value[1]
    regionForSelect.value.region3Id = regionModel.value[2]
  }
  const { data } = await GetHotelNameList(regionForSelect.value) // 获取酒店名称list
  hotelNameList.value = data
  await fetchData()
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~搜索区~~~~~~~~~~~~~~~~~~~~~~~
const hotelNameList = ref({
  name: '',
  id: ''
}) //酒店选择器
const queryDto = ref({
  hid: null,
  rName: '',
  region1Id: '',
  region2Id: '',
  region3Id: ''
})
//~~~~~~~~~~~~~~~~~~~~~~数据表格~~~~~~~~~~~~~~~~~~~~~~
const list = ref()
const total = ref(0)
//分页数据
const pageParams = ref({
  page: 1,
  limit: 10
})
const regionTree = ref([])
onMounted(async () => {
  regionTree.value = await initRegionTree().getRegionTree()
  await fetchData()
})
const fetchData = async () => {
  const { code, message, data } = await GetRoomListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
  //处理照片url
  list.value.forEach(item => {
    item.photoUrls = item.photoUrls.split(',')
  })
}
//~~~~~~~~~~~~~~~~~~~~~~删除~~~~~~~~~~~~~~~~~~~~~~
//批量删除
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const deleteRoomBatchIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的房间', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteRoomBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//单选删除
const deleteRoomById = async row => {
  ElMessageBox.confirm('此操作将删除选中的酒店及酒店的所有房间', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteRoomById(row.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
//~~~~~~~~~~~~~~~~~~~~~~添加~~~~~~~~~~~~~~~~~~~~~~
const props = {
  //全部加载出来Tree地区
  checkStrictly: false,
  expandTrigger: 'hover',
  value: 'code',
  label: 'name',
  leaf: 'leaf'
}
const dialogVisible = ref(false)
const AddRegionModel = ref([0, 0, 0]) //添加窗口里的级联地区Model 123
const AddRegionModelForSelect = ref({
  region1Id: '',
  region2Id: '',
  region3Id: ''
}) //添加窗口里的地区请求搜索
const AddHotelNameList = ref([]) //添加窗口里的酒店名称选择器
const haveDeposit = ref(false)
const handleAddRegionModelChange = async () => {
  //地区级联监听
  if (AddRegionModel.value.length === 1) {
    AddRegionModelForSelect.value.region1Id = AddRegionModel.value[0]
  } else if (AddRegionModel.value.length === 2) {
    AddRegionModelForSelect.value.region1Id = AddRegionModel.value[0]
    AddRegionModelForSelect.value.region2Id = AddRegionModel.value[1]
  } else if (AddRegionModel.value.length === 3) {
    AddRegionModelForSelect.value.region1Id = AddRegionModel.value[0]
    AddRegionModelForSelect.value.region2Id = AddRegionModel.value[1]
    AddRegionModelForSelect.value.region3Id = AddRegionModel.value[2]
  }
  const { data } = await GetHotelNameList(AddRegionModelForSelect.value) // 获取酒店名称list
  AddHotelNameList.value = data
}
//添加表单
const roomForm = ref({
  id: '',
  hid: '',
  rname: '',
  rintroduction: '',
  area: 0,
  bf: 0,
  photoUrls: '',
  price: 0,
  deposit: 0,
  maxMan: 1,
  stock: 1,
  sales: 0
})
const addRoom = () => {
  dialogVisible.value = true
}
// 上传房间图图片
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
//~~~~~~~~~~~~“提交submit"按钮~~~~~~~~~~~~
const submit = async () => {
  roomForm.value.photoUrls = photoUrlList.value.join(',')
  if (!roomForm.value.id) {
    await SaveRoom(roomForm.value)
    ElMessage.success('添加成功')
  } else {
    console.log(roomForm.value)
    const { code, message, data } = await UpdateRoom(roomForm.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(message)
    }
  }
  dialogVisible.value = false
  await fetchData()
}
//~~~~~~~~~~~~~~~~~~~~~~修改~~~~~~~~~~~~~~~~~~~~~~
const editRoom = async row => {
  dialogVisible.value = true
  //地区回显
  AddRegionModel.value = [
    Number(row.region1Id),
    Number(row.region2Id),
    Number(row.region3Id)
  ]
  //酒店照片回显
  row.photoUrls.forEach(url => {
    fileList.value.push({ url: url }) //放入显示变量中
  })
  photoUrlList.value = row.photoUrls //放入上传变量中
  //酒店名称列表回显
  const { data } = await GetHotelNameList(AddRegionModelForSelect.value)
  AddHotelNameList.value = data
  roomForm.value = { ...row }
}
//~~~~~~~~~~~~~~~~~~~~~~重置~~~~~~~~~~~~~~~~~~~~~~
const clearAll = () => {
  fileList.value = []
  roomForm.value = {}
  AddHotelNameList.value = []
}
</script>
<style scoped lang="scss">
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
</style>
