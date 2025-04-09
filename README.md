# Vercel API Proxy

API proxies powered by Vercel.

## Domains

- `cell-api.vercel.app` - Vercel
- `api.lruihao.cn` - Custom Domain

## Usages

Go to the [Vercel API Proxy](https://cell-api.vercel.app) and select the API you want to use.

- `/avatar/:email` - Gravatar API, same as [Lruihao/vercel-gravatar](https://github.com/Lruihao/vercel-gravatar).

## Examples

Get the avatar of the email `fee47a2f4f2cc71f99a02b0a73ecfee0`:

```http
GET /avatar/fee47a2f4f2cc71f99a02b0a73ecfee0 HTTP/1.1
Host: cell-api.vercel.app
```
