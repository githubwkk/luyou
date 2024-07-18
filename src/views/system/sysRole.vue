<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import {
  DeleteSysRoleById,
  DoAssignMenuIdToSysRole,
  GetSysRoleListByPage,
  GetSysRoleMenuIds,
  SaveSysRole,
  UpdateSysRole
} from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus' // 分页条总记录数
// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([])

//分页数据
const pageParamsForm = {
  page: 1, // 页码
  limit: 10 // 每页记录数
}
const { proxy: ctx } = getCurrentInstance()
const pageParams = ref(pageParamsForm)

const queryDto = ref({ roleName: '' }) // 搜索表单数据
//表单重置
const resetData = () => {
  queryDto.value.roleName = ''
  fetchData()
}
// 页面加载完毕以后请求后端接口获取数据
onMounted(() => {
  fetchData()
})

// 搜索按钮点击事件处理函数
const searchSysRole = () => {
  fetchData()
}

// 远程调用后端分页查询接口
const fetchData = async () => {
  const { data, code, message } = await GetSysRoleListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.records
  total.value = data.total
}

// 控制对话是否展示的变量
const dialogVisible = ref(false)
//进入添加
const addShow = () => {
  dialogVisible.value = true
}
//表单数据模型
const defaultForm = {
  id: '',
  roleCode: '',
  roleName: ''
}
const sysRole = ref(defaultForm) // 使用ref包裹该对象，使用reactive不方便进行重置

// 添加或修改角色的提交
const submit = async () => {
  if (!sysRole.value.id) {
    const { code } = await SaveSysRole(sysRole.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      await fetchData()
    }
  } else {
    const { code } = await UpdateSysRole(sysRole.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      await fetchData()
    }
  }
}
// 修改按钮点击事件处理函数
const editShow = row => {
  sysRole.value = row
  dialogVisible.value = true
}

// 删除角色
// eslint-disable-next-line no-unused-vars
const deleteById = row => {
  ElMessageBox.confirm(ctx.$t('public.DeletionConfirmation'), 'Warning', {
    confirmButtonText: ctx.$t('public.sure'),
    cancelButtonText: ctx.$t('public.cancel'),
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteSysRoleById(row.id)
    if (code === 200) {
      ElMessage.success(ctx.$t('public.successfullyDelete'))
      pageParams.value.page = 1
      await fetchData()
    }
  })
}

//分配菜单
//树参
const defaultProps = {
  children: 'children',
  label: 'title'
}
const dialogMenuVisible = ref(false)
const sysMenuTreeList = ref([])

// 树对象变量
const tree = ref()

// 默认选中的菜单数据集合
let roleId = ref()
const showAssignMenu = async row => {
  dialogMenuVisible.value = true
  roleId = row.id
  const { data } = await GetSysRoleMenuIds(row.id) // 请求后端地址获取所有的菜单数据，以及当前角色所对应的菜单数据
  sysMenuTreeList.value = data.sysMenuList
  tree.value.setCheckedKeys(data.roleMenuIds) // 进行数据回显
}

const doAssign = async () => {
  const checkedNodes = tree.value.getCheckedNodes()
  // 获取选中的节点
  const checkedNodesIds = checkedNodes.map(node => {
    // 获取选中的节点的id
    return {
      id: node.id,
      isHalf: 0
    }
  })

  // 获取半选中的节点数据，当一个节点的子节点被部分选中时，该节点会呈现出半选中的状态
  const halfCheckedNodes = tree.value.getHalfCheckedNodes()
  const halfCheckedNodesIds = halfCheckedNodes.map(node => {
    // 获取半选中节点的id
    return {
      id: node.id,
      isHalf: 1
    }
  })

  // 将选中的节点id和半选中的节点的id进行合并
  const menuIds = [...checkedNodesIds, ...halfCheckedNodesIds]

  // 构建请求数据
  const assignMenuDto = {
    roleId: roleId,
    menuIdList: menuIds
  }

  // 发送请求
  await DoAssignMenuIdToSysRole(assignMenuDto)
  ElMessage.success('操作成功')
  dialogMenuVisible.value = false
}
</script>

<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="80px" ref="serachForm">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item :label="$t('sysRole.roleName')">
            <el-input
              v-model="queryDto.roleName"
              style="width: 100%"
              :placeholder="$t('sysRole.inputRoleName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="searchSysRole">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="resetData">
            {{ $t('public.reset') }}
          </el-button>
          <el-button type="success" @click="addShow">
            {{ $t('public.add') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 添加角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="$t('sysRole.editOrDeleteRole')"
      width="30%"
    >
      <el-form label-width="120px">
        <el-form-item :label="$t('sysRole.roleName')">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item :label="$t('sysRole.roleCode')">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">
            {{ $t('public.submit') }}
          </el-button>
          <el-button @click="dialogVisible = false">
            {{ $t('public.cancel') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column
        prop="roleName"
        :label="$t('sysRole.roleName')"
        width="180"
      />
      <el-table-column
        prop="roleCode"
        :label="$t('sysRole.roleCode')"
        width="180"
      />
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('public.creationTime')"
      />
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        :label="$t('public.updateTime')"
      />
      <el-table-column
        :label="$t('public.operate')"
        #default="scope"
        align="center"
        width="280"
      >
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          {{ $t('public.edit') }}
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          {{ $t('public.delete') }}
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click="showAssignMenu(scope.row)"
        >
          分配菜单
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分配菜单的对话框 -->
    <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
      <el-form label-width="80px">
        <el-tree
          :data="sysMenuTreeList"
          ref="tree"
          show-checkbox
          default-expand-all
          :check-on-click-node="true"
          node-key="id"
          :props="defaultProps"
        />
        <el-form-item>
          <el-button type="primary" @click="doAssign">提交</el-button>
          <el-button @click="dialogMenuVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <!--分页条-->
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

<style scoped lang="scss">
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
