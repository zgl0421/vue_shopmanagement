<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 用户列表区域 -->
      <el-table :data="rightsList" stripe border style="width: 100%">
        <!-- 第一行代码为：添加索引页 -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="280"></el-table-column>
        <el-table-column prop="path" label="路径" width="280"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="260">
          <!-- 使用自定义插槽来自定义输出形式 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  // 生命周期函数
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        //请求失败
        return this.$message.console('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    },
  },
}
</script>
<style lang="less" scoped>
 .el-table {
     line-height: 100%;
 }
</style>
