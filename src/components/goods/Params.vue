<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 头部警告区 -->
      <el-alert show-icon :closable="false" title="注意：只允许为第三季分类设置相关参数！" type="warning"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col class="toleft">
          <span>选择商品列表：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            expandTrigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <div>
        <el-tabs class="cat_opt" v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button
              class="toleft"
              type="primary"
              @click="addDialogVisible = true"
              :disabled="isBtnDisabled"
              size="mini"
            >添加参数</el-button>
            <!-- 动态参数表格 -->
            <el-table :data="manyTableData" border stripe style="width: 100%">
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染tag标签 -->
                  <el-tag
                    closable
                    v-for="(item,i) in scope.row.attr_vals"
                    @close="handleClose(i,scope.row)"
                    :key="i"
                  >{{item}}</el-tag>
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <!-- 添加的按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name" width="400"></el-table-column>
              <el-table-column label="操作" width="800">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="showEditDialog(scope.row.attr_id)"
                    icon="el-icon-edit"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="removeParams(scope.row.attr_id)"
                    icon="el-icon-delete"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 添加静态属性的面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              class="toleft"
              type="primary"
              @click="addDialogVisible = true"
              :disabled="isBtnDisabled"
              size="mini"
            >添加属性</el-button>
            <!-- 静态参数表格 -->
            <el-table :data="onlyTableData" border stripe style="width: 100%">
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染tag标签 -->
                  <el-tag
                    closable
                    v-for="(item,i) in scope.row.attr_vals"
                    @close="handleClose(i,scope.row)"
                    :key="i"
                  >{{item}}</el-tag>
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <!-- 添加的按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name" width="380"></el-table-column>
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="showEditDialog(scope.row.attr_id)"
                    icon="el-icon-edit"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="removeParams(scope.row.attr_id)"
                    icon="el-icon-delete"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      class="toleft"
      :title="'添加' +titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      class="toleft"
      :title="'修改' +titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类列表
      catelist: [],
      cateProps: {
        //级联选择框的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //添加参数的表单数据对象
      addForm: {
        attr_name: '',
      },
      editForm: {}, //修改的表单数据对象
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      //修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      addDialogVisible: false, //控制添加对话框
      editDialogVisible: false,
      inputVisible: false, //控制按钮与文本框的切换显示
      inputValue: '', //文本框中输入的内容
      activeName: 'many', //被激活的页签的名称
      //级联选择框的双向绑定列表
      selectedCateKeys: [],
      manyTableData: [], //动态参数的数据
      onlyTableData: [], //静态参数的数据
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    //级联选择框 选中后触发
    handleChange() {
      this.getParamsData()
    },
    async getParamsData() {
      // 如果选中的不是三级分类，就清空一下
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData =[]
        this.onlyTableData=[]
        return
      }
      //如果选中的是三级分类
      console.log(this.selectedCateKeys)
      //根据所选分类的ID和当前所处的面板，获取对应的数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        //文本框输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // tab 页签点击事件
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm = []
    },
    //点击按钮，添加参数
    addParams() {
      // 预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.getParamsData()
        this.addDialogVisible = false
        return this.$message.success('添加参数成功')
      })
    },
    // 点击按钮，展示修改参数对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮，修改参数信息
    async editParams() {
      // 预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.getParamsData()
        this.editDialogVisible = false
        return this.$message.success('添加参数成功')
      })
    },
    //点击删除参数
    async removeParams(id) {
      //先弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        //请求失败时
        return this.$message.error('删除参数失败')
      }
      this.getParamsData()
      this.$message.success('删除参数成功')
    },
    //文本框失去焦点或按下enter键触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //如果输入了内容
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 将对参数的可选项操作上传到数据库
    async saveAttrVals(row) {
      //发送请求，保存操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('新增失败')
      }
      this.$message.success('新增成功')
    },
    showInput(row) {
      row.inputVisible = true
      //让文本框自动获得焦点
      // $nextTick的作用：当页面上元素被重新渲染后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应参数的可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        // 即 未选中
        return true
      }
      return false
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>
<style lang="less" scoped>
.el-alert {
  line-height: 100%;
}
.box-card,
.toleft {
  display: flex;
  justify-items: left;
  line-height: 100%;
}
span {
  line-height: 45px;
  height: 36px;
}
.cat_opt {
  margin: 15px 0;
  line-height: 100%;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 250px;
}
</style>
