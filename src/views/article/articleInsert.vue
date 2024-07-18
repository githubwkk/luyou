<template>
  <el-form
    style="height: 95%"
    :model="ArticleForm"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="ArticleForm.title"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="提到的景点" prop="tid">
          <el-select-v2
            :options="TANameAndList"
            :props="props"
            placeholder="选择文章提到的景点（如果提到）"
            v-model="ArticleForm.tid"
          ></el-select-v2>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="type" label="类型">
          <el-select
            placeholder="选择文章类型"
            v-model="ArticleForm.type"
            @click="getType"
          >
            <el-option
              v-for="item in TypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <div class="add">
          <el-button
            style="float: right;"
            @click="submit(ruleFormRef)"
            type="primary"
            >添加
          </el-button>
        </div>
      </el-col>
    </el-row>

    <el-form-item
      label="文章内容"
      prop="content"
      style="width: 100% ;height:90%"
    >
      <wangEditor v-model="ArticleForm.content"></wangEditor>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onMounted, ref } from 'vue'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo.js'
import { getTAIdNameList } from '@/api/touristAttractions.js'
import WangEditor from '@/components/wangEditor.vue'
import { SaveArticle } from '@/api/article.js'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { GetArticleTypeList } from '@/api/articleType.js'

const ruleFormRef = ref<FormInstance>()
//获取用户信息
const user = ref()
const { userinfo } = useUserinfo()
user.value = userinfo.value
const ArticleForm = ref({
  title: '',
  content: '',
  type: '',
  tid: '',
  aid: user.value.id
})
const rules = ref<FormRules>({
  title: [
    {
      required: true,
      message: '请输入文章标题',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入文章内容',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: '请选择文章类型',
      trigger: 'blur'
    }
  ],
  tid: [
    {
      required: true,
      message: '请选择文章提到的景点',
      trigger: 'blur'
    }
  ]
})
const TANameAndList = ref([])
onMounted(async () => {
  const { data } = await getTAIdNameList()
  TANameAndList.value = data
})
const TypeList = ref()
const getType = async () => {
  const { data } = await GetArticleTypeList()
  TypeList.value = data
}
const submit = async formEl => {
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { code } = await SaveArticle(ArticleForm.value)
      if (code === 200) {
        ElMessage.success('添加成功')
        ArticleForm.value = {}
        ArticleForm.value.content = ''
      } else ElMessage.error('添加失败')
    }
  })
}
const props = ref({
  label: 'name',
  value: 'id'
})
</script>

<style scoped lang="scss">
.add button {
  float: right;
}
</style>
