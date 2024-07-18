<template>
  <el-config-provider :locale="locales[lang]">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import useLang from '@/i18n/useLang'
import localeZH from 'element-plus/dist/locale/zh-cn.mjs'
import localeEN from 'element-plus/dist/locale/en.mjs'

export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  setup() {
    const { lang } = useLang()
    return {
      lang,
      locales: {
        'zh-cn': localeZH,
        en: localeEN
      }
    }
  }
})
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  * {
    font-family: 'pf', 'Microsoft YaHei', sans-serif;
    outline: none;
  }
}

@font-face {
  // 自定义字体的名称
  font-family: 'pf';
  src: url('../src/assets/font/pingfangziti.ttf');
}

.BMap_cpyCtrl {
  display: none;
}

.anchorBL {
  display: none;
}
</style>
