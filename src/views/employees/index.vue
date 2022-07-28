<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span class="text">共500条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary">导入</el-button>
          <el-button size="mini" type="danger">导出</el-button>
          <el-button size="mini" type="warning">新增员工</el-button>
        </template>
      </ToolBar>

      <!-- 放置表格和分页 -->

      <el-table border :data="list">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column label="头像"></el-table-column>
        <el-table-column prop="workNumber" label="工号"></el-table-column>
        <el-table-column :formatter="formatter" prop="formOfEmployment" label="聘用形式"></el-table-column>
        <el-table-column prop="departmentName" label="部门名称"></el-table-column>
        <el-table-column prop="timeOfEntry" label="入职时间"></el-table-column>
        <el-table-column label="账户状态">
          <template>
            <el-switch disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page.sync="page.page"
          :total="page.total" @current-change="getEmpList"></el-pagination>
      </el-row>

    </div>
  </div>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getEmployeeList } from '@/api/employees'
export default {
  data() {
    return {
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10, // 每页显示条数
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    // 获取员工的列表数据
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
    },
    // 分页功能
    // 更简单的方法 .sync
    // changeCurrent(page) {
    //   this.page.page = page
    //   // 重新获取员工的列表数据
    //   this.getEmpList()
    // }
    // 格式化聘用形式
    formatter(row, column, cellValue) {
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  .app-container {
    .text {
      font-size: 12px;
    }
  }
}
</style>