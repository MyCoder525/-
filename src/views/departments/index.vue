<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTool :is-root="true" :tree-data="company"></TreeTool>
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data"></TreeTool>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments.js'
export default {
  components: {
    TreeTool
  },
  data() {
    return {
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
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      console.log(res);
      this.company = {
        name: res.companyName,
        manager: res.companyManager || '超级管理员'
      }
      this.departs = res.depts
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