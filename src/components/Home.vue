<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo2.png" alt />
        <span>电商后台管理信息系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 控制折叠展开的按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#20222A"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--使索引不同，避免点击一个其他同样响应-->
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标   定义动态类，接收不同的图标-->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 点击时保存导航链接到会话存储中，以便刷新时重载 -->
            <el-menu-item
              :index="'/'+subitem.path"
              @click="saveNavState('/'+subitem.path)"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpin-copy',
        102: 'iconfont icon-icon-',
        145: 'iconfont icon-tongji'
      },
      isCollapse: false,
      activePath: '' // 被激活的导航链接地址
    }
  },
  // 定义周期函数
  created() {
    this.getMenuList() // 一创建，就加载菜单列表
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token') // 销毁token
      window.sessionStorage.removeItem('activePath') // 销毁
      this.$router.push('/login') // 强制跳转到登录页面
    },
    async getMenuList() {
      // 获取所有菜单
      const { data: res } = await this.$http.get('menus')
      // 如果获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 如果获取成功
      this.menuList = res.data
      console.log(this.menuList)
    },
    toggleCollapse() {
      // 折叠
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      // 保存导航状态链接
      console.log(activePath)
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang='less' scoped>
.el-header {
  background-color: #24262f;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      height: 100%;
      transform: translate(-30%, 0);
    }
    span {
      font-size: 20px;
      color: #d2d3d4;
    }
  }
}
.el-aside {
  background-color: #20222a;
  color: #333;
  text-align: center;
  line-height: 200px;
  .toggle-button {
    background-color: #343943;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none; //去除菜单栏的右侧边框线
    .el-menu-item {
      padding: 0 4px; // 子菜单相对父级栏靠右
    }
    .iconfont {
      margin-right: 10px; //图标与文字有空隙
    }
  }
}
.el-main {
  background-color: #f2f2f2;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.home_container {
  height: 100%;
}
</style>
