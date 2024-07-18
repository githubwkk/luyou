<template>
  <Toolbar
    style="border-bottom: 1px solid rgba(204,204,204,0.6);width: 100%"
    :editor="editorRef"
    :defaultConfig="toolbarConfig"
    :mode="mode"
  />
  <Editor
    style="width: 100%;margin-top: 3px;height: 95%"
    v-model="contentModel"
    :defaultConfig="editorConfig"
    :mode="mode"
    @onCreated="handleCreated"
    @onChange="handleChange"
  />
</template>
<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { useApp } from '@/pinia/modules/app.js'
import { ElMessage } from 'element-plus'

const mode = 'default'
const contentModel = ref('')
const editorRef = shallowRef()
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  contentModel.value = ''
  if (editor == null) return
  editor.destroy()
})
//工具栏配置
const toolbarConfig = {
  excludeKeys: [
    'group-video', // 排除菜单组，写菜单组 key 的值即可
    'codeBlock'
  ]
}

//编辑器配置
const editorConfig = {
  placeholder: '请输入内容',
  MENU_CONF: {
    uploadImage: {
      fieldName: 'file',
      server: 'http://localhost:8888/admin/system/fileUpload',
      headers: {
        token: useApp().authorization.token
      },
      allowedFileTypes: ['image/*'],
      timeout: 5 * 1000,
      customInsert(res, insertFn) {
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(res.data, '', res.data)
      },
      onSuccess(file, res) {
        ElMessage.success(`${file.name} 上传成功`)
      },
      onFailed(file, res) {
        ElMessage.error(`${file.name} 上传失败` + res)
      },
      onError(file, err, res) {
        ElMessage.error(`${file.name} 上传出错` + err)
        console.log(`${file.name} 上传出错`, err, res)
      }
    }
  }
}
const handleCreated = editor => {
  editorRef.value = editor
}

//接受父组件传的值
// eslint-disable-next-line no-undef
const props = defineProps({ modelValue: String })
contentModel.value = props.modelValue
//传给父组件绑定的v-model值
// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue'])
const handleChange = () => {
  emit('update:modelValue', contentModel.value)
}
</script>

<style scoped lang="scss"></style>
