<template>
  <div>
    <el-dialog :title="`${showTitle}【${currentNode.name}】`" :visible="isShowAddDept" @close="close">
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="formData.name" placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="部门编码">
          <el-input v-model="formData.code" placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item prop="manager" label="部门负责人">
          <!-- <el-input v-model="formData.manager"></el-input> -->
          <el-select v-model="formData.manager" placeholder="请选择" style="width:100%" @focus="getSimpleEmp">
            <el-option v-for="item in options" :key="item.value" :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="introduce" label="部门介绍">
          <el-input v-model="formData.introduce" type="textarea" :rows="5" placeholder="1-300个字符"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button type="primary" size="small" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments.js'
import { getEmployeeSimple } from '@/api/employees.js'

export default {
  name: 'AddDept',
  // 接受父组件的是否展示弹出框
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    // 接受父组件点击的部门信息 当前点击的部门信息
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async (rule, value) => {
      // 1.调接口，获取组织架构数据 获取所有部门数据
      const { depts } = await getDepartments()
      // 2.遍历所有部门数据，找出特点 pid=== 当前点击的id 
      // 编辑场景 需要把自己过滤掉再去判断
      let currentChildren = null
      if (this.formData.id) {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }
      // 3.判断当前输入的部门名称是否重复 如果有重复的部门名称，提示用户
      const isRepeat = currentChildren.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject('部门名称重复')
      }
    };
    const checkCode = async (rule, value) => {
      // 1.调接口，获取组织架构数据 获取所有部门数据
      const { depts } = await getDepartments()
      let isRepeat = null
      // 2.检查编码是否重复
      // 编辑场景 需要把自己过滤掉再去判断
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }

      // 3.如果重复，提示用户
      if (isRepeat) {
        return Promise.reject('部门编码重复')
      }
    };
    return {
      // 添加部门负责人的下拉框数据
      options: [],
      // 表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          {
            validator: checkName, // 自定义函数的形式校验
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          {
            validator: checkCode, // 自定义函数的形式校验
            trigger: 'blur'
          }
        ],
        manager: [
          { required: true, message: '请输入部门负责人', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  // 计算属性，动态控制标题
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 添加部门负责人的下拉框数据 调用接口获取所有员工数据
    async getSimpleEmp() {
      this.options = await getEmployeeSimple()
    },
    // 调用 * 获取部门详情 显示在编辑上
    async getDetailById(id) {
      this.formData = await getDepartDetail(id)
    },
    // 提交表单数据
    async submit() {
      // 1.表单校验
      await this.$refs.form.validate()
      //  编辑接口的调用 根据formData.id是否有值，来判断是新增还是编辑
      // 新增接口的调用
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      this.$message.success(`${this.showTitle}成功`)
      // 重新拉取数据 通知父组件执行
      this.$emit('getDepartments')
      // 关闭弹出框
      this.close()
    },
    // 关闭弹出框
    close() {
      // 清空表单数据
      this.$refs.form.resetFields()
      // 强制清空表单
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 2.关闭弹出框 通过.sync方法提供的自定义事件修改父组件的isShowAddDept值
      this.$emit('update:isShowAddDept', false)
    }
  }
}
</script>

<style>
</style>