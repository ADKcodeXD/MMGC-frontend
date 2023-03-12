<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :http-request="customUpload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="modelValue" :src="modelValue || ''" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ElMessage, UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'
import { uploadImg } from '~~/composables/apis/upload'
defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits(['update:modelValue'])

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  ElMessage.success('上传成功')
  emit('update:modelValue', response.data)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('上传头像需小于 5MB!')
    return false
  }
  return true
}

const customUpload = (options: UploadRequestOptions) => {
  const fileData = new FormData()
  const blob = new Blob([options.file])
  fileData.append('file', blob, options.file.name)
  return uploadImg(fileData)
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
