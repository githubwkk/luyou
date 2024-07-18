<template>
  <div ref="Area" class="bg">
    <div class="login">
      <el-form class="form" :model="model" :rules="rules" ref="ruleFormRef">
        <h1 class="title">Register</h1>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            v-model="model.username"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="Key"
            v-model="model.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            :prefix-icon="Iphone"
            placeholder="请输入手机号码"
            v-model="model.phone"
          />
        </el-form-item>
        <el-row>
          <el-col :span="18">
            <el-form-item prop="code">
              <el-input
                v-model="model.code"
                placeholder="请输入验证码"
                :prefix-icon="Message"
                style="width: 305px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-popover
              ref="popover"
              placement="right"
              title=" 请移动滑块进行验证"
              :width="320"
              :visible="popoverVisible"
            >
              <el-form-item label="  ">
                <el-slider
                  v-model="sliderValue"
                  placement="right-end"
                  :show-tooltip="false"
                  @change="sliderHandle"
                ></el-slider>
              </el-form-item>
              <template #reference>
                <el-button
                  style="width: 100px"
                  v-show="!countshow"
                  class="m-2"
                  :disabled="model.phone == null"
                  @click="getPhoneCode"
                  type="primary"
                  >获取验证码
                </el-button>
              </template>
            </el-popover>
            <el-button
              type="primary"
              v-show="countshow"
              :disabled="countshow"
              class="countdownText"
            >
              <el-countdown
                @finish="countshow = false"
                format="ss"
                :value="countdownTime"
              />
            </el-button>
          </el-col>
        </el-row>
        <el-form-item class="submit">
          <el-button
            type="primary"
            style="font-size: 18px"
            @click="toSubmit(ruleFormRef)"
          >
            <div class="svg-wrapper-1">
              <div class="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>注册</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="change-lang">
      <change-lang />
    </div>
  </div>
</template>
<script setup lang="ts">
import ChangeLang from "@/layout/components/Topbar/ChangeLang.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Register, SendSmsCode } from "@/api/login";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { Iphone, Message, User } from "@element-plus/icons-vue";
import VantaClouds from "vanta/src/vanta.clouds.js";
import * as THREE from "three";
import { useRouter } from "vue-router";

const router = useRouter();
const countshow = ref(false);
const sliderValue = ref(0);
const popoverVisible = ref(false);
const countdownTime = ref(0);
const ruleFormRef = ref<FormInstance>();
const model = ref({
  phone: null,
  username: "",
  password: "",
  code: "",
});
const rules = ref<FormRules>({
  username: [
    {
      required: true,
      message: "请输入要注册的用户名",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入要您的手机号",
      trigger: "blur",
    },
    {
      pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      message: "手机号格式不正确",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 18,
      message: "密码最小长度为6，最大长度为18",
      trigger: "blur",
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      message: "密码需包含至少一个大写字母、一个小写字母和一个数字",
      trigger: "change",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    },
  ],
});
const sliderHandle = async () => {
  if (sliderValue.value === 100) {
    popoverVisible.value = false;
    const { code } = await SendSmsCode(model.value.phone);
    if (code === 200) {
      ElMessage.success("验证码已发送");
      countshow.value = true;
      countdownTime.value = Date.now() + 60000;
      sliderValue.value = 0;
    } else ElMessage.error("发送失败");
  } else {
    ElMessage.error("验证失败");
    sliderValue.value = 0;
  }
};
const getPhoneCode = () => {
  let reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
  if (!reg.test(model.value.phone)) {
    ElMessage.error("手机格式不正确");
    return;
  } else popoverVisible.value = true;
};
const toSubmit = async (formEl) => {
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 验证成功
      const { code } = await Register(model.value);
      if (code === 203) {
        ElMessage.error("手机号已注册");
      } else if (code === 200) {
        ElMessage.success("注册成功,正在前往登录...");
        setTimeout(function() {
          router.push("/login");
        }, 1500);
      } else ElMessage.error("注册失败");
    } else {
      ElMessage.error("请检查信息");
      console.log("error submit!", fields);
    }
  });
};
//backGroup
const Area = ref(null);
let vantaEffect = null;
onMounted(() => {
  vantaEffect = VantaClouds({
    el: Area.value,
    THREE: THREE,
  });
});
</script>
<style scoped lang="scss">
.bg {
  background-size: cover;
  background-color: #00f2fe;
  height: 100%;
  width: 100%;
  position: fixed;
  background-repeat: no-repeat;
  transition: opacity 22s ease-in-out;
}

.login {
  overflow: hidden;

  .title {
    height: 60px;
    font-size: 30px;
    margin: 0 0 24px;
    text-align: center;
  }

  .form {
    backdrop-filter: blur(60px);
    box-shadow: rgba(149, 157, 165, 0.2) 12px 8px 24px;
    border-radius: 20px;
    color: blueviolet;
    width: 500px;
    height: 550px;
    max-width: 100%;
    padding: 50px 40px 0 40px;
    box-sizing: border-box;
    margin: 15vh auto 0;

    .el-form-item {
      margin-bottom: 25px;
    }

    .el-input {
      font-size: 16px;
      width: 100%;
      height: 45px;
    }

    .el-button {
      font-size: 15px;
      height: 43px;
    }
  }

  :deep {
    .el-input__wrapper {
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.81);
      border-radius: 3px;
    }

    .el-input__wrapper {
      //box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      //;
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

:deep {
  .el-slider__runway,
  .el-slider {
    background-color: #e5e5e5;
    content: "123123";
  }

  .el-slider {
    width: 280px;
  }

  .el-slider__button-wrapper::before {
    content: ">"; // !!显示的内容,注意,一定是这个
    position: absolute;
    width: 20px;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
    text-align: center;
    top: 5px;
    left: 7.5px;
    font-size: 12px;
    z-index: 999;
  }

  .el-slider__bar {
    background-color: #5abc3e;
    margin-top: -15px;
    height: 34px;
  }

  .el-slider__button {
    // 拖动的滑块的样式
    color: white;
    width: 40px;
    height: 34px;
    border: #ececec 1px solid;
    border-radius: 0;
    z-index: 1;
    background-color: #fff;
    text-align: center;
    line-height: normal;
    outline: 0;
  }

  .el-slider__button-wrapper.hover {
    transform: none;
  }

  .el-slider__button-wrapper:hover {
    transform: none;
  }

  .el-slider__button.hover {
    transform: none;
  }

  .el-slider__button:hover {
    transform: none;
  }

  .el-statistic__number {
    color: white;
  }
}

.countdownText {
  width: 100px;
}

.submit {
  margin-top: 40px;

  button {
    width: 100%;
    font-family: inherit;
    font-size: 18px;
    background: linear-gradient(to bottom, #4dc7d9 0%, #66a6ff 100%);
    color: white;
    padding: 0.8em 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }

  button:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  }

  button:active {
    transform: scale(0.95);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }

  button span {
    display: block;
    margin-left: 0.4em;
    transition: all 0.3s;
  }

  button svg {
    width: 18px;
    height: 18px;
    fill: white;
    transition: all 0.3s;
  }

  button .svg-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    margin-right: 0.5em;
    transition: all 0.3s;
  }

  button:hover .svg-wrapper {
    background-color: rgba(255, 255, 255, 0.5);
  }

  button:hover svg {
    transform: rotate(45deg);
  }
}
</style>
