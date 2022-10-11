<template>
  <div class="MMGC-header">
    <section class="MMGC-header-logo" @click="$router.push('/')">
      <img src="@/assets/img/2022logo.png" />
    </section>
    <nav class="MMGC-header-nav">
      <p class="nav-item">
        <NuxtLink :to="`/activity/${activityId}/about`"> 介绍 </NuxtLink>
      </p>
      <i class="split">/</i>
      <p class="nav-item">
        <NuxtLink :to="`/activity/${activityId}/main`"> 主会场 </NuxtLink>
      </p>
      <i class="split">/</i>
      <p class="nav-item">主办&赞助</p>
      <i class="split">/</i>
      <p class="nav-item">往届赛事<i class="iconfont mmgc-iconchevron-down"></i></p>
    </nav>
    <section class="MMGC-header-oper">
      <ElDropdown trigger="click">
        <div class="oper-item">
          <i class="iconfont mmgc-iconyuyan"></i>
          <p>语言</p>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem>中文简体</ElDropdownItem>
            <ElDropdownItem>日本语</ElDropdownItem>
            <ElDropdownItem>English</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <div class="oper-item">
        <i class="iconfont mmgc-icondenglu-copy"></i>
        <p>登录</p>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
withDefaults(
  defineProps<{
    activityId?: number
  }>(),
  {
    activityId: 2023
  }
)
</script>
<style lang="scss" scoped>
.MMGC {
  &-header {
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: $themeNotActiveColor;
    background-image: linear-gradient(to top, #00000000 0%, rgba(0, 0, 0, 0.301) 100%);
    &-logo {
      width: 14rem;
      height: 5.4rem;
      cursor: pointer;
    }
    &-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $themeNotActiveColor;
      font-size: $bigFontSize;
      font-weight: 600;
      .nav-item {
        cursor: pointer;
        display: flex;
        transition: color 0.4s ease;
        line-height: $bigFontSize;
        .iconfont {
          font-size: $bigFontSize;
        }
        &:hover {
          color: $themeColor;
        }
      }
      .split {
        margin: 0px 4rem;
        font-weight: 600;
      }
    }
    &-oper {
      width: 14rem;
      display: flex;
      justify-content: space-around;
      .oper-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $themeNotActiveColor;
        font-size: 12px;
        line-height: normal;
        transition: color 0.4s ease;
        .iconfont {
          font-size: $bigFontSize;
          margin-bottom: 5px;
        }
        &:hover {
          color: $themeColor;
        }
      }
    }
  }
}
</style>
