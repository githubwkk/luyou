<template>
  <div class="menu">
    <el-dropdown>
      <el-icon>
        <Expand />
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="switchMode">简洁模式</el-dropdown-item>
          <div v-if="!user.id">
            <el-dropdown-item divided>
              <router-link to="/login">登录</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/register">注册</router-link>
            </el-dropdown-item>
          </div>
          <el-dropdown-item v-show="user">
            <router-link to="/personCenter">个人中心</router-link>
          </el-dropdown-item>
          <el-dropdown-item v-if="user.status === 2">
            <router-link to="/system">后台</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click="logout">
            {{ $t('topbar.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 头像 -->
    <div class="avatar">
      <el-avatar :size="32" :src="avatarUrl" />
    </div>
  </div>
</template>
<script setup>
import { Expand } from '@element-plus/icons-vue'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import { useRouter } from 'vue-router'
import { Logout } from '@/api/login.js'
import { useApp } from '@/pinia/modules/app.js'

const { proxy: ctx } = getCurrentInstance()
const router = useRouter()
const avatarUrl = ref(
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
)
const user = ref({
  id: null,
  status: 0
})
onMounted(async () => {
  const { userinfo } = useUserinfo()
  if (userinfo) {
    user.value = { ...userinfo.value }
    avatarUrl.value = user.value.avatar
  }
})
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

import { defineEmits } from 'vue'

const emit = defineEmits(['changeMode'])
const switchMode = () => {
  emit('changeMode', null)
}
</script>
<style scoped lang="scss">
.menu {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  position: relative;
  top: -17px;
  height: 45px;
  background-color: transparent;
  border-radius: 29px;
  border: #dddddd 1px solid;
  width: 80px;

  .el-icon {
    top: 11px;
    left: 10px;
    color: #595959;
    font-size: 22px;
  }

  .avatar {
    position: absolute;
    top: 6px;
    right: 9px;
  }
}
</style>
