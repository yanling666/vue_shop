<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treetable"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success colorO" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error colorT" v-else></i>
        </template>

        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>

        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-search"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页器 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 指定数据源 -->
          <!--  -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
            change
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="edidCateDialogVisible"
      width="30%"
    >
      <el-form
        :model="editCateForm"
        :rules="editFormRoles"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edidCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  props: {},
  data() {
    return {
      //商品分类数据列表 默认为空
      catelist: [],
      //querInfo 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 数据总条数
      total: 0,
      //为table指定列的定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          //表示 当前列定义为模板列’
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示 当前列定义为模板列’
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示 当前列定义为模板列’
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      //添加分类对话框显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateFrom: {
        //父级分类名称
        cat_name: "",
        //   父级分类id
        cat_pid: 0,
        // 分类的等级 默认要添加的是1级分类
        cat_level: 0,
      },
      //添加分类 校验规则
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中父级分类的id数组
      selectedKeys: [],

      //编辑分类对话框显示与隐藏
      edidCateDialogVisible: false,

      //修改角色
      editCateForm: {
        cat_id: "",
        cat_name: "",
        cat_pid:'',
        cat_level:''
      },
    //   编辑分类的正则校验
    editFormRoles:{
        cat_name:[
            { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
    }
    };
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      //给数据列表赋值
      this.catelist = res.data.result;
      //为数据总条数赋值
      this.total = res.data.total;
    },
    //监听当前页数据的变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听当前页数的变化
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum;
      this.getCateList();
    },
    //展示添加分类对话框
    showAddCateDialog() {
      //先获取数据列表在打开对话框
      this.getParentCatelist();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败");
      }
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      // 如果selectedKeys 数组中的length 大于0 证明 选中的父级分类
      //反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        console.log(this.selectedKeys);
        //父级分类的id
        this.addCateFrom.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        //为当前分类等级赋值
        this.addCateFrom.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateFrom.cat_pid = 0;
        //为当前分类等级赋值
        this.addCateFrom.cat_level = 0;
      }
    },
    //点击按钮 添加新分类
    addCate() {
      this.$refs.addCateFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateFrom
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    //监听对话框的关闭事件 重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFromRef.resetFields();
      this.selectedKeys = [];
      this.addCateFrom.cat_name = "";
      this.addCateFrom.cat_pid = 0;
      this.addCateFrom.cat_level = 0;
    },
    // 删除
    async removeCate(id) {
      const confirmResut = await this.$confirm(
        "此操作将永久删除该商品分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //通过判断来确定是否要删除该用户数据
      if (confirmResut !== "confirm") {
        return this.$message.info("你取消了删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getCateList();
    },
    //编辑
    async editCate(id) {
      this.edidCateDialogVisible = true;
      const { data: res } = await this.$http.get("categories/" + id);
      this.editCateForm=res.data
    },

    // 修改分类
    editCateInfo(){
        this.$refs.editCateRef.validate(async vilid=>{
            if(!vilid){
                return;
            }
            // 发起修改用户信息请求
            const {data:res}=  await this.$http.put(`categories/${this.editCateForm.cat_id}`
            ,{cat_name:this.editCateForm.cat_name}
            
            )
            if(res.meta.status!==200){
                return this.$message.error('修改分类失败')
            }
            this.$message.success('编辑成功')
            this.edidCateDialogVisible=false
            this.getCateList()
            
        })

    }
  },
  components: {},
  computed: {},
};
</script>

<style scoped lang="less">
.colorO {
  color: lightgreen;
}
.colorT {
  color: red;
}
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
