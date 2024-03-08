<template>
  <el-dialog
    style="box-shadow: var(--themeColor)"
    width="600"
    lock-scroll
    v-model="dialogFormVisible"
    :title="$t('updateMyInfo')"
    top="5vh"
    append-to-body
    draggable
  >
    <el-form :model="form" :label-width="100" label-position="top" ref="formRef" :rules="rules">
      <el-form-item :label="$t('avatar')">
        <MyCustomAvatarUpload v-model="form.avatar" />
      </el-form-item>
      <el-form-item :label="$t('nickname')">
        <el-input v-model="form.memberName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('username')">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('descriable')">
        <el-input v-model="form.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item :label="$t('snsAccounts')">
        <el-input
          v-for="item in keys"
          :key="item"
          v-model="form.snsSite![item]"
          style="width: 48%; margin-left: 6px; margin-top: 6px"
          :placeholder="`${$t('inputXXurl', [item])}`"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('email')">
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
import type { MemberVo } from 'Member'
import { UserApi } from '~~/composables/apis/user'
import { useUserStore } from '~~/stores/user'
import { genral } from '~~/composables/useFormRules'
import lodash from 'lodash'

defineExpose({
  openDialog: () => (dialogFormVisible.value = true)
})

const { userInfo } = useUserStore()

const dialogFormVisible = ref(false)

const formRef = ref()
const { t } = useI18n()

const rules = reactive({
  memberName: genral(t('nickname'), t)
})

const tempUser = lodash.cloneDeep(userInfo)

const form = reactive<MemberVo>(tempUser!)
const keys: Array<keyof Sns> = ['bilibili', 'niconico', 'twitter', 'youtube', 'personalWebsite']
keys.forEach(key => {
  if (form.snsSite) {
    form.snsSite[key] = form.snsSite[key] || ''
  } else {
    form.snsSite = {}
    form.snsSite[key] = ''
  }
})

const confirm = async () => {
  const userStore = useUserStore()
  // 调用api
  await formRef.value.validate()
  const values = lodash.cloneDeep(form) as any
  delete values.email
  delete values.role
  delete values.createTime
  delete values.username
  await UserApi.updateMyInfo(values)
  await userStore.refreshUserStore()
  ElMessage.success(t('updateSuccess'))
  dialogFormVisible.value = false
}
</script>
