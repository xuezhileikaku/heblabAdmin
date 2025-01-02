import request from '@/utils/request'
import type { Role, Permission } from '@/types/permission'

// 角色相关接口
export function getRoleList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return request.get('/role/list', { params })
}

export function addRole(data: Partial<Role>) {
  return request.post('/role/add', data)
}

export function updateRole(data: Partial<Role>) {
  return request.put(`/role/update/${data.id}`, data)
}

export function deleteRole(id: string) {
  return request.delete(`/role/delete/${id}`)
}

export function getRolePermissions(roleId: string) {
  return request.get(`/role/permissions/${roleId}`)
}

export function updateRolePermissions(roleId: string, permissionIds: string[]) {
  return request.put(`/role/permissions/${roleId}`, { permissionIds })
}

// 权限相关接口
export function getPermissionList() {
  return request.get('/permission/list')
}

export function addPermission(data: Partial<Permission>) {
  return request.post('/permission/add', data)
}

export function updatePermission(data: Partial<Permission>) {
  return request.put(`/permission/update/${data.id}`, data)
}

export function deletePermission(id: string) {
  return request.delete(`/permission/delete/${id}`)
}