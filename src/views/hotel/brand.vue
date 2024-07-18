<template>
  <div class="tools-div">
    <el-form-item label="品牌名称">
      <el-input
        placeholder="请输入要查找的品牌名称"
        v-model="queryDto.name"
        style="width: 270px"
      >
      </el-input>
      <el-button type="info" @click="clearAllDto" style="margin-left: 30px"
        >重置
      </el-button>
      <el-button type="primary" @click="fetchData" style="margin-left: 10px"
        >搜索
      </el-button>
      <el-button type="success" @click="addShow">添加品牌</el-button>
    </el-form-item>
  </div>
  <!--弹框-->
  <el-dialog v-model="dialogVisible" title="添加或修改" width="30%">
    <el-form label-width="120px" ref="loginFormRef">
      <el-form-item
        label="品牌名称"
        :rules="{
          message: 'hhh',
          trigger: 'blur'
        }"
      >
        <el-input v-model="brand.name" />
      </el-form-item>
      <el-form-item label="品牌图标">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8888/admin/product/brand/BrandFileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="brand.logo" :src="brand.logo" class="avatar" alt="" />
          <el-icon v-else class="avatar-uploader-icon" size="30">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="saveOrUpdate()"
          @enter="saveOrUpdate()"
        >
          提交
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-table :data="list" style="width: 100%">
    <el-table-column
      type="index"
      align="center"
      width="60"
      label="序号"
    ></el-table-column>
    <el-table-column prop="name" label="品牌名称" />
    <el-table-column prop="logo" label="logo" align="center" #default="scope">
      <el-image
        :src="scope.row.logo"
        style="width: auto; height:
      50px;background-color: ghostwhite"
        alt=""
      />
    </el-table-column>
    <el-table-column prop="company" label="所属公司" />
    <el-table-column prop="createTime" align="center" label="创建时间" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        删除
      </el-button>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 30, 60, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  DeleteBrandById,
  GetBrandPageList,
  SaveBrand,
  UpdateBrandById
} from '@/api/brand'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'
import { Plus } from '@element-plus/icons-vue'

// 定义表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)

const pageParams = ref({
  page: 1, // 页码
  limit: 10 // 每页记录数
})
// 钩子函数
onMounted(async () => {
  await fetchData()
})
//页面变化
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}
const queryDto = ref({ name: null })
// 分页查询
const fetchData = async () => {
  const { code, message, data } = await GetBrandPageList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}

const headers = {
  // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
  token: useApp().authorization.token
}
// 定义提交表单数据模型
const defaultForm = {
  id: '',
  name: '',
  logo: ''
}
const brand = ref(defaultForm)
const dialogVisible = ref(false)

// 显示添加品牌表单
const addShow = () => {
  brand.value = {}
  dialogVisible.value = true
}

//上传
const handleAvatarSuccess = response => {
  brand.value.logo = response.data
}
const loginFormRef = ref()
// 保存数据
const saveOrUpdate = () => {
  loginFormRef.value
    ?.validate('passwordValidator')
    .then(() => {
      // 验证通过
      if (!brand.value.id) {
        saveData()
      } else {
        updateData()
      }
    })
    .catch(err => {
      //验证失败
      ElMessage('请正确填写信息')
    })
}

// 新增
const saveData = async formEl => {
  await SaveBrand(brand.value)
  dialogVisible.value = false
  ElMessage.success('操作成功')
  await fetchData()
}

//进入修改
const editShow = row => {
  brand.value = row
  dialogVisible.value = true
}
// 修改
const updateData = async () => {
  await UpdateBrandById(brand.value)
  dialogVisible.value = false
  ElMessage.success('操作成功')
  await fetchData()
}
//删除
const remove = async id => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await DeleteBrandById(id)
    ElMessage.success('删除成功')
    await fetchData()
  })
}
//重置
const clearAllDto = async () => {
  queryDto.value = { name: '' }
  await fetchData()
}
</script>

<style scoped>
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
