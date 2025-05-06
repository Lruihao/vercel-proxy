// autocorrect-disable
import { getRandomItem } from '../../utils/index.js'

export interface 歌曲 {
  id: number
  name: string
  url: string
  artist: string
  picUrl: string
}

export interface 评论 {
  content: string
  likedCount: number
  time: number
  timeStr: string
  user: {
    nickname: string
    avatarUrl: string
  }
}

export class 网易热评 {
  public 歌单ID: string
  private readonly 默认歌单: number[] = [
    // LRH
    2280569152,
    // 原创榜
    2884035,
    // 热歌榜
    3778678,
    // 新歌榜
    3779629,
    // 飙升榜
    19723756,
    // 云音乐国风榜
    5059642708,
    // 云音乐民谣榜
    5059661515,
  ]

  protected header = new Headers({
    'Host': 'music.163.com',
    'Origin': 'http://music.163.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://music.163.com/search/',
  })

  constructor(歌单ID?: string) {
    this.歌单ID = 歌单ID || getRandomItem(this.默认歌单)
  }

  /**
   * 解析歌单，获取歌单中的所有歌曲 ID
   * @returns {Promise<number[]>} 歌曲 ID 数组
   */
  public async 解析歌单(): Promise<number[]> {
    const api = 'http://music.163.com/api/v6/playlist/detail'
    const postData = new URLSearchParams({
      id: this.歌单ID,
      s: '100',
      n: '100',
      t: '100',
    })
    const options = {
      method: 'POST',
      headers: this.header,
      body: postData,
    }
    return fetch(api, options)
      .then(res => res.json())
      .then((data) => {
        if (data?.playlist?.trackIds) {
          return data.playlist.trackIds.map((item: { id: number }) => item.id)
        }
        return []
      })
      .catch((err) => {
        console.error('Error fetching playlist:', err)
        return []
      })
  }

  /**
   * 解析歌曲，获取歌曲信息
   * @param {number} id 歌曲 ID
   * @returns {Promise<歌曲|null>} 歌曲信息
   */
  public async 解析歌曲(id: number): Promise<歌曲 | null> {
    const api = `http://music.163.com/api/song/detail/?id=${id}&ids=[${id}]&csrf_token=`
    const options = {
      method: 'GET',
    }
    return fetch(api, options)
      .then(res => res.json())
      .then((data) => {
        if (data?.songs?.length) {
          const song = data.songs[0]
          return {
            id,
            name: song.name,
            url: `http://music.163.com/song/media/outer/url?id=${id}`,
            artist: song.artists[0]?.name || '',
            picUrl: song.album?.picUrl || '',
          }
        }
        return null
      })
      .catch((err) => {
        console.error('Error fetching song:', err)
        return null
      })
  }

  /**
   * 解析热评，获取热评内容
   * @param {number} id 歌曲 ID
   * @returns {Promise<评论[]>} 热评内容数组
   */
  public async 解析热评(id: number): Promise<评论[]> {
    // offset 仅对 data.comments 生效
    const api = `http://music.163.com/api/v1/resource/comments/R_SO_4_${id}?limit=20&offset=0`
    const options = {
      method: 'GET',
      headers: this.header,
    }
    return fetch(api, options)
      .then(res => res.json())
      .then((data) => {
        return data?.hotComments || []
      })
      .catch((err) => {
        console.error('Error fetching hot comments:', err)
        return []
      })
  }
}
