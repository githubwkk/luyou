<template>
  <el-dropdown-item @click="dialogVisible = true">
    <slot></slot>
  </el-dropdown-item>
  <el-dialog
    title="修改密码"
    v-model="dialogVisible"
    width="30%"
    append-to-body
  >
    <el-form
      label-width="100px"
      :model="pw"
      :rules="rules"
      ref="ruleFormRef"
      status-icon
    >
      <el-form-item label="旧密码" prop="oldPw">
        <el-input
          clearable
          placeholder="请输入旧密码"
          v-model="pw.oldPw"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPw">
        <el-input
          type="password"
          placeholder="请输入新密码"
          clearable
          v-model="pw.newPw"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="againPw">
        <el-input
          type="password"
          :disabled="pw.newPw.length === 0"
          clearable
          placeholder="请再次输入新密码"
          v-model="pw.againPw"
        ></el-input>
      </el-form-item>

      <div style="width: 100%;height: 28px">
        <el-button
          style="float: right"
          type="primary"
          @click="submit(ruleFormRef)"
          >确认
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { getCurrentInstance, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UpdatePassWord } from '@/api/sysUser'
import { Logout } from '@/api/login'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'

const dialogVisible = ref(false)
const pwAgain = ref('')
const user = ref()
const { userinfo } = useUserinfo()
user.value = { ...userinfo.value }
const pw = ref({
  phone: user.value.phone,
  againPw: '',
  newPw: '',
  oldPw: ''
})
import type { FormInstance, FormRules } from 'element-plus'


const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({
  oldPw: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: 'blur'
    }
  ],
  newPw: [
    {
      required: true,
      message: '请输入新密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 18,
      message: '密码最小长度为6，最大长度为18',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      message: '密码需包含至少一个大写字母、一个小写字母和一个数字',
      trigger: 'change'
    }
  ],
  againPw: [
    {
      required: true,
      message: '请再次输入新密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 18,
      message: '密码最小长度为6，最大长度为18',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      message: '新密码需包含至少一个大写字母、一个小写字母和一个数字',
      trigger: 'change'
    }
  ]
})
const submit = async (formEl) => {
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 验证成功
      const { code } = await UpdatePassWord(pw.value)
      if (code === 200) {
        ElMessage.success('修改成功')
        await logout()
      } else {
        ElMessage.error('修改失败')
      }
    }
  })
}
//退出登录函数

import { useApp } from '@/pinia/modules/app'
import { useRouter } from 'vue-router'

const { proxy: ctx } = getCurrentInstance()
const router = useRouter()
const logout = async () => {
  const { code, data, message } = await Logout()
  if (code === 200) {
    // 清除token
    useApp().clearToken()
    await router.push('/login')
  } else {
    ctx.$message.error(message)
  }
}
</script>
<style scoped lang="scss"></style>
