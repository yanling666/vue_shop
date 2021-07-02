<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <!-- 搜索区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="DialogVisible">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 修改角色 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->

    <el-dialog
      title="用户添加"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
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
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%"
    @close='editDialogClose'
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" >
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
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  props: {},
  data() {
    // 邮箱校验规则
    let checkEmail = (rule, value, cb) => {
      //邮箱的正则表达式
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (regEmail.test(value)) {
        //合法邮箱
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };

    // 手机号校验规则
    let checkMobile = (rule, value, cb) => {
      //手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        //合法手机号
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      //获取用户列表参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前页的数据条数
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      //修改用户对话框
      editDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //查询到的用户
      editForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加用户的表单验证
      addFormRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名长度3~10个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码长度6~15个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //修改用户的校验
      editFormRules:{
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("用户信息获取失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听Switch 开关状态
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("状态更新失败");
      }
      this.$message.success("状态更新成功");
    },
    // 点击添加用户按钮弹出对话框
    DialogVisible() {
      this.addDialogVisible = !this.addDialogVisible;
    },
    //监听添加用户对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("用户添加失败");
        }
        this.$message.success("用户添加成功");

        //添加成功隐藏添加用户页面
        this.addDialogVisible = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },
    //修改用户对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/+${id}`);
      if (res.meta.status !== 200) {
        return this.message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    //监听修改对话框，清空内容
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    //表单修改预验证
    editUserInfo(){
      this.$refs.editFormRef.validate(async vilid=>{
        if(!vilid){
          return
        }
      //发起修改用户信息的请求
       const {data:res} = await this.$http.put(`users/+${this.editForm.id}`,{
         email:this.editForm.email,
         mobile:this.editForm.mobile
       })
        if(res.meta.status!==200){
          return this.$message.error('更新用户信息失败')
        }
        //关闭对话框
        this.editDialogVisible=false
        //提示用户信息提交成功
        this.$message.success('用户信息更新成功')
        //刷新用户列表
        this.getUserList()
        
      })
    },
    //通过id删除用户
   async removeUserById(id){
      const confirmResut= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //通过判断来确定是否要删除该用户数据
        if(confirmResut!=='confirm'){
         return this.$message.info('你取消了删除')
        }else{
          console.log(id);
           const {data:res} = await this.$http.delete(`users/${id}`)
           console.log(res);
          if(res.meta.status!==200){
           return this.$message.error('用户删除失败')
          }
          this.$message.success('用户删除成功')
          this.getUserList()
        }
    }
  },
  components: {},
  computed: {},
};
</script>

<style scoped lang="less">
</style>