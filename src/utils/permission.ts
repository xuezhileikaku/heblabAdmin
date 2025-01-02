import { useUserStore } from '@/stores/user'

// 检查是否有权限
export function hasPermission(permission: string): boolean {
  const userStore = useUserStore()
  return userStore.permissions.includes(permission)
}

// 检查是否有角色
export function hasRole(role: string): boolean {
  const userStore = useUserStore()
  return userStore.roles.includes(role)
}

// 权限指令
export const permission = {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding
    const hasAuth = hasPermission(value)
    
    if (!hasAuth) {
      el.parentNode?.removeChild(el)
    }
  }
}