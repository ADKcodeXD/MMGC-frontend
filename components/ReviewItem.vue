<template>
  <div class="review-item mb-2">
    <div class="review-content mr-1 flex-1">
      <p>{{ comment?.content }}</p>
      <div class="triangle"></div>
      <div class="info">
        <p class="publish-time">发布于:{{ comment.createTime }}</p>
        <el-popconfirm
          :title="$t('confirmDelete')"
          @confirm="deleteMyComment"
          v-if="userInfo && userInfo.memberId === comment.memberVo?.memberId"
        >
          <template #reference>
            <ElButton type="danger" link size="small">{{ $t('delete') }}</ElButton>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="flex-shrink-0 translate-y-4">
      <MemberPop :member-vo="comment.memberVo" v-if="comment.memberVo" :size="28" />
      <MemberPop v-else :size="28" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentVo } from 'Comment'
import type { MovieVo } from 'Movie'
import { useUserStore } from '~~/stores/user'
import { deleteComment } from '~~/composables/apis/comment'

const { userInfo } = useUserStore()
const props = defineProps<{
  comment: CommentVo
  movieDetail: MovieVo
  isChildren?: boolean
  level: number
  topPrarentId: number
}>()
const emits = defineEmits(['refresh', 'sentReply'])

const { t } = useI18n()

const deleteMyComment = async () => {
  await deleteComment(props.comment.commentId)
  ElMessage.success(t('deleteSuccess'))
  emits('refresh')
}
</script>

<style lang="scss" scoped>
.review-item {
  display: flex;
  align-items: flex-end;
  .review-content {
    border-radius: 12px;
    background-color: white;
    padding: 8px;
    position: relative;
    color: black;
    .info {
      font-size: 10px;
      margin-top: 1rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      .publish-time {
        color: #726d6d;
      }
    }
    .triangle {
      position: absolute;
      bottom: -2px;
      right: 3px;
      color: white;
      width: 10px;
      height: 10px;
      background-color: white;
      clip-path: polygon(17% 0, 45% 0, 62% 0, 83% 55%, 100% 100%, 46% 78%, 10% 71%, 0 38%, 0 0);
    }
  }
}
</style>
