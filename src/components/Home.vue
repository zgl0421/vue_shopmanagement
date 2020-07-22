<template>
  <div>
      主页
      <el-button type='info' @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
    methods: {
        logout () {
            window.sessionStorage.removeItem('token') // 销毁token
            this.$router.push('/login') // 强制跳转到登录页面
        }
    }
}
</script>
<style lang='less' scoped></style>
