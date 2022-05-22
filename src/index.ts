import { Processor, Transformer } from 'unified'
import { Node } from 'unist'
import { visit } from 'unist-util-visit'
import hast from 'hast'
import axios from 'axios'
import Jimp from 'jimp'

type Type = 'ratio' | 'maxWidth'

export type ResolveLayoutShiftPluginOptions = {
  type?: Type
  ratio?: number
  maxWidth?: number
}

function resolveLayoutShiftPlugin(
  this: Processor,
  options?: ResolveLayoutShiftPluginOptions
): Transformer {
  const type: Type = (options && options.type) || 'ratio'
  const ratio = (options && options.ratio) || 0.5
  const maxWidth = (options && options.maxWidth) || 0

  async function visitor(el: hast.Element) {
    if (el.tagName !== 'img') {
      return
    }
    const { properties } = el
    if (!properties) {
      return
    }
    const { src } = properties
    if (!(src && `${src}`.startsWith('http'))) {
      return
    }
    const response = await axios.get(`${src}`, {
      responseType: 'arraybuffer'
    })
    const image = await Jimp.read(Buffer.from(response.data, 'binary'))
    const size = {
      width: image.bitmap.width,
      height: image.bitmap.height
    }
    switch (type) {
      case 'ratio': {
        size.height = ~~(size.height * ratio)
        size.width = ~~(size.width * ratio)
        break
      }
      case 'maxWidth': {
        if (size.width > maxWidth) {
          size.height = ~~(size.height * (maxWidth / size.width))
          size.width = ~~(size.width * (maxWidth / size.width))
        }
        break
      }
    }
    el.properties = {
      ...size,
      ...(el.properties || {})
    }
  }

  async function transformer(htmlAST: Node): Promise<Node> {
    const matches: hast.Element[] = []
    visit(htmlAST, 'element', (el: hast.Element) => {
      matches.push(el)
    })
    await Promise.all(matches.map((el) => visitor(el)))
    return htmlAST
  }

  return transformer
}

export default resolveLayoutShiftPlugin
module.exports = resolveLayoutShiftPlugin
