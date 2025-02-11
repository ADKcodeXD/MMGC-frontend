<template>
  <div class="bg-black body">
    <Suspense>
      <NuxtLayout name="free">
        <div class="flex flex-col font-bold w-full max-w-2xl items-center" style="min-height: 92vh">
          <p class="italic text-xl title">{{ $t('statisticsTitle') }}</p>
          <template v-if="!pageParams.keyword">
            <div
              @click="showType = 'platinum'"
              class="pannel p-1 w-full bg-black text-light-200 flex items-center justify-center cursor-pointer"
            >
              {{ $t('platiumAuthor') }}
            </div>
            <Transition mode="out-in">
              <div class="author-container" v-if="showType === 'platinum'">
                <div class="author-item" v-for="item in platinumAuthors" :key="item._id">
                  <div class="w-18 h-18 rounded-full overflow-hidden avatar">
                    <MyCustomImage :img="item.authorAvatar || ''" />
                  </div>
                  <p>{{ item.authorName }}</p>
                </div>
              </div>
            </Transition>

            <div
              @click="showType = 'gold'"
              class="pannel p-1 my-2 w-full bg-black text-light-200 flex items-center justify-center cursor-pointer"
            >
              {{ $t('goldAuthor') }}
            </div>

            <Transition mode="out-in">
              <div class="author-container" v-if="showType === 'gold'">
                <div class="author-item" v-for="item in goldAuthors" :key="item._id">
                  <div class="w-18 h-18 rounded-full overflow-hidden avatar">
                    <MyCustomImage :img="item.authorAvatar || ''" />
                  </div>
                  <p>{{ item.authorName }}</p>
                </div>
              </div>
            </Transition>
          </template>

          <div class="flex justify-between w-full my-2 items-center">
            <p class="text-left tip text-light-50 font-thin" v-if="!pageParams.keyword">
              截至目前已有 {{ total }} 人参加过MMGC
            </p>
            <p class="text-left tip text-light-50 font-thin" v-else>搜索到 {{ total }} 条结果</p>
            <el-input
              v-model="pageParams.keyword"
              style="width: 240px"
              class="justify-end self-end"
              placeholder="搜索作者名"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
          </div>
          <el-row class="w-full row-head-container">
            <el-col :span="4">
              <p class="row-header">{{ $t('tupian') }}</p>
            </el-col>
            <el-col :span="4">
              <p class="row-header">{{ $t('author') }}</p>
            </el-col>
            <el-col :span="4">
              <div class="order">
                <p class="row-header">{{ $t('consecutiveParticipate') }}</p>
                <div class="flex flex-col ml-2">
                  <Icon
                    name="ant-design:up-circle-twotone"
                    class="text-light-50 cursor-pointer"
                    @click="changeFields('consecutiveParticipateTimes', 'reverse')"
                    :class="{
                      'text-yellow-600': isActive('consecutiveParticipateTimes', 'reverse')
                    }"
                  ></Icon>
                  <Icon
                    name="ant-design:down-circle-twotone"
                    class="text-light-50 cursor-pointer"
                    @click="changeFields('consecutiveParticipateTimes', '')"
                    :class="{
                      'text-yellow-600': isActive('consecutiveParticipateTimes', '')
                    }"
                  ></Icon>
                </div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="order">
                <p class="row-header">{{ $t('participateTimes') }}</p>
                <div class="flex flex-col ml-2">
                  <Icon
                    name="ant-design:up-circle-twotone"
                    class="text-light-50 cursor-pointer"
                    @click="changeFields('participateTimes', 'reverse')"
                    :class="{
                      'text-yellow-600': isActive('participateTimes', 'reverse')
                    }"
                  ></Icon>
                  <Icon
                    name="ant-design:down-circle-twotone"
                    class="text-light-50 cursor-pointer"
                    @click="changeFields('participateTimes', '')"
                    :class="{
                      'text-yellow-600': isActive('participateTimes', '')
                    }"
                  ></Icon>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <p class="row-header">{{ $t('matches') }}</p>
            </el-col>
          </el-row>

          <div class="container" v-if="rankList.length > 0">
            <el-row class="w-full row-items-container" v-for="item in rankList" :key="item._id">
              <el-col :span="4">
                <div class="h-18">
                  <MyCustomImage :img="item.authorAvatar || ''" />
                </div>
              </el-col>
              <el-col :span="4">
                <p>{{ item.authorName }}</p>
              </el-col>
              <el-col :span="4">
                <p>{{ item.consecutiveParticipateTimes }}</p>
              </el-col>
              <el-col :span="4">
                <p>{{ item.participateTimes }}</p>
              </el-col>
              <el-col :span="8">
                <div class="flex flex-wrap items-center justify-center">
                  <p v-for="match in item.participateMacthes" class="mr-2 mb-2">{{ match }}</p>
                </div>
              </el-col>
            </el-row>
            <MyCustomLoading v-if="isLoading" />
          </div>

          <div class="container" v-else-if="isLoading">
            <MyCustomLoading />
          </div>

          <div class="h-48" v-else>
            <MyCustomImage :img="Image404" />
          </div>

          <p class="tip text-light-500 text-xs my-2">
            {{ $t('verifyAndTip') }}
          </p>
        </div>
      </NuxtLayout>
      <template #fallback>
        <LoadingPage2 />
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import Image404 from '@/assets/img/NotFound.png'
import { Search } from '@element-plus/icons-vue'

const {
  rankList,
  total,
  showType,
  isLoading,
  pageParams,
  goldAuthors,
  platinumAuthors,
  isActive,
  changeFields
} = useStatistics()
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(@/assets/img/bg.png);
  background-size: cover;
  filter: brightness(0.8);
  min-width: 320px;
}
.pannel {
  border: $themeColor 1px solid;
  border-radius: 1px;
}

.row-head-container {
  background: rgb(6, 6, 6);
  padding: 2px;
  height: 40px;
  align-items: center;
}

.row-header {
  color: $themeColor;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
}

.order {
  display: flex;
  align-items: center;
}

.author-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  padding-top: 4px;

  .author-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: $themeColor;
  }
}

.avatar {
  border: 2px $themeColor solid;
}

.container {
  background: linear-gradient(to bottom, #8a7648, black);
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  min-height: 280px;
  border: solid 1px $themeColor;
}

.row-items-container {
  color: $themeColor;
  background-color: black;
  border: solid 1px $themeColor;
  margin: 4px 0;
  display: flex;
  align-items: center;
  text-align: center;
}
</style>
