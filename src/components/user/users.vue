<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 使用了栅格进行划分-->
      <el-row :gutter="15">
        <el-col :span="7">
          <el-input clearable @clear="getUserList" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border style="width: 100%">
        <!-- 第一行代码为：添加索引页 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <!-- 根据boolean类型渲染为开关 使用作用域插槽-->
          <template slot-scope="scope">
            <!-- {{scope.row.mg_state}} -->
            <!-- 绑定状态改变事件 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <!-- 作用域插槽自定义列 -->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :enterable="false" content="编辑" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" content="删除" placement="top">
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="danger"
                @click="showSetRoleDialog(scope.row)"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      class="bianzhai"
      title="用户添加"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体部分 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      class="bianzhai"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体部分 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      class="bianzhai"
      :visible.sync="setRoleDialogVisible"
      @close="setRoleDialogClosed"
      width="50%"
    >
      <!-- 内容主体部分 -->
      <div>
        <p2>当前的用户:{{this.userInfo.username}}</p2>
        <br />
        <br />
        <p2>当前的角色:{{this.userInfo.role_name}}</p2>
        <br />
        <br />
        <!-- 下拉选框 选中时实际将value保存绑定到v-model-->
        <p2>选择新角色：</p2>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义校验规则
    //验证邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        // 合法
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|1[8|9][0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 验证邮箱的校验规则

      // 用于获取用户列表的参数对象；
      queryInfo: {
        query: '', // 获取用户列表的参数对象
        pagenum: 1, // 当前的页数
        pagesize: 5, // 当前每页显示数据条数
      },
      rolesList: [], // 角色列表
      userInfo: [], //需要被分配角色的用户信息
      userList: [],
      selectedRoleId: [], // 分配角色时选中的用户id值
      total: 0,
      setRoleDialogVisible: false, //控制分配角色对话框显示与隐藏
      addDialogVisible: false, // 控制添加用户对话框显示与隐藏
      editDialogVisible: false, // 控制修改用户对话框显示与隐藏
      addForm: {
        // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 编辑用户的表单数据，同步
      editForm: {
        id: '',
        username: '',
        role_id: 0,
        mobile: '',
        email: '',
      },
      // 添加用户表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '密码的长度在6-18个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 修改用户信息表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 发起ajax请求
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      // 获取成功
      this.userList = res.data.users
      this.total = res.data.total
      //   console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
      console.log(`每页 ${val} 条`)
    },
    // 监听页码值改变的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
      console.log(`当前页: ${val}`)
    },
    // 监听switch状态开关的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        // 请求失败
        userinfo.mg_state = !userinfo.mg_state // 将状态恢复到原来状态
        return this.$message.error('更新用户状态失败')
      } else {
        this.$message.success('更新用户状态成功')
      }
    },
    //监听添加用户对话框关闭的方法
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //监听修改用户对话框关闭的方法
    editDialogClosed() {
      this.$refs.editFormRef.resetFields() // 重置表单
    },
    // 点击按钮，添加新用户
    addUser() {
      // 预校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          // 验证失败，返回
          return
        }

        // 如果验证成功，发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          // 请求失败
          this.$message.error('添加用户失败')
        }
        // 请求成功
        this.$message.success('添加用户成功')
        this.addDialogVisible = false // 隐藏对话框
        this.getUserList() //重新获取用户列表
        this.$refs.editFormRef.resetFields() // 重置表单
      })
    },
    // 点击按钮，修改用户信息
    editUser() {
      // 预校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          // 验证失败，返回
          return
        }
        // 如果验证成功，发起修改用户请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) {
          //请求失败
          return this.$message.error('修改用户信息失败')
        }
        // 请求成功的情况
        this.editDialogVisible = false //关闭对话框
        this.getUserList() // 刷新用户列表
        this.$message.success('修改用户信息成功')
      })
    },
    // 展示用户编辑的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`) // 根据ID查询用户信息
      if (res.meta.status !== 200) {
        // 请求失败
        return this.$message.error('查询用户信息失败')
      }
      // 请求成功时
      this.editForm = res.data
    },
    // 删除用户
    async removeUserById(id) {
      //先弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        //请求失败时
        return this.$message.error('删除用户失败')
      }
      this.getUserList()
      this.$message.success('删除用户成功')
    },
    //展示分配角色对话框
    async showSetRoleDialog(userInfo) {
      this.setRoleDialogVisible = true
      this.userInfo = userInfo
      // console.log(this.userInfo)
      //获取全部角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      //保存角色列表
      this.rolesList = res.data
    },
    // 分配角色
    async setRole() {
      // 先判断是否选择新角色
      if (!this.selectedRoleId) {
        //没有选择
        return this.$message.error('请选择要分配的角色')
      }
      // console.log(this.selectedRoleId)
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      )
       console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('分配角色失败')
        }
        this.$message.success('分配角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      setRoleDialogClosed() {
        this.selectedRoleId = []
        this.userInfo = []
    },
  },
}
</script>
<style lang='less' scoped>
.el-row {
  line-height: 100%;
}
.el-table {
  line-height: 100%;
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
  line-height: 100%;
  padding-left: 0;
  display: flex;
  justify-self: start;
}
.bianzhai {
  line-height: 100%;
  text-align: left;
}
</style>
