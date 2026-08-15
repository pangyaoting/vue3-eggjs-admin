<template>
  <div class="notice-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" @keyup.enter="handleSearch">
        <el-form-item :label="t('notice.searchTitle')">
          <el-input v-model="searchForm.title" :placeholder="t('notice.placeholderTitle')" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ t('notice.query') }} </el-button>
          <el-button @click="handleReset">{{ t('notice.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('notice.listTitle') }}</span>
          <el-button type="primary" @click="handleAdd">{{ t('notice.add') }}</el-button>
        </div>
      </template>
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" :label="t('notice.title')" min-width="200" />
        <el-table-column prop="content" :label="t('notice.content')" min-width="300" show-overflow-tooltip />
        <el-table-column :label="t('notice.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? t('notice.show') : t('notice.hide') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="t('notice.created_at')" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('notice.operation')" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">{{ t('notice.edit') }}</el-button>
            <el-button type="danger" link @click="handleDelete(row)">{{ t('notice.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <template #empty>
        <el-empty :description="t('notice.noData')" />
      </template>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('notice.edit') : t('notice.add')"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" @submit.prevent>
        <el-form-item :label="t('notice.searchTitle')" prop="title">
          <el-input v-model="formData.title" :placeholder="t('notice.titleRequired')" />
        </el-form-item> 
        <el-form-item :label="t('notice.content')" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="5" :placeholder="t('notice.content')" />
        </el-form-item>
        <el-form-item :label="t('notice.status')" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">{{ t('notice.show') }}</el-radio>
            <el-radio :label="0">{{ t('notice.hide') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('notice.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ t('notice.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  getNoticeListApi,
  createNoticeApi,
  updateNoticeApi,
  deleteNoticeApi
} from '@/api/system/notice/index'
import type { NoticeData } from '@/api/system/notice/types'
import { formatTime } from '@/utils'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

// 搜索表单
const searchForm = reactive({
  title: ''
})

// 表格数据
const tableData = ref<NoticeData[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 弹窗相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  title: '',
  content: '',
  status: 1
})

// 表单校验规则
const formRules = {
  title: [{ required: true, message: t('notice.titleRequired'), trigger: 'blur' }]
}

// 获取列表数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getNoticeListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      title: searchForm.title || undefined
    })
    tableData.value = res.data.list
    pagination.total = res.data.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  formData.id = 0
  formData.title = ''
  formData.content = ''
  formData.status = 1
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: NoticeData) => {
  ;(document.activeElement as HTMLElement)?.blur()  
  isEdit.value = true
  formData.id = row.id
  formData.title = row.title
  formData.content = row.content
  formData.status = row.status
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: NoticeData) => {
  ;(document.activeElement as HTMLElement)?.blur()  
  try {
    await ElMessageBox.confirm(t('notice.deleteConfirm'), t('notice.reminder'), {
      type: 'warning'
    })
    await deleteNoticeApi(row.id)
    ElMessage.success(t('notice.deleteSuccess'))
    fetchData()
  } catch {
    // 用户取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateNoticeApi(formData)
      ElMessage.success(t('notice.editSuccess'))
    } else {
      await createNoticeApi(formData)
      ElMessage.success(t('notice.addSuccess'))
      searchForm.title = ''   
      pagination.page = 1     
    }
    dialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

// 弹窗关闭时重置表单
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.notice-container {
  padding: 16px;
}

.search-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>