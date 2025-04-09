# [Vercel API Proxy](https://github.com/Lruihao/vercel-proxy)

API proxies powered by Vercel.

## Domains

- <https://api.lruihao.cn>
- <https://cell-api.vercel.app>

## Usages

Go to the [Vercel API Proxy](https://cell-api.vercel.app) and select the API you want to use.

- `/gravatar/avatar/(.*)` - Gravatar API.

## Examples

> Get the avatar of the email `fee47a2f4f2cc71f99a02b0a73ecfee0` by Gravatar API.

```http
GET /gravatar/avatar/fee47a2f4f2cc71f99a02b0a73ecfee0 HTTP/1.1
Host: cell-api.vercel.app
```

![Lruihao](https://cell-api.vercel.app/gravatar/avatar/fee47a2f4f2cc71f99a02b0a73ecfee0)
