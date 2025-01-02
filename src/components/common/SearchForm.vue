<template>
    <el-form :inline="true" :model="form" @keyup.enter="search">
        <slot name="prefix"></slot>
        <el-form-item v-for="item in fields" :key="item.prop">
            <el-input v-if="item.type === 'input'" v-model="form[item.prop]" :placeholder="item.placeholder" />
            <el-select v-if="item.type === 'select'" v-model="form[item.prop]" :placeholder="item.placeholder">
                <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
        <slot name="suffix"></slot>
    </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
    fields: {
        prop: string
        type: 'input' | 'select'
        placeholder?: string
        options?: { label: string; value: any }[]
    }[]
}>()

const emit = defineEmits<{
    (e: 'search', form: any): void
}>()

const form = reactive<Record<string, any>>({})

const search = () => emit('search', { ...form })

const reset = () => {
    Object.keys(form).forEach(key => form[key] = undefined)
    emit('search', { ...form })
}
</script>