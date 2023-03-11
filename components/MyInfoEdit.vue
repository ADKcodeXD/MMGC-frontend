<template>
  <el-dialog v-model="dialogFormVisible" title="修改个人信息" append-to-body>
    <el-form :model="form" :label-width="100">
      <el-form-item label="头像">
        <MyCustomAvatarUpload v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.memberName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { MemberVo } from 'Member'
import { useUserStore } from '~~/stores/user'

defineExpose({
  openDialog: () => (dialogFormVisible.value = true)
})

const { userInfo } = useUserStore()

const dialogFormVisible = ref(false)

const form = reactive<MemberVo>(userInfo!)
</script>
