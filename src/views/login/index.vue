<!--登录页面-->
<template>
  <div ref="Area" class="bg">
    <div class="login">
      <el-form class="form" :model="model" :rules="rules" ref="loginForm">
        <h1 class="title">登录</h1>
        <el-form-item prop="phone">
          <el-input
            class="text"
            v-model="model.phone"
            prefix-icon="User"
            clearable
            :placeholder="$t('login.phone')"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="text"
            v-model="model.password"
            prefix-icon="Lock"
            show-password
            clearable
            :placeholder="$t('login.password')"
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha">
            <el-input
              class="text"
              v-model="model.captcha"
              prefix-icon="Picture"
              placeholder="请输入验证码"
            ></el-input>
            <img :src="captchaSrc" @click="refreshCaptcha" alt="" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            :loading="loading"
            type="primary"
            size="large"
            @enter="submit"
            @click="submit"
          >
            {{ btnText }}
            <div class="hoverEffect">
              <div></div>
            </div>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="change-lang">
      <change-lang />
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch
} from 'vue'
import { GetValidateCode, Login } from '@/api/login'
import { useRoute, useRouter } from 'vue-router'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'
import { ElMessage } from 'element-plus'
import { useAccount } from '@/pinia/modules/account.js'
import * as THREE from 'three'
import VantaClouds from 'vanta/src/vanta.clouds.js'

export default defineComponent({
  components: { ChangeLang },
  name: 'login',
  created() {
    if (this.$route.query.message) {
      ElMessage({ message: this.$route.query.message, type: 'warning' })
    }
  },
  mounted() {
    this.vantaEffect = VantaClouds({
      el: this.$refs.Area,
      THREE: THREE
    })
  },
  beforeUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  },
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()
    watch(lang, () => {
      state.rules = getRules()
    })

    const getRules = () => ({
      phone: [
        {
          required: true,
          message: ctx.$t('login.rules-phone'),
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur'
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur'
        }
      ],
      captcha: [
        {
          required: true,
          message: ctx.$t('login.rules-validate-code'),
          trigger: 'blur'
        }
      ]
    })
    const Area = ref()
    onMounted(() => {
      state.refreshCaptcha() //刷新验证码第一次
    })
    const state = reactive({
      model: {
        phone: '19978803523',
        password: '111111',
        captcha: '', // 用户输入的验证码
        codeKey: '' // 后端返回的验证码key
      },
      rules: getRules(),
      loading: false,
      captchaSrc: '',
      refreshCaptcha: async () => {
        const { data } = await GetValidateCode()
        state.model.codeKey = data.codeKey
        state.captchaSrc = data.codeValue
      },
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            const { code, data, message } = await Login(state.model)
            if (+code === 200) {
              ctx.$message.success({
                message: ctx.$t('login.loginsuccess'),
                duration: 1000
              })

              //保存token
              useApp().initToken(data)
              //重点：获取用户信息否则permission中不能在登录后重定向
              const { userinfo, getUserinfo } = useAccount()
              await getUserinfo()

              const targetPath = decodeURIComponent(route.query.redirect)
              if (targetPath.startsWith('http')) {
                // 如果是一个url地址
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                // 如果是内部路由地址
                router.push(targetPath)
              } else {
                await router.push('/') // 请求成功以后，进入到首页
              }
            } else {
              await state.refreshCaptcha()
              ctx.$message.error(message)
            }
            state.loading = false
          }
        })
      }
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.bg {
  height: 100%;
  width: 100%;
}

.login {
  overflow: hidden;

  .form {
    width: 500px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;

    :deep {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        background: rgba(0, 0, 0, 0.1);
      }

      .el-input-group--append > .el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .el-input-group--prepend > .el-input__wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .title {
      color: #ffffff;
      text-shadow: 1px 1px 1px rgb(105, 220, 211);
      text-align: center;
      font-size: 40px;
      margin: 0 0 24px;
    }

    .text {
      font-size: 16px;

      :deep(.el-input__inner) {
        color: #fff;
        height: 48px;
        line-height: 48px;

        &::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .button {
      width: 100%;
      border: none;
      color: #fff;
      background-image: linear-gradient(to left, #4facfe 0%, #00f2fe 100%);
      border-radius: 4px;
      background-size: 100% auto;
      font-family: inherit;
      font-size: 17px;
      padding: 0.6em 1.5em;
    }

    .button:hover {
      background-position: right center;
      background-size: 200% auto;
      -webkit-animation: pulse 2s infinite;
      animation: pulse512 1.5s infinite;
    }

    @keyframes pulse512 {
      0% {
        box-shadow: 0 0 0 0 #05bada66;
      }

      70% {
        box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
      }

      100% {
        box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
      }
    }
  }
}

.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.captcha img {
  width: 200px;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
}

.change-lang {
  position: fixed;
  right: 20px;
  top: 20px;

  :deep {
    .change-lang {
      height: 24px;

      &:hover {
        background: none;
      }

      .icon {
        color: #fff;
      }
    }
  }
}
</style>
