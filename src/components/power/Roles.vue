<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialod">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(itemO, index) in scope.row.children"
              :key="itemO.id"
            >
              <!-- 渲染一级权限列表 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, itemO.id)">
                  {{ itemO.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限列表 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限 -->
                <el-row
                  :class="[index === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(itemT, index) in itemO.children"
                  :key="itemT.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, itemT.id)"
                      >{{ itemT.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(itemF, index) in itemT.children"
                      :key="itemF.id"
                      closable
                      @close="removeRightById(scope.row, itemF.id)"
                    >
                      {{ itemF.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="level">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRolesCon(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showAddDialog"
      @close="addDialogClose"
      width="30%"
    >
      <!-- 主题信息 -->
      <!-- 内容主体区-->
      <el-form
        :model="addRolesForm"
        :rules="addFormRoles"
        ref="addRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色 -->
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showRolesDialog"
      @close="editRolesDialog"
      width="30%"
    >
      <!-- 主题信息 -->
      <!-- 内容主体区-->
      <el-form
        :model="editRolesForm"
        :rules="editFormRoles"
        ref="editRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialog"
      width="30%"
      @close='setRightDialogClosed'
    >
      <el-tree :data="rightlist" :props="treeProps"
      show-checkbox
      node-key='id'
      default-expand-all
      :default-checked-keys='defKeys'
      ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotrights">确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LoginVue from "../Login.vue";
export default {
  created() {},
  props: {},
  data() {
    return {
      //所有角色的列表
      roleslist: [],
      //添加角色框显示与隐藏
      showAddDialog: false,
      // 修改角色
      showRolesDialog: false,
      // 分配权限
      setRightDialog:false,
      //  添加角色信息
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      //修改角色
      editRolesForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      //获取到的权限列表数据
      rightlist:[],
      //权限列表默认选中的权限
      defKeys:[],
      //树形控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      //分配权限id值
      roleId:'',
      // 添加角色信息校验
      addFormRoles: {
        roleName: [
          {
            required: true,
            message: "角色名不能为空",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "角色名长度3~10个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "角色描述不能为空",
            trigger: "blur",
          },
          {
            max: 200,
            message: "角色描述字符长度不能大于200",
            trigger: "blur",
          },
        ],
      },
      //修改角色正则校验
      editFormRoles: {
        roleName: [
          {
            required: true,
            message: "角色名不能为空",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "角色名长度3~10个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "角色描述不能为空",
            trigger: "blur",
          },
          {
            max: 200,
            message: "角色描述字符长度不能大于200",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    //vue实例创建后调用函数获取角色列表数据
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      //获取所有角色的列表
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("角色信息获取失败");
      }
      this.roleslist = res.data;
    },
    addRolesDialod() {
      this.showAddDialog = !this.showAddDialog;
    },
    //关闭对话框清空内容
    addDialogClose() {
      this.$refs.addRolesRef.resetFields();
    },
    //添加角色
    addUserInfo() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return;

        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("roles", {
          roleName: this.addRolesForm.roleName,
          roleDesc: this.addRolesForm.roleDesc,
        });
        if (res.meta.status !== 201) {
          return this.$message.error("角色添加失败");
        }
        this.$message.success("角色添加成功");
        this.showAddDialog = false;
        this.getRolesList();
      });
    },
    //删除角色列表
    async removeRolesById(id) {
      const confirmResut = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesList();
    },

    // 编辑角色
    async editRolesCon(id) {
      this.showRolesDialog = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      this.editRolesForm = res.data;
    },
    editRolesDialog() {
      this.$refs.editRolesRef.resetFields();
    },
    //修改角色
    editRolesInfo() {
      this.$refs.editRolesRef.validate(async (vilid) => {
        if (!vilid) {
          return;
        }
        // 发起修改用户信息请求
        const { data: res } = await this.$http.put(
          `roles/${this.editRolesForm.roleId}`,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("角色编辑失败");
        }

        this.$message.success("角色编辑成功");
        this.showRolesDialog = false;
        this.getRolesList();
      });
    },

    //删除角色权限
    async removeRightById(role, rightid) {
      const confirmResult = await this.$confirm(
        "此操作将删除该用户权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("你已取消删除");
      }

      console.log(role.id, rightid);
      //发起删除数据请求

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("取消权限失败");
      }

      this.$message.success("取消权限成功");
      role.children = res.data;
      // this.getRolesList()
    },

    //分配权限对话框
   async showSetRightDialog(role) {
     this.roleId=role.id
    //获取权限列表数据
    const {data:res} = await this.$http.get('rights/tree')
    if(res.meta.status!==200){
      return this.$message.error('权限列表获取失败')
    }
    //获取到的数据保存在data中
    this.rightlist=res.data
    console.log(this.rightlist);
    this.getLeadfKeys(role,this.defKeys)
      this.setRightDialog=true
    },

    // 通过递归的形式来获取角色下所有三级权限的 id 并保存包 defkeys 中
    getLeadfKeys(node,arr){
      //当前node节点不包含children属性的就是三级权限
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeadfKeys(item,arr)
      });

    },
    //监听分配权限对话框的重置
    setRightDialogClosed(){
      this.defKeys=[]
    },
    //分配权限提交到服务器
    async allotrights(){
      const keys = [
       ...this.$refs.treeRef.getCheckedKeys(),
       ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const isStr= keys.join(',')
      
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:isStr
      })

      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialog=false
    }
  },
  components: {},
  computed: {},
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
