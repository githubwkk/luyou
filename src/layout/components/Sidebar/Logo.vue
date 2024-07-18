<template>
  <div class="brand">
    <img class="logo" src="~@/assets/logo.png" @click="goHome" />
    <div class="title">旅游管理后台</div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const goHome = () => {
      router.push('/')
    }
    return { goHome }
  }
})
</script>
<style lang="scss" scoped>
.brand {
  height: 50px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo {
    cursor: pointer;
    max-width: 30px;
    max-height: 30px;
  }

  .title {
    color: #fff;
    font-size: 20px;
    white-space: nowrap;
    margin-left: 8px;
    transition: all 0.5s;
    font-weight: lighter;
  }
}
</style>
