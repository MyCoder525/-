<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTool :is-root="true" :tree-data="company"></TreeTool>
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data" @getDepartments="getDepartments"></TreeTool>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments.js'
import { transListToTreeNew } from '@/utils/index.js'
export default {
  // 头部和列表组件引用
  components: {
    TreeTool
  },
  data() {
    return {
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
      // console.log(res);
      // 赋值渲染
      this.company = {
        name: res.companyName,
        manager: res.companyManager || '负责人'
      }
      // 封装的树形结构桥套方法调用
      this.departs = transListToTreeNew(res.depts, '')
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