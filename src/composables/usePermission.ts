import { useUserStore } from '@/stores/user'

export function usePermission() {
 const userStore = useUserStore()

 const hasPermission = (permission: string) => {
   return userStore.permissions.includes(permission)
 }

 const hasRole = (role: string) => {
   return userStore.roles.includes(role)
 }

 return { hasPermission, hasRole }
}
