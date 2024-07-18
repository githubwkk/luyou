<template>
  <div class="tools-div">
    <el-button type="success" @click="addShow">{{ $t('sysMenu.aam') }}</el-button>
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item :label="$t('sysMenu.title')">
        <el-input v-model="sysMenu.title"/>
      </el-form-item>
      <el-form-item :label="$t('sysMenu.rn')">
        <el-input v-model="sysMenu.component"/>
      </el-form-item>
      <el-form-item :label="$t('sysMenu.order')">
        <el-input v-model="sysMenu.sortValue"/>
      </el-form-item>
      <el-form-item :label="$t('public.status')">
        <el-radio-group v-model="sysMenu.status">
          <el-radio :label="1">{{ $t('sysUser.normal') }}</el-radio>
          <el-radio :label="0">{{ $t('sysUser.Deactivated') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">{{ $t('public.submit') }}</el-button>
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
  >
    <el-table-column prop="title" :label="$t('sysMenu.title')"/>
    <el-table-column prop="component" :label="$t('sysMenu.rn')"/>
    <el-table-column prop="sortValue" :label="$t('sysMenu.order')"/>
    <el-table-column prop="status" :label="$t('public.status')" #default="scope">
      {{ scope.row.status === 1 ? $t('sysUser.normal') : $t('sysUser.Deactivated') }}
    </el-table-column>
    <el-table-column prop="createTime" :label="$t('public.createTime')"/>

    <el-table-column :label="$t('public.operate')" align="center" width="280" #default="scope">
      <el-button type="success" size="small" @click="addShow(scope.row)">
        {{ $t('sysMenu.acn') }}
      </el-button>
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        {{ $t('public.edit') }}
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        {{ $t('public.delete') }}
      </el-button>
    </el-table-column>
  </el-table>
</template>

<script setup>
//引入调用的方法
import {getCurrentInstance, onMounted, ref} from 'vue'
import {
  FindNodes,
  RemoveSysMenuById,
  SaveMenu,
  UpdateSysMenuById
} from '@/api/sysMenu'
import {ElMessage, ElMessageBox} from 'element-plus'
import {findRegionList} from '@/api/sysRegion.js'

// 定义表格数据模型
const list = ref([])

// 定义添加表单菜单表单相关数据模型
const dialogTitle = ref($t('public.add'))
const dialogVisible = ref(false)

//页面表单数据
const defaultForm = {
  id: '',
  parentId: 0,
  title: '',
  url: '',
  component: '',
  icon: '',
  sortValue: 1,
  status: 1
}
// 表单响应式数据模型对象
const sysMenu = ref(defaultForm)
const {proxy: ctx} = getCurrentInstance()
//=======================加载数据=========================
onMounted(() => {
  fetchData()
})

//=======================添加和修改功能====================
//进入添加
const addShow = row => {
  sysMenu.value = {}
  dialogVisible.value = true
  if (!row.id) {
    dialogTitle.value = ctx.$t('public.add')
  } else {
    dialogTitle.value = ctx.$t('sysMenu.acn')
    sysMenu.value.parentId = row.id
  }
}

//进入修改
const editShow = row => {
  sysMenu.value = row
  dialogVisible.value = true
}

//提交保存与修改
const saveOrUpdate = () => {
  if (!sysMenu.value.id) {
    if (!sysMenu.value.parentId) {
      sysMenu.value.parentId = 0
    }
    saveData()
  } else {
    updateData()
  }
}

// 修改
const updateData = async () => {
  await UpdateSysMenuById(sysMenu.value)
  dialogVisible.value = false
  ElMessage.success(ctx.$t('public.success'))
  await fetchData()
}

// 新增
const saveData = async () => {
  await SaveMenu(sysMenu.value)
  dialogVisible.value = false
  ElMessage.success(ctx.$t('public.success'))
  await fetchData()
}

//=======================分页列表====================

const fetchData = async () => {
  const {code, data, message} = await FindNodes()
  list.value = data
}

//``````````````````````````````````````````````````````````````````````````````````````````
//``````````````````````````````````````````````````````````````````````````````````````````
//``````````````````````````````````````````````````````````````````````````````````````````
//``````````````````````````````````````````````````````````````````````````````````````````
//``````````````````````````````````````````````````````````````````````````````````````````
//=======================删除功能====================
const remove = async id => {
  console.log('removeDataById:' + id)
  ElMessageBox.confirm(ctx.$t('public.DeletionConfirmation'), 'Warning', {
    confirmButtonText: ctx.$t('public.sure'),
    cancelButtonText: ctx.$t('public.cancel'),
    type: 'warning'
  }).then(async () => {
    const {code, message} = await RemoveSysMenuById(id)
    if (code === 200) {
      ElMessage.success(ctx.$t('public.successfullyDelete'))
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  })
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
