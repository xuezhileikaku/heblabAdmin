import { usePermission } from '@/composables/usePermission'

export const permission = {
 mounted(el: HTMLElement, binding: any) {
   const { hasPermission } = usePermission()
   const { value } = binding
   
   if (!hasPermission(value)) {
     el.parentNode?.removeChild(el)
   }
 }
}
