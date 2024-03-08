<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :disabled="disabled"
    :multiple="false"
    accept=".png,.jpg,.jpeg,.webp,.bmp"
    :http-request="customUpload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :on-error="() => (isLoading = false)"
  >
    <div class="avatar-uploader" v-if="isLoading">
      <MyCustomLoading />
    </div>
    <img v-else-if="modelValue" :src="modelValue || ''" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ElMessage, type UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'
import { uploadImg } from '~~/composables/apis/upload'

withDefaults(
  defineProps<{
    modelValue: string | null
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const isLoading = ref(false)

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  isLoading.value = false
  ElMessage.success(t('uploadSuccess'))
  emit('update:modelValue', response.data)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error(t('needSmallThan5'))
    return false
  }
  isLoading.value = true
  return true
}

const customUpload = (options: UploadRequestOptions) => {
  const fileData = new FormData()
  fileData.append('file', options.file, options.file.name)
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
  width: 178px;
  height: 178px;
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
