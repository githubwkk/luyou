<template>
  <el-dropdown-item @click="init()">
    <slot></slot>
  </el-dropdown-item>
  <el-dialog
    width="30%"
    v-model="dialogVisible"
    :title="$t('topbar.center')"
    append-to-body
  >
    <el-link type="primary" @click="edit = !edit" style="float: right"
      >修改
    </el-link>
    <el-form label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="user.name" :disabled="edit" style="width: 200px" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
          v-model="user.username"
          :disabled="edit"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" :disabled="edit" style="width: 300px" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.phone" :disabled="edit" style="width: 300px" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          :disabled="edit"
          class="avatar-uploader"
          action="http://localhost:8888/admin/system/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="user.avatar" :src="user.avatar" class="avatar" alt="" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          style="width: 300px"
          type="textarea"
          rows="2"
          v-model="user.description"
          :disabled="edit"
        />
      </el-form-item>
      <div style="width: 400px;height: 30px">
        <el-button
          type="primary"
          style="float: right;"
          @click="save"
          :disabled="edit"
          >保存
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import { ref } from 'vue'
import { useApp } from '@/pinia/modules/app.js'
import { Plus } from '@element-plus/icons-vue'
import { UpdateSysUser } from '@/api/sysUser.js'
import { ElMessage } from 'element-plus'

const user = ref({
  avatar: '',
  description: '',
  email: '',
  name: '',
  username: '',
  phone: ''
})
const dialogVisible = ref(false)

const init = () => {
  const { userinfo } = useUserinfo()
  dialogVisible.value = true
  user.value = { ...userinfo.value }
}
const headers = {
  token: useApp().authorization.token
}
const handleAvatarSuccess = (response, uploadFile) => {
  user.value.avatar = response.data
}
const edit = ref(true)
const save = async () => {
  const { code } = await UpdateSysUser(user.value)
  if (code === 200) {
    ElMessage.success('修改成功')
  } else ElMessage.error('更新失败')
  edit.value = true
}
</script>
<style scoped lang="scss">
.avatar-uploader .el-supload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
