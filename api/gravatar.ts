import { fetchAndApply } from '../utils.js'

// www.gravatar.com
const upstream = 'gravatar.loli.net'

const allowedReferrers: string[] = [
  'lruihao.cn',
  'github.com',
  'gravatar-x.vercel.app',
  '-lrh-dev.vercel.app',
  '-cell-x.vercel.app',
  'localhost',
]

export const config = {
  runtime: 'experimental-edge',
}

export default async function (request: Request): Promise<Response> {
  return await fetchAndApply(request, upstream, allowedReferrers)
}
