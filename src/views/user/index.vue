<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="header">
          <span>用户管理</span>
          <el-button v-permission="'user:add'" type="primary" @click="handleAdd">
            新增用户
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="userList" border style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="roles" label="角色">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role" class="mx-1" type="info">
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button v-permission="'user:edit'" type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button v-permission="'user:delete'" type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize" :total="total"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="form.roles" multiple placeholder="请选择角色">
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getUserList, addUser, updateUser, deleteUser, getRoleOptions } from '@/api/user'
import { getRoleList, getRoles } from '@/api/permission'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const dialogTitle = computed(() => (dialogType.value === 'add' ? '新增用户' : '编辑用户'))
const formRef = ref<FormInstance>()

const userList = ref([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: ''
})

const form = reactive({
  id: '',
  username: '',
  password: '',
  realName: '',
  email: '',
  roles: [],
  status: 1
})

const roleOptions = ref([])

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 获取用户列表
const getList = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getUserList(queryParams)
    userList.value = list
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取角色选项
const fetchRoleOptions = async () => {
  try {
    const roles = await getRoleList()
    roleOptions.value = roles.map(role => ({ label: role.name, value: role.id }))
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
}

// 初始化表单
const resetForm = () => {
  Object.assign(form, {
    id: '',
    username: '',
    password: '',
    realName: '',
    email: '',
    roles: [],
    status: 1
  })
}

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认要删除该用户吗？', '提示', { type: 'warning' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    ElMessage.error(error.message || '删除失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        dialogType.value === 'add' ? await addUser(form) : await updateUser(form)
        ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
        dialogVisible.value = false
        getList()
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      }
    }
  })
}

// 分页
const handleSizeChange = (size: number) => (queryParams.pageSize = size, getList())
const handleCurrentChange = (page: number) => (queryParams.page = page, getList())

onMounted(() => {
  getList()
  fetchRoleOptions()
})
</script>

<style scoped lang="scss">
.user-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-tag {
    margin-right: 5px;
  }
}
</style>