<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span class="text">共500条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="mini" type="warning" @click="isShowAdd = true">新增员工</el-button>
        </template>
      </ToolBar>

      <!-- 放置表格和分页 -->
      <el-table border :data="list">
        <el-table-column type="index" label="序号" width="80" sortable=""></el-table-column>
        <el-table-column prop="username" label="姓名" sortable=""></el-table-column>
        <el-table-column label="头像" sortable=""></el-table-column>
        <el-table-column prop="workNumber" label="工号" sortable=""></el-table-column>
        <el-table-column :formatter="formatter" prop="formOfEmployment" label="聘用形式" sortable=""></el-table-column>
        <el-table-column prop="departmentName" label="部门名称" sortable=""></el-table-column>
        <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
          <template v-slot="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="">
          <template>
            <el-switch disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280" sortable="">
          <template v-slot="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page.sync="page.page"
          :total="page.total" @current-change="getEmpList"></el-pagination>
      </el-row>

    </div>
    <!-- 点击新增员工的弹层组件 -->
    <AddDemplovee :is-show-add.sync="isShowAdd"></AddDemplovee>
  </div>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import AddDemplovee from '@/views/employees/components/add-employee'
export default {
  components: {
    AddDemplovee
  },
  data() {
    return {
      // 新增员工
      isShowAdd: false,
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
    // 打包的时候使用魔法注释自定义打包的文件名
    // /*webpackChunkName:'export2Excel'*/'
    // 导出excel
    async exportToExcel() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })

      const { export_json_to_excel } = await import('@/utils/Export2Excel')
      const resData = this.fromatterData(rows, headers)

      export_json_to_excel({
        header: Object.keys(headers),
        data: resData,
        filename: 'excel-list',
        autoWidth: true,
        bookType: 'xlsx'
      })
    },
    // 格式化数据 将数据格式化为excel需要的格式
    fromatterData(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
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
    },
    // 删除员工
    async del(id) {
      try {
        //  提示
        await this.$confirm('是否删除')
        // 调取接口
        await delEmployee(id)
        this.$message.success('删除成功')
        // 重新获取员工的列表数据
        await this.getEmpList()
      } catch (e) {
        console.log(e);
      }
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