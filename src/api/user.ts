import req from '@/utils/request'

// 登录接口
export function login(data: { username: string; password: string }) {
  console.log('Login request data:', data); // 输出请求数据
  return req.post('/auth/login', data)
}

export function getUserInfo() {
  return req.get('/auth/info')
}

export function logout() {
  return req.post('/auth/logout')
}

export function getUserList(params: { page: number; pageSize: number; keyword?: string }) {
  return req.get('/user/list', { params })
}

export function addUser(data: {
  username: string;
  password: string;
  realName: string;
  email: string;
  roles: string[];
  status: number;
}) {
  return req.post('/user/add', data)
}

export function updateUser(data: {
  id: string;
  username: string;
  realName: string;
  email: string;
  roles: string[];
  status: number;
}) {
  return req.put(`/user/update/${data.id}`, data)
}

export function deleteUser(id: string) {
  return req.delete(`/user/delete/${id}`)
}

export function updatePassword(data: { oldPassword: string; newPassword: string }) {
  return req.put('/user/password', data)
}

export function resetUserPassword(id: string) {
  return req.put(`/user/reset-password/${id}`)
}

export function updateProfile(data: { realName: string; email: string; avatar?: string }) {
  return req.put('/admin/user/profile', data)
}

export function getUserRoles() {
  return req.get('/user/roles')
}