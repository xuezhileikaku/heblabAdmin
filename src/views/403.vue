<template>
    <div class="error-page">
        <div class="error-code">403</div>
        <div class="error-desc">抱歉，你无权访问该页面</div>
        <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
</script>