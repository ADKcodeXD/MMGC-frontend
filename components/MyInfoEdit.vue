<template>
  <el-dialog
    style="box-shadow: var(--themeColor)"
    width="600"
    v-model="dialogFormVisible"
    title="修改个人信息"
    append-to-body
    draggable
  >
    <el-form :model="form" :label-width="100" label-position="top">
      <el-form-item label="头像">
        <MyCustomAvatarUpload v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.memberName"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="社交媒体账号">
        <el-input
          v-for="item in keys"
          :key="item"
          v-model="form.snsSite![item]"
          style="width: 48%; margin-left: 6px; margin-top: 6px"
          :placeholder="`请输入${item}账号地址`"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" disabled></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirm"> {{ $t('confirm') }} </el-button>
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
const keys: Array<keyof Sns> = ['bilibili', 'niconico', 'twitter', 'youtube', 'personalWebsite']
keys.forEach(key => {
  if (form.snsSite) {
    form.snsSite[key] = form.snsSite[key] || ''
  } else {
    form.snsSite = {}
    form.snsSite[key] = ''
  }
})
const confirm = () => {
  // 调用api
  dialogFormVisible.value = false
}
</script>
