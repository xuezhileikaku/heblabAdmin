// 权限类型定义
export interface Permission {
    id: string;
    name: string;        // 权限名称
    code: string;        // 权限标识
    description: string; // 权限描述
    type: string;        // 权限类型：menu/button
    parentId?: string;   // 父级权限ID
  }
  
  // 角色类型定义
  export interface Role {
    id: string;
    name: string;        // 角色名称
    code: string;        // 角色标识
    description: string; // 角色描述
    permissions: string[]; // 权限ID列表
    status: number;      // 角色状态
    createTime: string;  // 创建时间
    updateTime: string;  // 更新时间
  }
  
  // 用户权限信息
  export interface UserPermission {
    roles: Role[];
    permissions: Permission[];
  }