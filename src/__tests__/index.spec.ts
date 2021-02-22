import fs from 'fs'
import resolveLayoutShiftPlugin from '../'
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'

describe('index.ts', () => {
  describe("type: 'ratio'", () => {
    test('変換後の <img> タグに対して width/height 属性が正しく付与されているか', () => {
      async function process(rawMarkdown: string) {
        return new Promise((resolve, reject) => {
          unified()
            .use(markdown)
            .use(remark2rehype)
            .use(resolveLayoutShiftPlugin)
            .use(html)
            .process(rawMarkdown, (err, file) => {
              if (err) {
                return reject(err)
              }
              return resolve(file.toString())
            })
        })
      }

      const content = fs.readFileSync(`${__dirname}/fixtures/content.md`, {
        encoding: 'utf-8'
      })
      const correct = fs.readFileSync(
        `${__dirname}/fixtures/correct.ratio.html`,
        {
          encoding: 'utf-8'
        }
      )
      return process(content).then((result) => {
        expect(result + '\n').toBe(correct)
      })
    })
  })

  describe("type: 'maxWidth'", () => {
    test('変換後の <img> タグに対して width/height 属性が正しく付与されているか', () => {
      async function process(rawMarkdown: string) {
        return new Promise((resolve, reject) => {
          unified()
            .use(markdown)
            .use(remark2rehype)
            .use(resolveLayoutShiftPlugin, { maxWidth: 800, type: 'maxWidth' })
            .use(html)
            .process(rawMarkdown, (err, file) => {
              if (err) {
                return reject(err)
              }
              return resolve(file.toString())
            })
        })
      }

      const content = fs.readFileSync(`${__dirname}/fixtures/content.md`, {
        encoding: 'utf-8'
      })
      const correct = fs.readFileSync(
        `${__dirname}/fixtures/correct.maxWidth.html`,
        {
          encoding: 'utf-8'
        }
      )
      return process(content).then((result) => {
        expect(result + '\n').toBe(correct)
      })
    })
  })
})
