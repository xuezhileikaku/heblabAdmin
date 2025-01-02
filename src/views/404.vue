<template>
    <div class="error-page">
        <div class="error-code">404</div>
        <div class="error-desc">抱歉，你访问的页面不存在</div>
        <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
</script>