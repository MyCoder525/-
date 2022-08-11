<template>
  <div>
    <el-dialog title="新增员工" :visible="isShowAdd" @close="close">
      <!-- 表单 -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="username" label="姓名">
          <el-input v-model="formData.username" style="width:85%" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="formData.mobile" style="width:85%" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="timeOfEntry" label="入职时间">
          <el-date-picker v-model="formData.timeOfEntry" style="width:85%" placeholder="请选择入职时间" />
        </el-form-item>
        <el-form-item prop="formOfEmployment" label="聘用形式">
          <el-select v-model="formData.formOfEmployment" style="width:85%" placeholder="请选择">
            <el-option v-for="item in selectOptions" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item prop="workNumber" label="工号">
          <el-input v-model="formData.workNumber" style="width:85%" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item prop="departmentName" label="部门">
          <!-- <el-input v-model="formData.departmentName" style="width:85%" placeholder="请选择部门" />
           -->
          <el-cascader v-model="formData.departmentName" :options="treeData" style="width:80%" :props="{
            label: 'name', value: 'name', checkStrictly: true, emitPath: false
          }" @focus="getDepartments"></el-cascader>
        </el-form-item>
        <el-form-item prop="correctionTime" label="转正时间">
          <el-date-picker v-model="formData.correctionTime" style="width:85%" placeholder="请选择转正时间" />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="close()">取消</el-button>
            <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils/index.js'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  name: 'AddDemplovee',
  props: {
    isShowAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [], // 定义数组接收树形数据
      selectOptions: EmployeeEnum.hireType, // 聘用形式
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 表单验证规则
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  created() {

  },
  methods: {
    // 关闭弹层
    close() {
      this.$emit('update:isShowAdd', false)
      // 重置表单
      this.$refs.formRef.resetFields()
      // 清空表单数据
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    },
    // 部门的树形选择框
    async getDepartments() {
      const { depts } = await getDepartments()
      // 封装的方法调用
      this.treeData = transListToTree(depts, '')
    },
    // 确定按钮 提交
    async btnOk() {
      // 检验表单
      await this.$refs.formRef.validate()
      // 接口的提交
      await addEmployee(this.formData)
      // 成功的提示
      this.$message.success('添加成功')
      // 关闭弹层
      this.close()
      // 刷新页面
      this.$parent.getEmpList()
    }
  }

}
</script>

<style>
</style>