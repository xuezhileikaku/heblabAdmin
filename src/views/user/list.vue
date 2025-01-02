<template>
    <div>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="roles" label="角色">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role">{{ role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog v-model="editDialogVisible" title="编辑用户">
        <el-form :model="currentUser">
          <el-form-item label="用户名">
            <el-input v-model="currentUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="currentUser.roles" multiple>
              <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        users: [
          { id: 1, username: 'Alice', roles: ['admin'] },
          { id: 2, username: 'Bob', roles: ['editor'] },
        ],
        roles: [{ name: 'admin' }, { name: 'editor' }],
        editDialogVisible: false,
        currentUser: {},
      };
    },
    methods: {
      editUser(user) {
        this.currentUser = { ...user };
        this.editDialogVisible = true;
      },
      deleteUser(user) {
        this.users = this.users.filter(u => u.id !== user.id);
      },
      saveUser() {
        const index = this.users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
          this.users.splice(index, 1, { ...this.currentUser });
        }
        this.editDialogVisible = false;
      },
    },
  };
  </script>
  