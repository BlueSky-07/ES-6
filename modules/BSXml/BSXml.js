/**
 * Browser-Slim-XML
 * @BlueSky
 *
 * Version Alpha, 3.6
 *
 * Last updated: 2018/11/7
 *
 */

import Parser from './template/Parser.js'
import Renderer from './template/Renderer.js'
import BSFetch from '../BSFetch.js'

export default class BSXml {
  static start(
      templateNodes = [], {
        dataset = {},
        functions = {},
        init = new Function(),
        next = new Function()
      } = {}) {
    
    if (init instanceof Function) {
      init()
    } else {
      throw new Error('init should be a function')
    }
    
    if (!(next instanceof Function)) {
      throw new Error('next should be a function')
    }
    
    if (!Array.isArray(templateNodes)) {
      throw new Error('templateNodes should be an array')
    } else {
      let NEXT = () => {
        // user's next function
        next()
      }
      
      // generate NEXT.next() function
      // real next() will be called after all templateNodes have been showRendered
      for (let i = 0; i < templateNodes.length; i++) {
        NEXT = {
          NEXT,
          next() {
            if (this.NEXT.NEXT) {
              this.NEXT = this.NEXT.NEXT
            } else {
              this.NEXT()
            }
          }
        }
      }
      
      new Array().forEach.call(
          templateNodes,
          async templateNode => {
            if (templateNode) {
              let realTemplateNode = null
              
              // detect templateNode is string (name of BSX) or HTMLElement (node of BSX)
              if (templateNode instanceof HTMLElement) {
                if (templateNode.tagName === 'BSX') {
                  realTemplateNode = templateNode
                } else {
                  throw new Error(`found a node whose tagName is not BSX`)
                }
              } else {
                try {
                  realTemplateNode = document.querySelector(`BSX[name=${templateNode.trim()}]`)
                } catch (e) {
                }
                if (realTemplateNode === null) {
                  throw new Error(`cannot find a node named ${templateNode}`)
                }
              }
              
              // fetch template (.bsx file)
              await TmplLoader.load(realTemplateNode)
              
              // fetch dataset
              let realDataset = await DataLoader.load(realTemplateNode) || {}
              
              run(realTemplateNode.innerHTML, realTemplateNode, {
                dataset: Object.assign(
                    realDataset,
                    dataset
                ),
                functions,
                next: () => {
                  NEXT.next()
                }
              })
            }
          })
    }
  }
}

const run = (
    template, target, {
      dataset = {},
      functions = {},
      init = new Function(),
      next = new Function()
    } = {}) => {
  
  const parser = new Parser(template)
  const renderer = new Renderer(parser, {
    dataset, functions
  })
  init()
  renderer.render().paint(target)
  next()
}

class TmplLoader {
  static async load(realTemplateNode) {
    if (realTemplateNode.getAttribute('link') && !realTemplateNode.getAttribute('ignore-link')) {
      const link = realTemplateNode.getAttribute('link').trim()
      await BSFetch.get(link, {
        restype: 'text'
      }).then(text => {
        realTemplateNode.innerHTML = text
      }).catch(() => {
        throw new Error(`cannot fetch template from ${link}`)
      })
      realTemplateNode.setAttribute('ignore-link', 'true')
    }
  }
}

class DataLoader {
  static async load(realTemplateNode) {
    if (realTemplateNode.getAttribute('data')) {
      const data = realTemplateNode.getAttribute('data').trim()
      try {
        return await BSFetch.get(data)
      } catch (e) {
        throw new Error(`cannot fetch dataset from ${data}`)
      }
    }
  }
}