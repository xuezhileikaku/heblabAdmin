<template>
    <div class="menu-container">
      <el-card>
        <template #header>
          <div class="header">
            <span>菜单管理</span>
            <el-button
              v-permission="'menu:add'"
              type="primary"
              @click="handleAdd"
            >
              新增菜单
            </el-button>
          </div>
        </template>
  
        <el-table
          v-loading="loading"
          :data="menuTableData"
          row-key="id"
          border
          default-expand-all
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="title" label="菜单名称" />
          <el-table-column prop="path" label="路由路径" />
          <el-table-column prop="component" label="组件路径" />
          <el-table-column prop="icon" label="图标" width="70">
            <template #default="{ row }">
              <el-icon v-if="row.icon">
                <component :is="row.icon" />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="70" />
          <el-table-column prop="hidden" label="显示状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.hidden ? 'info' : 'success'">
                {{ row.hidden ? '隐藏' : '显示' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button
                v-permission="'menu:edit'"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="'menu:delete'"
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
  
      <!-- 菜单表单对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增菜单' : '编辑菜单'"
        width="600px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="form.parentId"
              :data="menuOptions"
              :props="{ label: 'title', value: 'id' }"
              placeholder="请选择上级菜单"
              clearable
            />
          </el-form-item>
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="路由路径" prop="path">
            <el-input v-model="form.path" />
          </el-form-item>
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="form.component" />
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="form.icon">
              <template #append>
                <el-button @click="showIconSelector = true">
                  选择图标
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          <el-form-item label="显示状态">
            <el-switch
              v-model="form.hidden"
              :active-value="false"
              :inactive-value="true"
            />
          </el-form-item>
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="form.permission" />
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
  
      <!-- 图标选择器 -->
      <el-dialog
        v-model="showIconSelector"
        title="选择图标"
        width="800px"
      >
        <div class="icon-list">
          <div
            v-for="icon in iconList"
            :key="icon"
            class="icon-item"
            @click="selectIcon(icon)"
          >
            <el-icon>
              <component :is="icon" />
            </el-icon>
            <span>{{ icon }}</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import * as ElementPlusIconsVue from '@element-plus/icons-vue'
  
  // 获取所有图标
  const iconList = Object.keys(ElementPlusIconsVue)
  
  const loading = ref(false)
  const dialogVisible = ref(false)
  const showIconSelector = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const formRef = ref<FormInstance>()
  
  const menuTableData = ref([])
  const menuOptions = ref([])
  
  const form = reactive({
    id: '',
    parentId: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    hidden: false,
    permission: ''
  })
  
  const rules = {
    title: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' }
    ],
    path: [
      { required: true, message: '请输入路由路径', trigger: 'blur' }
    ]
  }
  
  // 获取菜单列表
  const getList = async () => {
    loading.value = true
    try {
      // 这里需要添加菜单相关的 API
      const { data } = await getMenuList()
      menuTableData.value = data
      menuOptions.value = [
        { id: '', title: '顶级菜单', children: data }
      ]
    } catch (error: any) {
      ElMessage.error(error.message || '获取菜单列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 选择图标
  const selectIcon = (icon: string) => {
    form.icon = icon
    showIconSelector.value = false
  }
  
  // 处理新增
  const handleAdd = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
    form.id = ''
    form.parentId = ''
    form.title = ''
    form.path = ''
    form.component = ''
    form.icon = ''
    form.sort = 0
    form.hidden = false
    form.permission = ''
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
      await ElMessageBox.confirm('确认要删除该菜单吗？', '提示', {
        type: 'warning'
      })
      // 这里需要添加删除菜单的 API
      await deleteMenu(row.id)
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
            // 这里需要添加新增菜单的 API
            await addMenu(form)
            ElMessage.success('添加成功')
          } else {
            // 这里需要添加更新菜单的 API
            await updateMenu(form)
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
  .menu-container {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .icon-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 4px;
        
        &:hover {
          background-color: #f5f7fa;
        }
        
        .el-icon {
          font-size: 20px;
          margin-bottom: 5px;
        }
        
        span {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  </style>