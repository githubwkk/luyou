import { createI18n } from 'vue-i18n'
import ZH from './locales/zh.json'
import EN from './locales/en.json'

const getMessage = modules => {
  return Object.entries(modules).reduce((module, [path, mod]) => {
    const moduleName = path.replace(/^\.\/locales\/[\w-]+\/(.*)\.\w+$/, '$1')
    module[moduleName] = mod.default
    return module
  }, {})
}

export default createI18n({
  locale: localStorage.getItem('__VEA__lang') || 'zh-cn',
  messages: {
    'zh-cn': {
      ...ZH
    },
    en: {
      ...EN
    }
  },
  legacy: false,
  globalInjection: true
})
