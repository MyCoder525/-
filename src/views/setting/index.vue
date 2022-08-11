<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- tap切换标签 角色管理 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:45px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="list" border="">
              <el-table-column label="序号" type="index" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template v-slot="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="margin-top: 15px">
              <!-- 分页组件 -->
              <el-pagination :page-size="page.pagesize" :current-page="page.page" background layout="prev, pager, next"
                :total="page.total" @current-change="CurrentChange">
              </el-pagination>
            </el-row>
          </el-tab-pane>

          <!-- tap切换标签 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon>
            </el-alert>
            <el-form disabled label-width="120px" style="margin-top:45px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 角色管理编辑按钮弹框 -->
    <el-dialog :title="`${this.roleFormData.id ? '编辑' : '新增'}角色`" :visible="showDialog" @close="close">
      <el-form ref="roleForm" :model="roleFormData" :rules="roleRules" label-width="120px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnOk">确定</el-button>
      </template>
    </el-dialog>
    <!-- 权限分配框 -->
    <el-dialog title="设置权限" :visible.sync="showPermissionDialog">
      <el-tree :data="permissionlist" check-strictly show-checkbox node-key="id" default-expand-all
        :default-checked-keys="checkedKeys" :props="props">
      </el-tree>
      <template slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/settings'
import { getPermissionList } from "@/api/permisson";
import { transListToTree } from "@/utils";
export default {
  data() {
    return {
      // 树形结构
      props: {
        label: 'name'
      },
      checkedKeys: [],
      permissionlist: [],
      showPermissionDialog: false,
      // 编辑弹框显示
      showDialog: false,
      // 编辑角色信息
      roleFormData: {
        name: '',
        description: ''
      },
      // 编辑角色信息验证规则
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空' }
        ]
      },
      // 存储公司信息渲染到页面
      formData: {},
      // 承接数组渲染到页面
      list: [],
      // 放置页码及相关数据
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      }
    }
  },
  created() {
    // 获取角色列表
    this.getRoleList()
    // 获取公司信息
    this.getCompanyInfo()
  },
  methods: {
    // 新增权限 树形结构
    async assignPerm(id) {
      this.permissionlist = transListToTree(await getPermissionList(), '0');
      const { permIds } = await getRoleList(id);
      this.checkedKeys = permIds;
      this.showPermissionDialog = true;
    },
    // 调用获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total;
      this.list = rows
    },
    // 分页点击列表切换
    CurrentChange(page) {
      // page 切换的最新页数 
      this.page.page = page;
      this.getRoleList();
    },
    // 获取公司信息的调用接口 需要公司的id 在vuex getters中获取
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },

    // 删除角色调用接口 //角色管理删除功能
    async del(id) {
      // 弹窗提示
      await this.$confirm('确定删除该角色吗？')
      // 获取每一行id 通过slot传递下来
      await deleteRole(id)
      // 删除之前的数据长度为1 同时页码不是第一页的情况 则自动减一
      const les = this.list.length
      if (les === 1 && this.page.page > 1) {
        this.page.page--
      }
      this.$message.success('删除成功')
      // 删除成功后重新获取列表
      this.getRoleList()
    },
    // 编辑角色弹框里的数据回显
    async edit(id) {
      this.showDialog = true;
      this.roleFormData = await getRoleDetail(id)
    },
    // 取消按钮事件
    close() {
      this.showDialog = false;
      // 重置表单
      this.$refs.roleForm.resetFields()
      // 清空表单数据
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    // 确定按钮事件
    async btnOk() {
      // 表单验证
      await this.$refs.roleForm.validate()
      if (this.roleFormData.id) {
        // 调用接口 编辑
        await updateRole(this.roleFormData)
      } else {
        // 调用接口 新增
        await addRole(this.roleFormData)
      }
      this.$message.success('操作成功')
      // 刷新列表
      this.getRoleList()
      // 关闭弹框
      this.close()
    }

  }

}
</script>

<style scoped >
</style>