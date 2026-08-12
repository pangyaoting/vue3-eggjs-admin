<template>
  <div class="notice-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" @keyup.enter="handleSearch">
        <el-form-item label="公告标题">
          <el-input v-model="searchForm.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>公告列表</span>
          <el-button type="primary" @click="handleAdd">新增公告</el-button>
        </div>
      </template>
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <template #empty>
        <el-empty description="暂无公告" />
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
      :title="isEdit ? '编辑公告' : '新增公告'"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" @submit.prevent>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="5" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
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
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }]
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
  isEdit.value = true
  formData.id = row.id
  formData.title = row.title
  formData.content = row.content
  formData.status = row.status
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: NoticeData) => {
  try {
    await ElMessageBox.confirm('确定要删除该公告吗？', '提示', {
      type: 'warning'
    })
    await deleteNoticeApi(row.id)
    ElMessage.success('删除成功')
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
      ElMessage.success('编辑成功')
    } else {
      await createNoticeApi(formData)
      ElMessage.success('新增成功')
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