<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTool :is-root="true" :tree-data="company" @handlerAddDept="handlerAddDept"></TreeTool>
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data" @handlerAddDept="handlerAddDept" @getDepartments="getDepartments"
            @handlerEditDept="handlerEditDept"></TreeTool>
        </template>
      </el-tree>
    </div>
    <!-- .sync 双向绑定 属性名不变 提供给子组件一个自定义事件 事件名称（'update:属性名'）-->
    <AddDept ref="addDept" :is-show-add-dept.sync="isShowAddDept" :current-node="currentNode"
      @getDepartments="getDepartments">
    </AddDept>
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments.js'
import { transListToTreeNew } from '@/utils/index.js'
export default {
  // 头部和列表组件引用
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      loading: true,
      // 点击的部门信息
      currentNode: {},
      // 是否显示添加部门弹窗
      isShowAddDept: false,
      // 组织结构的数据列表
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    };
  },
  created() {
    this.getDepartments()
  },
  // 获取树形结构数据列表
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.loading = false
      // console.log(res);
      // 赋值渲染
      this.company = {
        name: res.companyName,
        manager: res.companyManager || '负责人',
        id: ''
      }
      // 封装的树形结构桥套方法调用
      this.departs = transListToTreeNew(res.depts, '')
    },
    // 添加部门自定义事件 接受每一行的数据 传给子组件
    handlerAddDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
    },
    // // 编辑部门自定义事件 接受每一行的数据 传给子组件
    handlerEditDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
      // 调用获取详情的方法
      this.$refs.addDept.getDetailById(node.id)
    }
  }
};
</script>

<style scoped lang="scss">
.dashboard-container {
  .app-container {
    width: 850px;
    margin: 50px auto;

    .tree-card {
      background-color: #99ccff;
    }
  }
}
</style>