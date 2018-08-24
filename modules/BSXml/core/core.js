import Parser from '../template/Parser.js'
import Renderer from '../template/Renderer.js'

export default class BSXmlCore {
  static run(
      template, target, {
        dataset = {},
        functions = {},
        init = new Function(),
        next = new Function()
      } = {}) {
    
    const parser = new Parser(template)
    const renderer = new Renderer(parser, {
      dataset, functions
    })
    init()
    renderer.render().paint(target)
    next()
  }
}

