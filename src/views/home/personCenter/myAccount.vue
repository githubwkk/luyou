<template>
  <div class="main">
    <div class="li">
      <div class="title">账号与密码</div>
      <div class="text">绑定手机和邮箱，并设置密码，账号更安全</div>
    </div>
    <el-divider />
    <div class="li">
      <div class="title">密码</div>
      <div class="text">
        已设置
        <el-link type="primary" @click="updatePsw">编辑</el-link>
      </div>
      <div class="hiddenDiv" v-show="updatePswDiv && afterVerify">
        <el-row :gutter="40">
          <el-col :span="20">
            <el-input v-model="info.psw" placeholder="请输入新密码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :disabled="!info.psw" @click="setPsw"
              >提交
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-divider />
    <div class="li">
      <div class="title">绑定手机</div>
      <div class="text">
        {{ encryptedPhoneNumber(user.phone) }}
        <el-link type="primary" @click="updatePhone">编辑</el-link>
      </div>
      <div class="hiddenDiv" v-show="updatePhoneDiv && afterVerify">
        <el-row :gutter="40">
          <el-col :span="20">
            <el-input
              v-model="info.phone"
              placeholder="请输入新手机号"
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :disabled="!info.phone" @click="setPhone"
              >提交
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-divider />
  </div>

  <!-- 111111111111111111111111111111111111111111111111111111111111111111 -->
  <el-dialog center v-model="dialogShow" width="380px">
    <div class="dig">
      <div class="title">
        身份验证
      </div>
      <div class="tips">
        为了保护你的账号安全，请验证身份，验证成功后进行下一步操作
      </div>
      <div class="phone">
        使用手机号 {{ encryptedPhoneNumber(user.phone) }} 进行验证
      </div>
      <div class="code">
        <el-input
          autocomplete="off"
          maxlength="4"
          v-model="phoneCode"
          @focus="focused = true"
          @blur="focused = false"
          placeholder="输入4位短信验证码"
        />
        <transition name="el-fade-in">
          <el-button @click="getCode()" :disabled="!smsCode"
            ><span v-show="smsCode">获取验证码</span>
            <el-countdown
              v-show="!smsCode"
              @finish="smsCode = true"
              format="ss"
              :value="countdownTime"
            />
          </el-button>
        </transition>
      </div>
      <div class="bottom">
        <div class="b">
          <el-button type="primary" :disabled="!phoneCode" @click="verify"
            >验证
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
import { Logout } from '@/api/login'
import {
  UpdateUserPassWord,
  UpdateUserPhone,
  SendSmsCodeOfUpdate,
  ValidateCode
} from '@/api/home/user.js'
import { useRouter } from 'vue-router'
import { useApp } from '@/pinia/modules/app'

const dialogShow = ref(false)
const phoneCode = ref()
const info = ref({
  phone: '',
  psw: ''
})
const codeLength = ref(4)
const focused = ref(false)
const smsCode = ref(true)
const countdownTime = ref(0)
const ruleFormRef = ref<FormInstance>()
const user = ref({
  phone: '',
  password: ''
})
onMounted(async () => {
  //获取个人信息
  const { userinfo } = useUserinfo()
  if (userinfo) {
    user.value = userinfo.value
  }
})
//手机号隐藏
const encryptedPhoneNumber = phone => {
  const hiddenPart = phone.slice(3, 7).replace(/\d/g, '*')

  // 拼接隐藏部分和手机号的前三位和后三位
  return phone.slice(0, 3) + hiddenPart + phone.slice(7)
}
const getCode = async () => {
  smsCode.value = false
  countdownTime.value = Date.now() + 60000
  const { code } = await SendSmsCodeOfUpdate(user.value.phone)
  if (code === 200) {
    ElMessage.success('验证码已发送')
  } else ElMessage.error('验证码发送失败')
}

//验证验证码
const afterVerify = ref(false)
const verify = async () => {
  const { code } = await ValidateCode(user.value.phone, phoneCode.value)
  if (code === 200) {
    ElMessage.success('验证成功')
    afterVerify.value = true
    dialogShow.value = false
  } else ElMessage.error('验证码错误')
}
//更改密码
const updatePswDiv = ref(false)
const updatePsw = () => {
  updatePswDiv.value = true
  dialogShow.value = true
}

const setPsw = async () => {
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  if (!reg.test(info.value.psw)) {
    ElMessage.error('密码需包含至少一个大写字母、一个小写字母和一个数字')
    return
  } else {
    const { code } = await UpdateUserPassWord({
      phone: user.value.phone,
      psw: info.value.psw
    })
    if (code === 200) {
      ElMessage.success('密码修改成功')
      updatePswDiv.value = false
      afterVerify.value = false
      dialogShow.value = false
    } else ElMessage.error('密码修改失败')
  }
}
//更改手机号
const updatePhoneDiv = ref(false)
const updatePhone = () => {
  dialogShow.value = true
  updatePhoneDiv.value = true
}
const setPhone = async () => {
  let reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
  if (!reg.test(info.value.phone)) {
    ElMessage.error('手机格式不正确')
    return
  } else {
    const { code } = await UpdateUserPhone(user.value.id, info.value.phone)
    if (code === 200) {
      ElMessage.success('手机号修改成功,请重新登录')
      updatePswDiv.value = false
      afterVerify.value = false
      dialogShow.value = false
      await logout()
    } else ElMessage.error('手机号修改失败')
  }
}

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
<style scoped lang="scss">
.el-divider {
  margin: 0;
}

.main {
  margin-left: 0;
  width: 600px;

  .li {
    height: auto;
    padding: 20px 10px;
    box-sizing: border-box;

    .title {
      font-size: 19px;
      font-weight: 600;
    }

    .text {
      color: #8491a5;
      font-size: 14px;
      margin-top: 5px;
    }

    .el-link {
      float: right;
    }

    .hiddenDiv {
      margin-top: 20px;
    }
  }
}

.dig {
  .title {
    font-size: 25px;
    font-weight: 600;
    margin: auto;
    width: 100px;
  }

  .tips {
    color: #5c5c5c;
    width: 240px;
    margin: 5px auto auto;
    text-align: center;
  }

  .phone {
    margin-top: 30px;
  }

  .code {
    margin-top: 10px;

    .el-input {
      width: 70%;
    }

    :deep {
      .el-input__wrapper {
        border: none;
        border-radius: 0;
        border-bottom: 2px #ecedee solid;
        box-shadow: none;
      }
    }

    .el-button {
      margin-left: 5%;
      width: 25%;

      span {
        color: #6161fb;
      }

      :deep {
        .el-statistic__number {
          color: #c9cfd8;
          font-size: 14px;
        }
      }
    }
  }

  .bottom {
    margin: 45px 0 10px;

    .b {
      margin: auto;
      display: flex;
      justify-content: center;

      .el-button {
        width: 70%;
      }
    }
  }
}
</style>
