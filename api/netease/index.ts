// autocorrect-disable
import type { 歌曲, 评论 } from './api.js'
import {
  getRandomItem,
  responseJSON,
  responseText,
} from '../../utils/index.js'
import { 网易热评 } from './api.js'

interface 评论响应 {
  code: 0 | 1
  data?: {
    musicId: number
    musicName: string
    musicUrl: string
    artist: string
    picUrl: string
    content: string
    nickname: string
    avatarUrl: string
    likedCount: number
    time: number
    timeStr: string
  }
  message?: string
}

export const config = {
  runtime: 'experimental-edge',
}

export default async function (request: Request): Promise<Response> {
  const url = new URL(request.url)
  let mid = url.searchParams.get('mid') || ''
  let type = url.searchParams.get('type') || 'json'

  if (request.method === 'POST') {
    const formData = await request.formData()
    mid = formData.get('mid') as string || ''
    type = formData.get('type') as string || 'json'
  }
  const 网易云 = new 网易热评(mid)
  const 歌曲列表 = await 网易云.解析歌单()
  const 歌曲: 歌曲 | null = await 网易云.解析歌曲(getRandomItem(歌曲列表))
  if (!歌曲) {
    const 失败响应: 评论响应 = {
      code: 0,
      message: '热门评论获取失败！',
    }
    return responseJSON(失败响应)
  }
  const 热评: 评论[] = await 网易云.解析热评(歌曲.id)
  const 随机热评: 评论 = getRandomItem(热评)
  if (type === 'text') {
    return responseText(`${随机热评.content}\n  ——${随机热评.user.nickname || '匿名'}·《${歌曲.artist || '-'}·${歌曲.name || '-'}》`)
  }
  const 成功响应: 评论响应 = {
    code: 1,
    data: {
      musicId: 歌曲.id,
      musicName: 歌曲.name,
      musicUrl: 歌曲.url,
      artist: 歌曲.artist,
      picUrl: 歌曲.picUrl,
      content: 随机热评.content,
      nickname: 随机热评.user.nickname,
      avatarUrl: 随机热评.user.avatarUrl,
      likedCount: 随机热评.likedCount,
      time: 随机热评.time,
      timeStr: 随机热评.timeStr,
    },
  }
  return responseJSON(成功响应)
}
