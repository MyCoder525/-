<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #after>
          <el-button size="mini" type="primary" @click="addPermissionlist('0', 1)">
            添加权限
          </el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table :data="list" border="" row-key="id">
        <el-table-column align="center" label="序号" type="index" width="80" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作" prop="">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermissionlist(row.id, 2)">
              添加
            </el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="dialogVisible" width="60%" @close="close">
      <el-form ref="form" :model="formAdd" :rules="formAddRules" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formAdd.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formAdd.description"></el-input>
        </el-form-item>
        <el-form-item label="是否开启" prop="enVisible">
          <el-switch v-model="formAdd.enVisible" active-color="red" inactive-color="green">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="btnOk"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar/index.vue";
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from "@/api/permisson.js";
import { transListToTree } from "@/utils";
export default {
  components: {
    ToolBar
  },
  data() {
    return {
      dialogVisible: false,
      formAdd: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0" // 开启
      },
      formAddRules: {
        name: [{ required: true, target: "blur", message: "权限名称不能为空" }],
        code: [
          {
            required: true,
            target: "blur",
            message: "权限标识不能为空"
          }
        ],
        description: "",
        enVisible: ""
      },
      list: []
    };
  },
  created() {
    this.getPermissionList();
  },
  computed: {
    title() {
      return this.formAdd.id ? "编辑" : "新增";
    }
  },
  methods: {
    // 编辑权限点的事件
    async editPermission(id) {
      const res = await getPermissionDetail(id)
      this.formAdd = res;
      this.dialogVisible = true;
    },
    // 删除权限
    async delPermission(id) {
      await this.$confirm('确认删除')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    async btnOk() {
      await this.$refs.form.validate();
      try {
        // 编辑
        if (this.formAdd.id) {
          await updatePermission(this.formAdd);
        } else {
          // 添加
          await addPermission(this.formAdd);
        }
        this.$message.success(`${this.title}权限点成功`);
        this.close();
      } catch (e) {
        console.log(e);
        this.close();
        this.$message.error("添加失败");
      }
    },
    close() {
      this.formAdd = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0" // 开启
      };
      this.$refs.form.resetFields();
      this.dialogVisible = false;
      this.getPermissionList();
    },
    addPermissionlist(pid, type) {
      this.formAdd.pid = pid;
      this.formAdd.type = type;
      this.dialogVisible = true;
    },

    async getPermissionList() {
      const res = await getPermissionList();
      console.log(res);
      this.list = res;
      this.list = transListToTree(this.list, "0");
    }
  }
};
</script>

<style>
</style>
