<template>
  <div>
    <el-upload
      ref="avatar-uploader"
      class="avatar-uploader"
      action="#"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :http-request="uploadHandler"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-show="showProgress" style="width: 180px" :percentage="percentage" />
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
const COS = require('cos-js-sdk-v5')
export default {
  name: 'ImageUpload',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: this.url,
      file: null,
      showProgress: false,
      percentage: 0,
      dialogVisible: false
    }
  },
  watch: {
    imageUrl: {
      handler(val) {
        if (val) {
          document.querySelector('.avatar-uploader .el-upload--picture-card').style.display = 'none'
        }
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageUrl = ''
      this.$nextTick(() => {
        document.querySelector('.avatar-uploader .el-upload--picture-card').style.display = 'block'
      })
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
    },
    uploadHandler() {
      this.showProgress = true
      const cos = new COS({
        SecretId: 'AKID0oNhndEcm6B0cz7zby6yby6yby70e2D9',
        SecretKey: 'lGWXIn34pKaaLq67tPgkaAVaR3QXP2PX'
      })
      cos.putObject({
        Bucket: 'xiaoxiaohe-1311918412',
        Region: 'ap-chengdu',
        Key: this.file.name,
        StorageClass: 'STANDARD',
        Body: this.file, // 上传文件对象
        onProgress: (progressData) => {
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        if (data.statusCode === 200) {
          this.showProgress = false
          this.imageUrl = 'http://' + data.Location
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      this.file = file
      return isJPG && isLt2M
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  position: relative;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/*.mask {*/
/*  position: absolute;*/
/*  left: 0;*/
/*  top: 0;*/
/*  background-color: rgb(130 125 125);*/
/*  width: 180px;*/
/*  height: 180px;*/
/*}*/
</style>
