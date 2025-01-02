import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Permission, Role } from '@/types/permission'
import * as permissionApi from '@/api/permission'

// 示例：定义 getRoles 方法参数类型
type RoleQueryParams = {
  page?: number
  pageSize?: number
  keyword?: string
}

// 示例：定义 API 响应类型
type RoleListResponse = {
  list: Role[]
  total: number
}

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<Permission[]>([])
  const roles = ref<Role[]>([])
  const userPermissions = ref<string[]>([])
  const userRoles = ref<string[]>([])

  // 获取权限树
  const permissionTree = computed(() => {
    const buildTree = (items: Permission[], parentId: string | null = null) => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }))
    }
    return buildTree(permissions.value)
  })

  // 检查是否有权限
  const hasPermission = (permissionCode: string) => {
    return userPermissions.value.includes(permissionCode)
  }

  // 检查是否有角色
  const hasRole = (roleCode: string) => {
    return userRoles.value.includes(roleCode)
  }

  // 获取所有权限列表
  const getPermissions = async () => {
    try {
      const data = await permissionApi.getPermissionList()
      permissions.value = data
      return data
    } catch (error) {
      console.error('获取权限列表失败:', error)
      throw error
    }
  }

  // 获取所有角色列表
  const getRoles = async (params: RoleQueryParams) => {
    try {
      const data: RoleListResponse = await permissionApi.getRoleList(params)
      roles.value = data.list
      return data
    } catch (error) {
      console.error('获取角色列表失败:', error)
      throw error
    }
  }

  // 设置用户权限
  const setUserPermissions = (perms: string[]) => {
    userPermissions.value = perms
  }

  // 设置用户角色
  const setUserRoles = (roleList: string[]) => {
    userRoles.value = roleList
  }

  return {
    permissions,
    roles,
    userPermissions,
    userRoles,
    permissionTree,
    hasPermission,
    hasRole,
    getPermissions,
    getRoles,
    setUserPermissions,
    setUserRoles
  }
})
