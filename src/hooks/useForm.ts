import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

export function useForm() {
    const formRef = ref<FormInstance>()
    const loading = ref(false)

    const validateForm = async () => {
        if (!formRef.value) return false
        return formRef.value.validate()
    }

    const resetForm = () => {
        formRef.value?.resetFields()
    }

    return {
        formRef,
        loading,
        validateForm,
        resetForm
    }
}