<template>
  <div
    class="comment-item"
    :class="{ 'children-item': isChildren }"
    :style="{ marginLeft: `${(level - 1) * 6}px` }"
  >
    <div class="flex justify-between items-end flex-wrap">
      <div class="flex flex-shrink-0 break-all max-w-4/5" :class="{ 'h-8': isChildren }">
        <div class="flex-shrink-0">
          <MemberPop
            :member-vo="comment.memberVo"
            v-if="comment.memberVo && !isChildren"
            :size="36"
          />
        </div>

        <div class="w-full">
          <p class="flex items-end">
            {{ comment.memberVo?.memberName }}
            <span class="sub-title ml-2" v-if="comment.memberVo?.username"
              >@{{ comment.memberVo?.username }}</span
            >
            <span
              class="ml-2 text-xs self-center bg-pink-600 px-2 rounded-lg"
              v-if="userInfo && userInfo.memberId === comment.memberVo?.memberId"
            >
              {{ $t('yourself') }}
            </span>
            <span
              class="ml-2 text-xs self-center bg-green-600 px-2 rounded-lg"
              v-if="
                movieDetail.author?.memberId &&
                comment.memberVo?.memberId === movieDetail.author?.memberId
              "
            >
              {{ $t('author') }}
            </span>
          </p>
          <p class="break-all text-light-900 text-xs" v-if="!isChildren">
            {{ comment.memberVo?.desc }}
          </p>
          <p class="sub-title flex-shrink-0" v-else>{{ comment.createTime }}</p>
        </div>
      </div>
      <div class="flex flex-col items-end flex-shrink-0">
        <el-popconfirm :title="$t('confirmDelete')" @confirm="deleteMyComment">
          <template #reference>
            <ElButton
              type="danger"
              size="small"
              class="mb-2"
              v-if="userInfo && userInfo.memberId === comment.memberVo?.memberId"
              >{{ $t('deleteComment') }}</ElButton
            >
          </template>
        </el-popconfirm>
        <p class="sub-title" v-if="!isChildren">{{ $t('sentIn', [comment.createTime]) }}</p>
      </div>
    </div>
    <ElDivider class="divider" />
    <div class="flex-1">
      <p>
        <span v-if="comment.toMemberVo" class="text-xs text-blue-300 font-bold"
          >{{ $t('replyTo', [comment.toMemberVo.memberName]) }} :</span
        >{{ comment.content }}
      </p>
    </div>
    <ElButton
      type="primary"
      class="w-12 self-end h-4"
      @click="showReply = !showReply"
      size="small"
      >{{ $t('reply') }}</ElButton
    >
    <div class="flex flex-col mt-2" v-if="showReply">
      <ElInput
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
        show-word-limit
        maxlength="512"
        :placeholder="$t('sentCommentin')"
        v-model="replyComment"
      />
      <ElButton
        type="primary"
        class="self-end mt-2"
        size="small"
        :disabled="!userInfo?.memberId || !replyComment || replyComment.length > 512"
        @click="sentReply"
        >{{ $t('sendComment') }}</ElButton
      >
    </div>
    <div class="children" v-if="comment.children && children.length > 0">
      <CommentItem
        v-for="child in comment.children"
        :key="child.commentId"
        :isChildren="true"
        :comment="child"
        :movie-detail="movieDetail"
        :topPrarentId="topPrarentId"
        :level="level + 1"
        @refresh="emits('refresh')"
        @sentReply="emits('sentReply', $event)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CommentParams, CommentVo } from 'Comment'
import { MovieVo } from 'Movie'
import { useUserStore } from '~~/stores/user'
import { deleteComment, addComment } from '~~/composables/apis/comment'
import { children } from 'dom7'
const { userInfo } = useUserStore()
const props = defineProps<{
  comment: CommentVo
  movieDetail: MovieVo
  isChildren?: boolean
  level: number
  topPrarentId: number
}>()
const showReply = ref(false)
const replyComment = ref('')

const emits = defineEmits(['refresh', 'sentReply'])

const { t } = useI18n()

const deleteMyComment = async () => {
  await deleteComment(props.comment.commentId)
  ElMessage.success(t('deleteSuccess'))
  emits('refresh')
}

const sentReply = async () => {
  if (!userInfo || !userInfo?.memberId) {
    ElMessage.warning(t('loginFirst'))
    return
  }
  if (!replyComment.value || replyComment.value.trim().length === 0) {
    ElMessage.warning(t('commentContentEmpty'))
    return
  }
  const params: CommentParams = {
    content: replyComment.value,
    movieId: props.movieDetail.movieId,
    toMemberId: props.comment.memberVo?.memberId,
    parentId: props.level >= 2 ? props.topPrarentId : props.comment.commentId
  }
  await addComment(params)
  replyComment.value = ''
  showReply.value = false
  ElMessage.success(t('commentSuccess'))
  emits('sentReply', replyComment.value)
}
</script>
<style lang="scss" scoped>
.comment-item {
  min-height: 16rem;
  display: flex;
  flex-direction: column;
  padding: 5px;
  border: 1px solid $themeColor;
  margin: 5px 0;
  border-radius: 10px;
  background-color: $backgroundColor;
  color: $textColor;
  &.children-item {
    min-height: 10rem;
    margin-top: 20px;
    border: unset;
    border-top: 1px solid $themeColor;
  }
}
.divider {
  margin: 8px 0;
}
</style>
