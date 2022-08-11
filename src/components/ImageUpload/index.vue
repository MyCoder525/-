<template>
  <div>
    <el-upload action="#" list-type="picture-card" :file-list="fileList" :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove" :limit="1" :class="{ completed: isCompleted }" :on-change="changeFile"
      :before-upload="beforeUpload" :http-request="upload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress style="width:200px" :percentage="percentage"></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDOfkbEdniSxDE0Yu2ub3GDvOdeQ1OWO1P',
  SecretKey: 'C9rQlrhIjvsa7PSFo8D3e3D8nDOK1Ump'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      percentage: 0,
      // 指定默认的图片
      fileList: [
        {
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202105%2F19%2F20210519233901_63630.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273543&t=7255896c0a57fb9c87d8aa500cbc1d85'
        }
      ]
    };
  },
  // 判断是否有图片 有图片隐藏上传框
  computed: {
    isCompleted() {
      return this.fileList.length === 1;
    }
  },

  methods: {
    // 文件上传
    changeFile(file, fileList) {
      // fileList 最终的文件列表
      // console.log(fileList);
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // file 是当前删除的文件，fileList 是整个文件列表
      // 如果uid相同，则删除
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid);
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传前的检查 上传图片的类型和上传大小，
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小 
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    // // 进行上传操作 腾讯云上传
    upload(params) {
      const { file } = params
      if (!file) return
      cos.putObject({
        Bucket: '1830964443-1313213542', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
      }, (err, data) => {
        // data返回数据之后 应该如何处理
        if (err) {
          return this.$message.error(err.message || '上传失败')
        }
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            item.upload = true
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>