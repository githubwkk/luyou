<script setup lang="ts">
import { UpdateUser } from '@/api/home/user.js'
import { onMounted, ref } from 'vue'
import { useApp } from '@/pinia/modules/app.js'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
import { Plus } from '@element-plus/icons-vue'

const ruleFormRef = ref<FormInstance>()
const editStutas = ref(true)
const user = ref({
  username: '',
  name: '',
  email: '',
  sex: '',
  avatar: '',
  description: ''
})
const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
})
onMounted(async () => {
  //获取个人信息
  const { userinfo } = useUserinfo()
  if (userinfo) {
    user.value = userinfo.value
  }
})
const headers = {
  token: useApp().authorization.token // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}
const handleAvatarSuccess = (response, uploadFile) => {
  user.value.avatar = response.data
}
const submit = async formEl => {
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 验证成功
      const { code } = await UpdateUser(user.value)
      if (code === 200) {
        ElMessage.success('修改成功')
        editStutas.value = !editStutas.value
      } else ElMessage.error('修改失败')
    } else {
      ElMessage.error('格式错误')
    }
  })
}
</script>

<template>
  <div class="grxx">
    <el-form label-width="110" :model="user" ref="ruleFormRef" :rules="rules">
      <el-form-item label="昵称" prop="username">
        <el-input v-model="user.username" :disabled="editStutas"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="user.name" :disabled="editStutas"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="user.sex" :disabled="editStutas">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email" :disabled="editStutas" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          :disabled="editStutas"
          class="avatar-uploader"
          action="http://localhost:8888/admin/system/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img
            style="width: 100px;height: 100px"
            v-if="user.avatar"
            :src="user.avatar"
            class="avatar"
            alt=""
          />
          <el-icon v-else style="width: 100px;height: 100px">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          :disabled="editStutas"
          type="textarea"
          rows="4"
          v-model="user.description"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="editStutas = false"
          :disabled="!editStutas"
          >编辑
        </el-button>
        <el-button
          type="success"
          :disabled="editStutas"
          @click="submit(ruleFormRef)"
          >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.grxx {
  .el-input {
    width: 300px;
  }
}
</style>
