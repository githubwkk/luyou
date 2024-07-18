<template>
  <el-dropdown trigger="hover">
    <div class="userinfo">
      <template v-if="!userinfo">
        <i class="el-icon-user" />
        admin
      </template>
      <template v-else>
        <img class="avatar" :src="userinfo.avatar" alt="" />
        {{ userinfo.name }}
      </template>
    </div>
    <!--个人信息下拉框-->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <router-link style="color: #7A7D66" to="/">回到首页</router-link>
        </el-dropdown-item>
        <personal-center>{{ $t('topbar.center') }}</personal-center>
        <PassWordUpdate>{{ $t('topbar.password') }}</PassWordUpdate>
        <lock-modal>{{ $t('topbar.lock-title') }} </lock-modal
        ><!--锁屏组件-->

        <el-dropdown-item @click="logout">
          {{ $t('topbar.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
import LockModal from './LockModal.vue'
import { useApp } from '@/pinia/modules/app'
import { Logout } from '@/api/login'
import PersonalCenter from '@/layout/components/Topbar/PersonalCenter.vue'
import PassWordUpdate from '@/layout/components/Topbar/PassWordUpdate.vue'

export default defineComponent({
  components: {
    PassWordUpdate,
    PersonalCenter,
    LockModal
  },
  setup() {
    const router = useRouter()

    const { userinfo } = useUserinfo()
    const { proxy: ctx } = getCurrentInstance()
    // 退出登录
    const logout = async () => {
      const { code, data, message } = await Logout()
      if (code === 200) {
        // 清除token
        useApp().clearToken()
        router.push('/login')
      } else {
        ctx.$message.error(message)
      }
    }

    return {
      userinfo,
      logout
    }
  }
})
</script>

<style lang="scss" scoped>
.userinfo {
  padding: 0 16px;
  line-height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #f5f5f5;
  }

  .el-icon-user {
    font-size: 20px;
    margin-right: 8px;
  }

  .avatar {
    margin-right: 8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
}
</style>
