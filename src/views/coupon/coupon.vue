<template>
  <div class="search-div">
    <el-button type="primary" @click="dialogVisible = true"
      >发布优惠卷
    </el-button>
    <el-button
      type="danger"
      v-show="mutipleSelection.length !== 0"
      @click="deleteBatchIds"
      >删除选中
    </el-button>
  </div>
  <el-table :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column
      type="index"
      align="center"
      width="60"
      label="序号"
      sortable
    />
    <el-table-column prop="id" label="券码" align="center" />
    <el-table-column prop="name" label="优惠券名称" align="center" />
    <el-table-column prop="discountType" label="优惠券类型" align="center">
      <template #default="scope">
        <el-tag type="primary" v-if="scope.row.discountType === 0"
          >无门槛
        </el-tag>
        <el-tag type="success" v-if="scope.row.discountType === 1"
          >酒店
        </el-tag>
        <el-tag type="warning" v-if="scope.row.discountType === 2"
          >景区
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      label="简介"
      header-align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="minUseAmount"
      label="最低消费"
      sortable
      align="center"
    >
      <template #default="scope">
        <el-tag type="primary" v-if="scope.row.minUseAmount === 0"
          >无门槛
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="discountValue"
      label="优惠金额"
      sortable
      align="center"
    />
    <el-table-column prop="stock" label="库存" sortable align="center" />
    <el-table-column prop="days" label="有效期/天" sortable align="center" />
    <el-table-column label="操作" align="center" #default="scope" width="150">
      <el-button type="primary" size="small" @click="updateById(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row)">
        删除
      </el-button>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 30, 60, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <el-dialog
    width="500px"
    title="修改/发布优惠券"
    v-model="dialogVisible"
    destroy-on-close
  >
    <el-form :model="model" :rules="rules" ref="ruleFormRef" label-width="120">
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="model.name" />
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input type="textarea" :rows="2" v-model="model.description" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="discountType">
        <el-radio-group v-model="model.discountType">
          <el-radio :label="0">无门槛</el-radio>
          <el-radio :label="1">只限酒店</el-radio>
          <el-radio :label="2">只限景区</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="最低消费" prop="minUseAmount">
        <el-input-number v-model="model.minUseAmount" :step="50" />
      </el-form-item>
      <el-form-item label="优惠金额" prop="discountValue">
        <el-input-number v-model="model.discountValue" :step="10" />
      </el-form-item>
      <el-form-item label="有效期/天" prop="days">
        <el-input-number min="1" v-model="model.days" :step="1" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number min="1" v-model="model.stock" :step="100" />
      </el-form-item>
      <el-form-item>
        <el-button
          style="float: right;"
          @click="submit(ruleFormRef)"
          type="primary"
          >提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  DeleteCouponBatchIds,
  DeleteCouponById,
  GetCouponList,
  SaveCoupon,
  updateCoupon
} from '@/api/coupon.js'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'

const list = ref([])
const total = ref(0)

const pageParams = ref({
  page: 1, // 页码
  limit: 10 // 每页记录数
})
const dialogVisible = ref(false)
const model = ref({
  name: '',
  stock: 1,
  description: '',
  discountType: 0,
  minUseAmount: 0,
  discountValue: 0,
  days: 1
})
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({
  name: [
    {
      required: true,
      message: '请输入优惠卷名称',
      trigger: 'blur'
    }
  ],
  stock: [
    {
      required: true,
      message: '请输入库存',
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: true,
      message: '请输入简介',
      trigger: 'blur'
    }
  ],
  discountType: [
    {
      required: true,
      message: '请选择优惠券类型',
      trigger: 'blur'
    }
  ],
  minUseAmount: [
    {
      required: true,
      message: '请输入最低消费金额',
      trigger: 'blur'
    }
  ],
  discountValue: [
    {
      required: true,
      message: '请输入优惠金额',
      trigger: 'blur'
    }
  ],
  days: [
    {
      required: true,
      message: '请输入有效期',
      trigger: 'blur'
    }
  ]
})
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}
onMounted(() => {
  fetchData()
})
const mutipleSelection = ref([])
const handleSelectionChange = val => {
  mutipleSelection.value = val.map(item => item.id)
}
const fetchData = async () => {
  const { data } = await GetCouponList(
    pageParams.value.page,
    pageParams.value.limit
  )
  list.value = data.records
  total.value = data.total
}
const submit = async formEl => {
  await formEl.validate(async valid => {
    if (valid) {
      if (!model.value.id) {
        const { code } = await SaveCoupon(model.value)
        if (code === 200) {
          ElMessage.success('添加成功')
          await fetchData()
          dialogVisible.value = false
        } else ElMessage.error('添加失败')
      } else {
        const { code } = await updateCoupon(model.value)
        if (code === 200) {
          ElMessage.success('修改成功')
          await fetchData()
          dialogVisible.value = false
        } else ElMessage.error('修改失败')
      }
      await clear()
    } else ElMessage.error('请填写完整信息')
  })
}
const updateById = async val => {
  model.value = { ...val }
  dialogVisible.value = true
}
const deleteBatchIds = async () => {
  ElMessageBox.confirm('此操作将删除选中的优惠券', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteCouponBatchIds(mutipleSelection.value)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    }
  })
}
const deleteById = async val => {
  ElMessageBox.confirm('是否删除此优惠券', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await DeleteCouponById(val.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else ElMessage.error('删除失败')
  })
}
const clear = async () => {
  model.value = {
    days: 1,
    name: '',
    stock: 1,
    description: '',
    discountType: 0,
    minUseAmount: 0,
    discountValue: 0
  }
}
</script>
<style scoped lang="scss">
.search-div {
  height: 35px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
