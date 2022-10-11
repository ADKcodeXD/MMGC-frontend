<template>
  <br />

  <el-button class="m-4" @click="hello">Hello</el-button>
  <el-button class="m-4" type="primary" @click="hello">Hello</el-button>
  <el-button class="m-4" type="success" @click="helloSuccess">Hello</el-button>

  <br />

  <Counter class="m-4" />

  <br />

  <el-icon class="cursor-pointer">
    <Grape />
  </el-icon>
  <el-icon class="cursor-pointer">
    <IceCream />
  </el-icon>
  <el-icon class="cursor-pointer mb-4">
    <IceDrink />
  </el-icon>

  <br />

  <client-only>
    <el-config-provider :locale="zhCn">
      <el-date-picker v-model="timeValue" type="date" placeholder="请选择日期"></el-date-picker>
    </el-config-provider>
  </client-only>
</template>

<script setup lang="ts">
import {
  ElIcon,
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElConfigProvider,
  ElDatePicker,
  ElMessage
} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { Grape, IceCream, IceDrink, ArrowDown } from '@element-plus/icons-vue'

const timeValue = ref('')
const hello = () => ElMessage.info('hello world')
const helloSuccess = () => ElMessage.success('hello world')
</script>
