<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="15">
        <el-col :span="2">
          <el-button type="primary" @click="addRoleDialogVisable = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" stripe border style="width: 100%">
        <!-- 第一列为展开列：第二列为添加索引页 -->
        <el-table-column label="⬇" type="expand">
          <!-- 自定义作用域插槽 -->
          <template slot-scope="scope">
            <!-- 栅格系统 -->
            <el-row
              :class="['vcenter','bdbottom',i1===0?'bdtop':'']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['vcenter',i2===0?'':'bdtop']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作" width="400">
          <!-- 作用域插槽自定义列 注意此处scope.row.id的id是获取的rolesList中的id，即表示scope.row为每行角色数据-->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRoleDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              size="mini"
            >删除</el-button>
            <el-button
              type="danger"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      class="bianzhai"
      title="角色添加"
      :visible.sync="addRoleDialogVisable"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 内容主体部分 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      class="bianzhai"
      title="修改角色信息"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <!-- 内容主体部分 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      class="bianzhai"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      @close="setRightDialogClosed"
      width="50%"
    >
      <!-- 内容主体部分 树形控件 -->
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        show-checkbox
        :data="rightsList"
        :props="treeProps"
        @node-click="handleNodeClick"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleId: '',
      rolesList: [],
      rightsList: [],
      addRoleDialogVisable: false,
      editRoleDialogVisible: false,
      setRightDialogVisible: false,
      //树形控件绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //树形控件默认选中的节点数组
      defKeys: [],
      // 添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      // 编辑角色的表单数据
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      // 添加角色表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名称的长度在2-10个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 18,
            message: '角色描述的长度在3-18个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  // 生命周期函数
  created() {
    this.getRolesList()
  },
  methods: {
    handleNodeClick(data) {
      //树形控件相关
      console.log(data)
    },
    // 获取角色数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.console('请求角色数据失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 关闭角色添加对话框的事件
    addRoleDialogClosed() {
      // 重置会话框
      this.$refs.addFormRef.resetFields()
    },
    // 关闭角色修改对话框的事件
    editRoleDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加角色
    async addRole() {
      // 预校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          // 验证失败，返回
          return
        }
        //校验成功,发起添加请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          //请求失败
          return this.$message.error('添加角色请求失败')
        }
        // 请求成功
        this.addRoleDialogVisable = false // 关闭对话框
        this.$message.success('添加角色成功')
        this.getRolesList()
      })
    },
    // 先展示，跟据id查询填充信息
    async showEditRoleDialog(id) {
      this.editRoleDialogVisible = true
      //   console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败')
      }
      this.editForm = res.data
    },
    // 修改角色
    async editRole() {
      // 预校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.editRoleDialogVisible = false
        this.$message.success('修改角色成功')
        this.getRolesList()
      })
    },
    // 删除角色
    async removeRoleById(id) {
      //先弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // console.log(confirmResult)
      // 如果点击了确认，返回值为confirm；点击了取消（包括点关闭和点空白），返回值为cancel
      if (confirmResult === 'cancel') {
        return this.$message.info('已经取消删除操作')
      }
      // 如果点击确认，则发送删除请求，进行用户删除
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        //请求失败时
        return this.$message.error('删除角色失败')
      }
      this.getRolesList()
      this.$message.success('删除角色成功')
    },
    // 根据id删除权限
    async removeRightById(role, rightId) {
      const result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 删除操作
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        // 请求失败
        return this.$message.error('发送删除请求失败')
      }
      this.$message.success('删除权限成功')
      // 重新渲染页面
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id //为了setRights(id)使用
      console.log(this.roleId)
      //获取该角色所有权限的树状结构列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表请求失败')
      }
      //   console.log(res)
      //获取成功时,权限列表赋值
      this.rightsList = res.data
      //   console.log(this.rightsList)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归形式 获取角色下所有三级权限id，并保存到数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 如果没有children 属性，说明为三级节点
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async setRights() {
      const keys = [
        this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      console.log(idStr)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败')
        }
    //   分配角色成功时
        this.$message.success('分配角色成功')
        this.getRolesList()
        this.setRightDialogVisible = false
    },
  },
}
</script>
<style lang="less" scoped>
.el-row {
  line-height: 100%;
  margin-bottom: 10px;
}
.el-table {
  line-height: 100%;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  //垂直居中
  display: flex;
  align-items: center;
}
.bianzhai {
  line-height: 100%;
  text-align: left;
}
</style>
