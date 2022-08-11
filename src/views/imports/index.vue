<template>
  <div>
    <UploadExcel :on-success="onSuccess"></UploadExcel>

  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}
export default {
  name: 'Imports',
  methods: {
    async onSuccess({ results }) {
      // 处理数据
      const resArr = results.map(item => {
        // 数据对象的中文的key 转变成 英文的key
        const obj = {}
        for (const itemKey in item) {
          // 调用格式化的时间的方式
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[itemKey])) {
            obj[userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/'))
          } else {
            obj[userRelations[itemKey]] = item[itemKey]
          }
        }
        return obj
      })
      // 发送导入员工的接口请求
      await importEmployee(resArr)
      this.$message.success('导入成功')
    },
    // excel中的时间是一个数字，需要调用此方法进行处理 -> 直接复制
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>
</style>