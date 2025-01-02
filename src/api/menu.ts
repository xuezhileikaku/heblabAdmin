import request from '@/utils/request'

// 获取菜单列表
export function getMenuList() {
  return request.get('/menu/list')
}

// 添加菜单
export function addMenu(data: any) {
  return request.post('/menu/add', data)
}

// 更新菜单
export function updateMenu(data: any) {
  return request.put(`/menu/update/${data.id}`, data)
}

// 删除菜单
export function deleteMenu(id: string) {
  return request.delete(`/menu/delete/${id}`)
}