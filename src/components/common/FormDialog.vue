<template>
    <el-dialog v-model="visible" :title="title" :width="width" :before-close="handleClose">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <slot></slot>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="handleSubmit">
                确 定
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
    title: string
    width?: string | number
    visible: boolean
    form: any
    rules?: any
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
}>()

const formRef = ref<FormInstance>()

const handleClose = () => {
    emit('update:visible', false)
}

const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate()
    emit('submit')
}
</script>