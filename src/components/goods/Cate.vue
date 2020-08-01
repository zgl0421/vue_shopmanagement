<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加分类按钮区域 -->
      <el-row :gutter="15">
        <el-col :span="2">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :expand-type="false"
        :data="cateList"
        border
        :show-row-hover="false"
        show-index
        index-text="#"
        :selection-type="false"
        :columns="columns"
      >
        <!-- 模板 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 模板 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 模板 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      class="bianzhai"
      title="分类添加"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed"
      width="50%"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- 级联选择框 options用来指定数据源-->
          <el-cascader
            clearable
            change-on-select
            v-model="selectedKeys"
            :options="parenCatetList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog
      class="bianzhai"
      title="修改分类信息"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <!-- 内容主体部分 -->
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取分类时需提供请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数据条数
      total: 0,
      //商品分类的数据列表，默认为空
      cateList: [],
      addCateDialogVisible: false, //控制添加分类对话框显示与隐藏
      editCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0, // 父级分类的id
        cat_level: 0, // 分类的等级，默认要添加的是一级
      },
      // 编辑分类的表单数据
      editCateForm: {
        cat_id: '',
        cat_name: '',
      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类的列表
      parenCatetList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //选中的父级分类的ID数组
      selectedKeys: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', //表示将该列定义为模板列
          template: 'isok', //表示这列使用的模板名称
        },
        {
          label: '排序',
          type: 'template', //表示将该列定义为模板列
          template: 'order', //表示这列使用的模板名称
        },
        {
          label: '操作',
          type: 'template', //表示将该列定义为模板列
          template: 'opt', //表示这列使用的模板名称
        },
      ],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      //   console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    //点击，显示添加分类对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类数据列表(前两级即可)
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parenCatetList = res.data
    },
    parentCateChanged() {
      //   console.log(this.selectedKeys)
      //父级分类发生了变化，则selectedKeys肯定要相应发生变化
      // 如果selectedKeys的长度大于0，则选中了父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击按钮，添加新的分类
    addCate() {
      // 预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        return this.$message.success('添加分类成功')
      })
    },
    // 监听对话框关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 先展示，跟据id查询填充信息
    async showEditCateDialog(id) {
      this.editCateDialogVisible = true
        console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类失败')
      }
      this.editCateForm = res.data
    },
    // 修改分类
    async editCate() {
      // 预校验
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateForm.cat_id,
          { cat_name: this.editCateForm.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败')
        }
        this.editCateDialogVisible = false
        this.$message.success('修改分类成功')
        this.getCateList()
      })
    },
    // 删除分类
    async removeCateById(id) {
      //先弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        //请求失败时
        return this.$message.error('删除分类失败')
      }
      this.getCateList()
      this.$message.success('删除分类成功')
    },
  },
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-row {
  line-height: 100%;
  margin-bottom: 10px;
}
.bianzhai {
  line-height: 100%;
  text-align: left;
}
.el-cascader {
  width: 100%;
}
</style>
