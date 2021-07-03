<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 
            :data=''  :绑定数据源  用来页面获取数据渲染
            type='index' 表格索引列
            label='' 标题通过这个属性
            prop  期望你想得到的数据
         -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label='权限名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='权限等级' prop='level'>
            <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
            <el-tag type='success' v-else-if="scope.row.level=='1'">标签二</el-tag>
            <el-tag type='warning' v-else>标签三</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {},
  props: {},
  data() {
    return {
      //服务器获取到的数据存在了这里面
      rightsList: [],
    };
  },
  //创建后
  created() {
    this.getRightsList();
  },
  methods: {
    //请求权限列表数据
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error("权限列获取失败");
      }
      this.rightsList = res.data;
    },
  },
  components: {},
  computed: {},
};
</script>

<style scoped lang="less">
</style>
