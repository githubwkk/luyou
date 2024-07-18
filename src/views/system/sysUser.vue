<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form>
      <el-row :gutter="30">
        <el-col :span="5">
          <el-form-item :label=" $t('sysUser.username') ">
            <el-input
                v-model="queryDto.keyword"
                style="width: 100%"
                :placeholder="$t('sysUser.peau')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('sysUser.phone')">
            <el-input
                v-model="queryDto.phone"
                style="width: 100%"
                :placeholder="$t('sysUser.peap')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('public.createTime')">
            <el-date-picker
                v-model="createTimes"
                type="daterange"
                range-separator="To"
                :start-placeholder="$t('public.startdate')"
                :end-placeholder="$t('public.enddate')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="searchSysUser">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="resetData"> {{ $t('public.reset') }}</el-button>
          <el-button class="addUser" type="success" @click="addShow"
          > {{ $t('public.add') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <!-- 添加用户弹窗-->
  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px">
      <el-form-item :label="$t('sysUser.username')">
        <el-input v-model="sysUser.username"/>
      </el-form-item>
      <el-form-item v-if="sysUser.id == null" :label="$t('login.password')">
        <el-input type="password" show-password v-model="sysUser.password"/>
      </el-form-item>
      <el-form-item :label="$t('sysUser.name')">
        <el-input v-model="sysUser.name"/>
      </el-form-item>
      <el-form-item :label="$t('sysUser.sex')">
        <el-radio-group v-model="sysUser.sex">
          <el-radio :label="1">{{ $t('public.male') }}</el-radio>
          <el-radio :label="0">{{ $t('public.female') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('sysUser.email')">
        <el-input v-model="sysUser.email"/>
      </el-form-item>
      <el-form-item :label="$t('sysUser.phone')">
        <el-input v-model="sysUser.phone"/>
      </el-form-item>
      <el-form-item :label="$t('sysUser.avatar')">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:8888/admin/system/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
        >
          <img
              v-if="sysUser.avatar"
              :src="sysUser.avatar"
              class="avatar"
              alt=""
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('sysUser.description')">
        <el-input v-model="sysUser.description"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">{{ $t('public.submit') }}</el-button>
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!---数据表格-->
  <el-table :data="list" #default="scope" style="width: 100%">
    <el-table-column prop="username" sortable :label="$t('sysUser.username')"/>
    <el-table-column prop="name" sortable :label="$t('sysUser.username')"/>
    <el-table-column
        prop="sex"
        :label="$t('sysUser.sex')"
        width="80 "
        header-align="center"
        align="center"
        #default="scope"
    >
      {{ scope.row.sex === 1 ? $t('public.male') : $t('public.female') }}
    </el-table-column>

    <el-table-column prop="email" :label="$t('sysUser.email')"/>
    <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        :label="$t('sysUser.phone')"
    />
    <el-table-column
        prop="avatar"
        :label="$t('sysUser.avatar')"
        header-align="center"
        align="center"
        #default="scope"
    >
      <el-avatar :src="scope.row.avatar" shape="square" :size="50"></el-avatar>
    </el-table-column>
    <el-table-column prop="description" :label="$t('sysUser.description')"/>
    <el-table-column prop="status" sortable :label="$t('public.status')" #default="scope">
      {{ scope.row.status === 1 ? $t('sysUser.normal') : $t('sysUser.Deactivated') }}
    </el-table-column>
    <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        sortable
        min-width="90"
        :label="$t('public.createTime')"
    />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="editSysUser(scope.row)">
        {{ $t('public.edit') }}
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row)">
        {{ $t('public.delete') }}
      </el-button>
      <el-button type="warning" size="small" @click="showAssignRole(scope.row)">
        {{ $t('sysUser.AssignRoles') }}
      </el-button>
    </el-table-column>
  </el-table>

  <!--分配角色弹窗-->
  <el-dialog v-model="dialogRoleVisible" :title="$t('sysUser.AssignRoles')" width="40%">
    <el-form label-width="80px">
      <el-form-item :label="$t('sysUser.username')">
        <el-input disabled :value="sysUser.username"></el-input>
      </el-form-item>

      <el-form-item :label="$t('sysUser.roleList')">
        <el-checkbox-group v-model="userRoleIds">
          <el-checkbox
              v-for="role in allRoles"
              :key="Number(role.id)"
              :label="Number(role.id)"
              :checked="roleIsSelected(Number(role.id))"
          >
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="doAssign">{{ $t('public.submit') }}</el-button>
        <el-button @click="dialogRoleVisible = false">{{ $t('public.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
  />
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue'
import {
  DeleteSysUserById,
  DoAssignRoleToUser,
  GetSysUserListByPage,
  SaveSysUser,
  UpdateSysUser
} from '@/api/sysUser'
import {ElMessage, ElMessageBox} from 'element-plus'
import {GetAllRoleList} from '@/api/sysRole'
import {useApp} from '@/pinia/modules/app'
import {Plus} from '@element-plus/icons-vue'

const {proxy: ctx} = getCurrentInstance()
// 表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)

// 定义搜索表单数据模型
const queryDto = ref({
  keyword: '',
  phone: '',
  createTimeBegin: '',
  createTimeEnd: ''
})
const createTimes = ref([])

//分页数据
const pageParamsForm = {
  page: 1, // 页码
  limit: 10 // 每页记录数
}
const pageParams = ref(pageParamsForm)

// onMounted钩子函数
onMounted(() => {
  fetchData()
})

// 搜素按钮点击事件处理函数
const searchSysUser = () => {
  fetchData()
}

// 重置按钮点击事件处理函数
const resetData = () => {
  queryDto.value = {}
  createTimes.value = []
  fetchData()
}

// 定义分页查询方法
const fetchData = async () => {
  if (createTimes.value.length === 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }
  // 请求后端接口进行分页查询
  const {code, message, data} = await GetSysUserListByPage(
      pageParams.value.page,
      pageParams.value.limit,
      queryDto.value
  )
  list.value = data.records
  total.value = data.total
  sysUser.value = ''
}
// 添加表单对话框显示隐藏控制变量
const dialogVisible = ref(false)
const addShow = () => {
  sysUser.value = {}
  dialogVisible.value = true
}
// 定义提交表单数据模型
const defaultForm = {
  username: '',
  name: '',
  sex: '',
  email: '',
  phone: '',
  password: '',
  description: '',
  avatar: ''
}
const sysUser = ref(defaultForm)

// 修改按钮点击事件处理函数
const editSysUser = row => {
  dialogVisible.value = true
  sysUser.value = {...row}
}
const headers = {
  token: useApp().authorization.token // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}
// 头像图像上传成功以后的事件处理函数
const handleAvatarSuccess = (response, uploadFile) => {
  sysUser.value.avatar = response.data
}
// 提交按钮事件处理函数
const submit = async () => {
  if (!sysUser.value.id) {
    const {code, message, data} = await SaveSysUser(sysUser.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  } else {
    const {code, message, data} = await UpdateSysUser(sysUser.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  }
}

// 删除用户
const deleteById = row => {
  ElMessageBox.confirm(ctx.$t('public.DeletionConfirmation'), 'Warning', {
    confirmButtonText: ctx.$t('public.sure'),
    cancelButtonText: ctx.$t('public.cancel'),
    type: 'warning'
  }).then(async () => {
    const {code} = await DeleteSysUserById(row.id)
    if (code === 200) {
      ElMessage.success(ctx.$t('public.successfullyDelete'))
      await fetchData()
    }
  })
}

// 角色列表
const userRoleIds = ref()
const allRoles = ref()
const dialogRoleVisible = ref(false)
const showAssignRole = async row => {
  sysUser.value = row
  dialogRoleVisible.value = true

  // 查询所有的角色数据
  const {code, message, data} = await GetAllRoleList(row.id)
  userRoleIds.value = data.sysUserRoles
  // 获取当前登录用户的角色list
  allRoles.value = data.allRolesList
}
//是否选择角色
const roleIsSelected = rid => {
  return userRoleIds.value.includes(rid)
}

// 角色分配按钮事件处理函数
const doAssign = async () => {
  let assginRoleVo = {
    userId: sysUser.value.id,
    roleIdList: userRoleIds.value
  }
  const {code, message, data} = await DoAssignRoleToUser(assginRoleVo)
  if (code === 200) {
    ElMessage.success(ctx.$t('public.success'))
    dialogRoleVisible.value = false
    await fetchData()
  }
}
</script>

<style scoped>
.search-div {
  height: 35px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.addUser {
  float: right;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
