import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTags } from '@/pinia/modules/tags.js'

export default function useLang() {
  const i18n = useI18n()
  const lang = computed(() => i18n.locale.value)
  const changeLang = value => {
    i18n.locale.value = value
    //存本地
    localStorage.setItem('__VEA__lang', value)
    useTags().clearAllTags()
    window.location.reload()
  }
  return {
    i18n,
    lang,
    changeLang
  }
}
