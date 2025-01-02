<template>
    <div class="role-container">
      <el-card>
        <template #header>
          <div class="header">
            <span>角色管理</span>
            <el-button
              v-permission="'role:add'"
              type="primary"
              @click="handleAdd"
            >
              新增角色
            </el-button>
          </div>
        </template>
  
        <el-table
          v-loading="loading"
          :data="roleList"
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="code" label="角色标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="{ row }">
              <el-button
                v-permission="'role:edit'"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="'role:permission'"
                type="warning"
                link
                @click="handlePermission(row)"
              >
                权限设置
              </el-button>
              <el-button
                v-permission="'role:delete'"
                type="danger"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
  
      <!-- 角色表单对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="角色标识" prop="code">
            <el-input v-model="form.code" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
            />
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
  
      <!-- 权限设置对话框 -->
      <el-dialog
        v-model="permissionDialogVisible"
        title="权限设置"
        width="600px"
      >
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :props="{
            label: 'name',
            children: 'children'
          }"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="permissionDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handlePermissionSubmit">
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
  import type { FormInstance, TreeInstance } from 'element-plus'
  import { usePermissionStore } from '@/stores/permission'
  import * as permissionApi from '@/api/permission'
  
  const permissionStore = usePermissionStore()
  const loading = ref(false)
  const dialogVisible = ref(false)
  const permissionDialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const formRef = ref<FormInstance>()
  const permissionTreeRef = ref<TreeInstance>()
  const currentRoleId = ref('')
  
  const roleList = ref([])
  const total = ref(0)
  const permissionTree = ref([])
  
  const queryParams = reactive({
    page: 1,
    pageSize: 10,
    keyword: ''
  })
  
  const form = reactive({
    id: '',
    name: '',
    code: '',
    description: '',
    status: 1
  })
  
  const rules = {
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入角色标识', trigger: 'blur' }
    ]
  }
  
  // 获取角色列表
  const getList = async () => {
    loading.value = true
    try {
      const { list, total: totalCount } = await permissionApi.getRoleList(queryParams)
      roleList.value = list
      total.value = totalCount
    } catch (error: any) {
      ElMessage.error(error.message || '获取角色列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 获取权限树
  const getPermissionTree = async () => {
    try {
      await permissionStore.getPermissions()
      permissionTree.value = permissionStore.permissionTree
    } catch (error: any) {
      ElMessage.error(error.message || '获取权限列表失败')
    }
  }
  
  // 处理新增
  const handleAdd = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
    form.id = ''
    form.name = ''
    form.code = ''
    form.description = ''
    form.status = 1
  }
  
  // 处理编辑
  const handleEdit = (row: any) => {
    dialogType.value = 'edit'
    dialogVisible.value = true
    Object.assign(form, row)
  }
  
  // 处理删除
  const handleDelete = async (row: any) => {
    try {
      await ElMessageBox.confirm('确认要删除该角色吗？', '提示', {
        type: 'warning'
      })
      await permissionApi.deleteRole(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }
  
  // 处理权限设置
  const handlePermission = async (row: any) => {
    currentRoleId.value = row.id
    permissionDialogVisible.value = true
    await getPermissionTree()
    // 获取角色的权限并设置选中状态
    const { permissions } = await permissionApi.getRolePermissions(row.id)
    permissionTreeRef.value?.setCheckedKeys(permissions)
  }
  
  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (dialogType.value === 'add') {
            await permissionApi.addRole(form)
            ElMessage.success('添加成功')
          } else {
            await permissionApi.updateRole(form)
            ElMessage.success('更新成功')
          }
          dialogVisible.value = false
          getList()
        } catch (error: any) {
          ElMessage.error(error.message || '操作失败')
        }
      }
    })
  }
  
  // 提交权限设置
  const handlePermissionSubmit = async () => {
    try {
      const checkedKeys = permissionTreeRef.value?.getCheckedKeys()
      await permissionApi.updateRolePermissions(currentRoleId.value, checkedKeys)
      ElMessage.success('权限设置成功')
      permissionDialogVisible.value = false
    } catch (error: any) {
      ElMessage.error(error.message || '权限设置失败')
    }
  }
  
  // 分页处理
  const handleSizeChange = (val: number) => {
    queryParams.pageSize = val
    getList()
  }
  
  const handleCurrentChange = (val: number) => {
    queryParams.page = val
    getList()
  }
  
  onMounted(() => {
    getList()
  })
  </script>
  
  <style scoped lang="scss">
  .role-container {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  </style>