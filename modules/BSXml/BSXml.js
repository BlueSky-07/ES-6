/**
 * Browser-Slim-XML
 * @BlueSky
 *
 * Version Alpha, 3.1
 *
 * Last updated: 2018/8/24
 *
 */

import BSXmlCore from './core/core.js'
import TemplateLoader from './loader/TemplateLoader.js'
import DataLoader from './loader/DataLoader.js'

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
              await TemplateLoader.load(realTemplateNode)
              
              // fetch dataset
              let realDataset = await DataLoader.load(realTemplateNode) || {}
              
              BSXmlCore.run(realTemplateNode.innerHTML, realTemplateNode, {
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