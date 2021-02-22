# rehype-plugin-auto-resolve-layout-shift

![build](https://github.com/potato4d/rehype-plugin-auto-resolve-layout-shift/workflows/build/badge.svg) [![codecov](https://codecov.io/gh/potato4d/rehype-plugin-auto-resolve-layout-shift/branch/master/graph/badge.svg)](https://codecov.io/gh/potato4d/rehype-plugin-auto-resolve-layout-shift) ![Version](https://img.shields.io/npm/v/rehype-plugin-auto-resolve-layout-shift.svg?sanitize=true)

Flexible resolve layout-shift plugin for rehype.

> Caution:
>
> Optimization of this plugin takes some time, so it is recommended to do it only during production builds.

## Installation

```bash
$ yarn add rehype-plugin-auto-resolve-layout-shift # or npm install
```

## Usage

### 1. Strict width definition: Recommended

This is a way to specify width/height based on an exact value, taking into account the width of your application's container.

This is the most recommended option, although it requires some effort.

> Calculation Formula
>
> 1. width <= maxWidth: width=width,height=height
> 2. width > maxWidth: width = width * (maxWidth / width), height = height * (maxWidth / width)

1. Add width/height attribute to your markdown document

```javascript
import fs from 'fs'
import resolveLayoutShiftPlugin from 'rehype-plugin-auto-resolve-layout-shift'
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'

async function process(markdown: string) {
  return new Promise((resolve, reject) => {
    unified()
    .use(markdown)
    .use(remark2rehype)
    .use(resolveLayoutShiftPlugin, { type: 'maxWidth', maxWidth: '800' })
    .use(html)
    .process(markdown, (err, file) => {
      if (err) {
        return reject(err)
      }
      return resolve(file.toString())
    })
  })
}

async function run() {
  const input = `### test content

[![GitHub](https://github.githubassets.com/images/modules/site/social-cards/github-social.png)](https://github.com)
`
  const output = await process(input)
  console.log(output) // `<h3>test content</h3>\n<p><a href="https://github.com"><img width="800" height="420" src="https://github.githubassets.com/images/modules/site/social-cards/github-social.png" alt="GitHub"></a></p>`
}
```

2. Add width/height attribute to your HTML document

```javascript

import fs from 'fs'
import resolveLayoutShiftPlugin from 'rehype-plugin-auto-resolve-layout-shift'
import unified from 'unified'
import parse from 'rehype-parse'
import slug from 'rehype-slug'
import stringify from 'rehype-stringify'

async function process(html: string) {
  return new Promise((resolve, reject) => {
    unified()
    .use(parse)
    .use(slug)
    .use(resolveLayoutShiftPlugin)
    .use(stringify)
    .process(html, (err, file) => {
      if (err) {
        return reject(err)
      }
      return resolve(file.toString())
    })
  })
}

async function run() {
  const input = `<h1>test</h1>\n<img alt="GitHub" src="https://github.githubassets.com/images/modules/site/social-cards/github-social.png">`
  const output = await process(input)
  console.log(output) // `<h1>test</h1>\n<img width="800" height="420" src="https://github.githubassets.com/images/modules/site/social-cards/github-social.png" alt="GitHub">`
```

### 2. Simple Use (Add half-size width/height)

The default is to specify half the size for the img source.

This assumes a high-definition display such as Retina.

1. Add width/height attribute to your markdown document

```javascript
import fs from 'fs'
import resolveLayoutShiftPlugin from 'rehype-plugin-auto-resolve-layout-shift'
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'

async function process(markdown: string) {
  return new Promise((resolve, reject) => {
    unified()
    .use(markdown)
    .use(remark2rehype)
    .use(resolveLayoutShiftPlugin)
    .use(html)
    .process(markdown, (err, file) => {
      if (err) {
        return reject(err)
      }
      return resolve(file.toString())
    })
  })
}

async function run() {
  const input = `### test content

[![GitHub](https://github.githubassets.com/images/modules/site/social-cards/github-social.png)](https://github.com)
`
  const output = await process(input)
  console.log(output) // `<h3>test content</h3>\n<p><a href="https://github.com"><img width="600" height="315" src="https://github.githubassets.com/images/modules/site/social-cards/github-social.png" alt="GitHub"></a></p>`
}
```

2. Add width/height attribute to your HTML document

```javascript

import fs from 'fs'
import resolveLayoutShiftPlugin from 'rehype-plugin-auto-resolve-layout-shift'
import unified from 'unified'
import parse from 'rehype-parse'
import slug from 'rehype-slug'
import stringify from 'rehype-stringify'

async function process(html: string) {
  return new Promise((resolve, reject) => {
    unified()
    .use(parse)
    .use(slug)
    .use(resolveLayoutShiftPlugin)
    .use(stringify)
    .process(html, (err, file) => {
      if (err) {
        return reject(err)
      }
      return resolve(file.toString())
    })
  })
}

async function run() {
  const input = `<h1>test</h1>\n<img alt="GitHub" src="https://github.githubassets.com/images/modules/site/social-cards/github-social.png">`
  const output = await process(input)
  console.log(output) // `<h1>test</h1>\n<img width="600" height="315" src="https://github.githubassets.com/images/modules/site/social-cards/github-social.png" alt="GitHub">`
```

### Used with the Framework

#### `@nuxt/content`

in your nuxt.config.js

```javascript
const rehypePlugins = [
  // plugins config,
]

if (process.env.NODE_ENV === 'production') {
  rehypePlugins.push(
    ['rehype-plugin-auto-resolve-layout-shift', { maxWidth: 650 }]
  )
}

export default {
  // ...
  content: {
    markdown: {
      rehypePlugins
    }
  },
  // ...
}
```

For more information, see [official document](https://content.nuxtjs.org/configuration#markdownrehypeplugins).

## LICENCE

MIT
