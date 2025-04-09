import { requestProxy } from '../utils.js'

const upstream = 'www.google.com'

export const config = {
  runtime: 'experimental-edge',
}

export default async function (request: Request): Promise<Response> {
  return await requestProxy(request, upstream, 'google')
}
