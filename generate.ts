import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import markdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const readmePath = path.join(__dirname, './README.md')
const outputPath = path.join(__dirname, './public/index.html')
const readmeContent = fs.readFileSync(readmePath, 'utf-8')
const styleContent = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  summary {
    font-weight: bold;
  }
  .markdown-body {
    padding: 20px 10%;
    h1 {
      text-align: center;
    }
  }
`.replace(/\s+/g, ' ').trim()
let tocHtml = ''
const htmlContent = markdownIt()
  .use(anchor, {
    level: 2,
    permalink: anchor.permalink.ariaHidden({
      placement: 'before',
      symbol: '§',
    }),
  })
  .use(toc, {
    listType: 'ul',
    level: 2,
    callback: (t: string) => {
      tocHtml = t
    },
  })
  .render(readmeContent)
  .replace(tocHtml, `<details><summary>Table of Contents</summary>${tocHtml}</details>`)
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vercel API Proxy</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.css">
  <style>${styleContent}</style>
</head>
<body>
  <div class="markdown-body">${htmlContent}</div>
</body>
</html>
`.replace(/>\s+</g, '><') // Remove whitespace between tags

if (!fs.existsSync(path.join(__dirname, './public'))) {
  fs.mkdirSync(path.join(__dirname, './public'))
}
fs.writeFileSync(outputPath, htmlTemplate, 'utf-8')
