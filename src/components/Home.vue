<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/avatar.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'230px'">
          <div class="toggle-button" @click='toggleCollpase'>|||</div>
          <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#18202E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          :router='true'
          :default-active='activePath'
        >
            <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key='item.id'>
              <!-- 一级菜单的模板区域 -->
            <template slot="title">
                <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
           <el-menu-item :index="'/'+subItem.path"
            v-for="subItem in item.children" :key='subItem.id'
             @click="saveNavState('/'+subItem.path)">
                
                <template slot="title">
                <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
           </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  props: {},
  data() {
    return {
        //左侧菜单结构
        menulist:[],
        iconsObj:{
            '125':'el-icon-s-custom',
            '103':'el-icon-s-platform',
            '101':'el-icon-s-goods',
            '102':'el-icon-s-order',
            '145':'el-icon-s-data',
        },
        //是否折叠
        isCollapse:false,
        //被激活的连接地址
        activePath:''
    };
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
        const {data:res} = await this.$http.get('menus')
        if(res.meta.status!==200){
            return this.$message.error(res.meta.msg)
        }
        this.menulist = res.data
    },
    // 点击按钮 切换菜单的折叠与展开
    toggleCollpase(){
        this.isCollapse=!this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
    }
  },
  components: {},
  computed: {},
};
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  height: 80px !important;
  background-color: #409EFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding-left: 0;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  // width: 230px !important;
  background-color: #18202E;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu{
    border: none;
}
.toggle-button{
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
