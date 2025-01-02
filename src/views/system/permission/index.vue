<template>
    <div class="permission-container">
      <el-card>
        <template #header>
          <div class="header">
            <span>权限管理</span>
            <el-button
              v-permission="'permission:add'"
              type="primary"
              @click="handleAdd"
            >
              新增权限
            </el-button>
          </div>
        </template>
  
        <el-table
          v-loading="loading"
          :data="permissionTableData"
          row-key="id"
          border
          default-expand-all
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="name" label="权限名称" />
          <el-table-column prop="code" label="权限标识" />
          <el-table-column prop="type" label="类型">
            <template #default="{ row }">
              <el-tag :type="row.type === 'menu' ? 'success' : 'info'">
                {{ row.type === 'menu' ? '菜单' : '按钮' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button
                v-permission="'permission:edit'"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="'permission:delete'"
                type="danger"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- 权限表单对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增权限' : '编辑权限'"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="上级权限">
            <el-tree-select
              v-model="form.parentId"
              :data="permissionOptions"
              :props="{ label: 'name', value: 'id' }"
              placeholder="请选择上级权限"
              clearable
            />
          </el-form-item>
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="form.code" />
          </el-form-item>
          <el-form-item label="权限类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="menu">菜单</el-radio>
              <el-radio label="button">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
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
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { usePermissionStore } from '@/stores/permission'
  import * as permissionApi from '@/api/permission'
  
  const permissionStore = usePermissionStore()
  const loading = ref(false)
  const dialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const formRef = ref<FormInstance>()
  
  const permissionTableData = ref([])
  const permissionOptions = ref([])
  
  const form = reactive({
    id: '',
    parentId: '',
    name: '',
    code: '',
    type: 'menu',
    description: ''
  })
  
  const rules = {
    name: [
      { required: true, message: '请输入权限名称', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入权限标识', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择权限类型', trigger: 'change' }
    ]
  }
  
  // 获取权限列表
  const getList = async () => {
    loading.value = true
    try {
      await permissionStore.getPermissions()
      permissionTableData.value = permissionStore.permissionTree
      permissionOptions.value = [
        { id: '', name: '顶级权限', children: permissionStore.permissionTree }
      ]
    } catch (error: any) {
      ElMessage.error(error.message || '获取权限列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 处理新增
  const handleAdd = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
    form.id = ''
    form.parentId = ''
    form.name = ''
    form.code = ''
    form.type = 'menu'
    form.description = ''
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
      await ElMessageBox.confirm('确认要删除该权限吗？', '提示', {
        type: 'warning'
      })
      await permissionApi.deletePermission(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }
  
  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (dialogType.value === 'add') {
            await permissionApi.addPermission(form)
            ElMessage.success('添加成功')
          } else {
            await permissionApi.updatePermission(form)
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
  
  onMounted(() => {
    getList()
  })
  </script>
  
  <style scoped lang="scss">
  .permission-container {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  </style>