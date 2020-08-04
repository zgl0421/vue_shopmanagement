<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card toleft">
      <el-row class="toleft">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" clearable @clear="getGoodsList" placeholder="请输入内容">
            <el-button slot="append" @click="getGoodsList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- tab表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" width="700px" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" width="100px" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" width="100px" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="160px" prop="add_time">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)">删除</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodslist: [],
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取对应商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      //   this.$message.success('获取商品列表成功')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newsize){
        this.queryInfo.pagesize = newsize
        this.getGoodsList()
    },
    handleCurrentChange(newpage){
        this.queryInfo.pagenum = newpage
        this.getGoodsList()
    },
    //删除商品
    async removeById(id){
         //先弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        //请求失败时
        return this.$message.error('删除商品失败')
      }
      this.getGoodsList()
      this.$message.success('删除商品成功')
    },
    //跳转到添加商品页面
    goAddpage(){
        this.$router.push('/goods/add')
    }
  },
}
</script>
<style lang='less' scoped>
.toleft {
  display: flex;
  justify-items: left;
  line-height: 100%;
}
.el-table {
  margin: 10px;
}
</style>
