<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>个人信息</span>
            </div>
        </template>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="用户名">
                <span>{{ userInfo?.username || '未设置' }}</span> <!-- 添加可选链和默认值 -->
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="form.realName" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { updateProfile } from '@/api/user'

const userStore = useUserStore()
const { userInfo, getUserInfo } = userStore

// 确保 userInfo 有默认值
const form = reactive({
    realName: userInfo?.realName || '', // 使用可选链和默认值
    email: userInfo?.email || ''
})


// 监听 userInfo 的变化
watch(() => userStore.userInfo, (newUserInfo) => {
    if (newUserInfo) {
        form.realName = newUserInfo.realName
        form.email = newUserInfo.email
    }
})

const rules = {
    realName: [
        { required: true, message: '请输入真实姓名' }
    ],
    email: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱' }
    ]
}


const handleSubmit = async () => {
    try {
        await updateProfile(form)
        ElMessage.success('更新成功')
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

// 在组件挂载时获取用户信息
onMounted(async () => {
    try {
        await getUserInfo() // 获取用户信息
        // 更新表单数据
        form.realName = userInfo?.realName || ''
        form.email = userInfo?.email || ''
    } catch (error) {
        ElMessage.error('获取用户信息失败')
    }
})
</script>