/**
 * Browser-Slim-XML
 * @BlueSky
 *
 * Version Alpha, 3.5
 *
 * Last updated: 2018/8/29
 *
 */

import Renderer from './template/Renderer.js'
import Parser from './template/Parser.js'
import BSEvent from '../BSEvent.js'
import BSElement from './template/BSElement.js'
import uuid from '../libs/uuid.js'

export default class BSComponent {
  constructor() {
    this.template = ''
    this.style = ''
    this.dataset = {}
    this.functions = {}
    this.need = {}
    this.listen = {}
    this.inputs = {}
    
    this.components = {}
    this.parent = null
    this.emitter = new BSEvent(new Date().getTime())
    this.context = {}
    
    this.renderer = null
    this.hash = uuid()
    this.el = null
    this.$el = null
    this.$$el = null
  }
  
  init() {
    if (this.renderer) {
      return
    }
    
    if (typeof this.template !== 'string') {
      throw new Error('template must be a string')
    }
    if (typeof this.style !== 'string') {
      throw new Error('style must be a string')
    }
    if (typeof this.dataset !== 'object') {
      throw new Error('dataset must be an object')
    }
    if (typeof this.functions !== 'object') {
      throw new Error('functions must be an object')
    }
    if (typeof this.need !== 'object') {
      throw new Error('need must be an object')
    }
    if (typeof this.listen !== 'object') {
      throw new Error('listen must be an object')
    }
    
    this.renderer = new Renderer(new Parser(this.template), {
      dataset: this.dataset, functions: this.functions
    })
    this.renderer.component = this
    this.inputs = this.renderer.inputs
    
    Object.defineProperty(this, 'template', {
      configurable: false,
      get() {
        return this.renderer.parser.template
      },
      set(template) {
        this.renderer.parser.template = template
      }
    })
    
    this.styleBlock = BSElement.createStyleBlock(this.style)
    this.blockMark = BSElement.createComponentBlockMark(this.hash)
    
    Object.entries(this.listen).forEach(([signal, callback]) => {
      if (signal.startsWith('_')) {
        this.emitter.once(signal.slice(1), callback)
      } else {
        this.emitter.on(signal, callback)
      }
    })
  }
  
  read(dataset) {
    this.init()
    Object.entries(dataset).forEach(([key, value]) => {
      this.dataset[key] = value
    })
    return this
  }
  
  plug(components = {}) {
    this.init()
    Object.entries(components).forEach(([name, component]) => {
      this.components[name] = component
      this.components[name].parent = this
    })
    return this
  }
  
  render() {
    this.init()
    const fragment = document.createDocumentFragment()
    return Promise.resolve()
        .then(async () => {
          return await this.beforeRender()
        })
        .then(() => {
          fragment.appendChild(this.blockMark.compile())
          fragment.appendChild(this.renderer.render())
          fragment.appendChild(this.styleBlock.compile())
          fragment.appendChild(this.blockMark.compile())
          return fragment
        })
        .then(fragment => {
          const promises = []
          Object.entries(this.need).forEach(([component, prototype]) => {
            promises.push(... new Array().map.call(fragment.querySelectorAll(`BSXml-Component[component='${component}']`), mark => {
              const name = mark.getAttribute('name')
              if (!this.components[name]) {
                const args = mark.getAttribute('args')
                if (mark.getAttribute('args')) {
                  this.components[name] = new prototype(...args.split(' '))
                } else {
                  this.components[name] = new prototype()
                }
              }
              this.components[name].parent = this
              this.components[name].context = this.context
              return this.components[name].paint(mark, 'replace', fragment)
            }))
          })
          return Promise.all(promises)
        })
        .then(async () => {
          return await this.afterRender()
        })
        .then(() => {
          return fragment
        })
        .catch(e => {
          throw e
        })
  }
  
  paint(target, type = 'replace', document = window.document) {
    return Promise.resolve()
        .then(async () => {
          return await this.beforePaint()
        })
        .then(async () => {
          return await this.render()
        })
        .then(fragment => {
          fragment.paint(target, type)
          this.el = document.querySelector(`bsxc[hash='${this.hash}']`).nextElementSibling
          this.$el = this.el.querySelector.bind(this.el)
          this.$$el = this.el.querySelectorAll.bind(this.el)
          return 'OK'
        })
        .then(async () => {
          return await this.afterPaint()
        })
        .catch(e => {
          throw e
        })
  }
  
  refresh() {
    return Promise.resolve()
        .then(async () => {
          return await this.beforeRefresh()
        })
        .then(() => {
          const start = document.querySelector(`bsxc[hash='${this.hash}']`)
          let next = start.nextSibling
          while (next.tagName !== 'BSXC' || !(next instanceof HTMLElement) || next.getAttribute('hash') !== this.hash) {
            next.remove()
            next = start.nextSibling
          }
          next.remove()
          this.paint(start, 'replace')
          return 'OK'
        })
        .then(async () => {
          return await this.afterRefresh()
        })
        .catch(e => {
          throw e
        })
  }
  
  notify(signal = '') {
    if (this.parent) {
      this.parent.signal(signal)
    }
  }
  
  signal(signal = '') {
    if (typeof signal === 'string') {
      this.emitter.emit(signal)
    } else if (signal.signal) {
      this.emitter.emit(signal.signal, signal)
    }
  }
  
  needComponent(component, name, ...args) {
    this.components[name] = new this.need[component](...args)
    this.components[name].parent = this
    this.components[name].context = this.context
    return this.components[name]
  }
  
  // hooks:
  
  async beforeRender() {
  }
  
  async afterRender() {
  }
  
  async beforePaint() {
  }
  
  async afterPaint() {
  }
  
  async beforeRefresh() {
  }
  
  async afterRefresh() {
  }
}