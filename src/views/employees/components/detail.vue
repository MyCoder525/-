<template>
  <el-card class="card">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form ref="form" :model="formData" :rules="rules" label-width="120px" class="input">
          <el-form-item prop="username" label="姓名">
            <el-input v-model="formData.username" style="width:30%"></el-input>
          </el-form-item>
          <el-form-item prop="password2" label="密码">
            <el-input v-model="formData.password2" style="width:30%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">更新</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <component :is="UserInfo"></component>
        <!-- <UserInfo></UserInfo> -->
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <!-- <JobInfo></JobInfo> -->
        <component :is="JobInfo"></component>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password2: ''
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }

        ],
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getUserInfo()
  },
  // 获取用户信息 并赋值给formData
  methods: {
    async getUserInfo() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    // 更新用户信息 
    async updateUserInfo() {
      // 表单验证
      await this.$refs.form.validate()
      try {
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.error(e.$message || '更新失败')
      }
    }
  }

}
</script>

<style scoped lang="scss">
.card {
  margin: 20px;

  .input {
    margin-top: 20px;
  }
}
</style>