<template>
  <div class="font-bold w-full h-full overflow-auto p-2" ref="body" id="freeBody">
    <var-style-provider :style-vars="styleVars">
      <p class="italic text-xl text-light-300 flex-shrink-0 text-center statistics-title">
        {{ $t('statisticsTitle') }}
      </p>
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

      <div class="flex flex-col justify-between w-full my-2">
        <p class="text-left tip text-light-50 font-thin" v-if="!pageParams.keyword">
          截至目前已有 {{ total }} 人参加过MMGC
        </p>
        <p class="text-left tip text-light-50 font-thin" v-else>搜索到 {{ total }} 条结果</p>
        <var-input v-model="pageParams.keyword" class="w-full" placeholder="搜索作者名">
          <template #prepend-icon>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </var-input>
      </div>

      <var-table full-width="170%" :elevation="false">
        <thead>
          <tr>
            <th>{{ $t('tupian') }}</th>
            <th>{{ $t('author') }}</th>
            <th class="w-28">
              <div class="flex items-center">
                {{ $t('consecutiveParticipate') }}
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
            </th>
            <th class="w-28">
              <div class="flex items-center">
                {{ $t('participateTimes') }}
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
            </th>
            <th>{{ $t('matches') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in rankList" :key="l._id">
            <td>
              <MyCustomImage :img="l.authorAvatar" />
            </td>
            <td>{{ l.authorName }}</td>
            <td>{{ l.consecutiveParticipateTimes }}</td>
            <td>{{ l.participateTimes }}</td>
            <td>
              <div class="flex flex-wrap gap-2 max-w-64">
                <p v-for="(match, index) in l.participateMacthes" :key="index">{{ match }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </var-table>

      <p class="tip text-light-500 text-xs my-2">
        {{ $t('verifyAndTip') }}
      </p>
    </var-style-provider>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const styleVars = ref({
  '--table-background': '#2a2a2a',
  '--table-tbody-td-text-color': '#fff',
  '--table-thead-th-text-color': '#fff',
  '--table-tbody-tr-hover-background': '#3b3b3b'
})

const {
  rankList,
  total,
  showType,
  pageParams,
  goldAuthors,
  platinumAuthors,
  isActive,
  changeFields
} = useStatistics()
</script>

<style lang="scss" scoped>
.statistics-title {
  color: $themeColor;
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
