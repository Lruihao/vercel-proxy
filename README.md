# API Proxy

API Proxy powered by Vercel.

## Domains

- `cell-api.vercel.app` - Vercel
- `api.lruihao.cn` - Custom Domain

## Usage

Go to the [API Proxy](https://cell-api.vercel.app/) and use the following endpoints:

- `/avatar/:email` - Gravatar API, same as [Lruihao/vercel-gravatar](https://github.com/Lruihao/vercel-gravatar).

## Example

Get the avatar of the email `fee47a2f4f2cc71f99a02b0a73ecfee0`:

```http
GET /avatar/fee47a2f4f2cc71f99a02b0a73ecfee0 HTTP/1.1
Host: cell-api.vercel.app
```
