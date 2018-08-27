/**
 * Browser-Slim-XML
 * @BlueSky
 *
 * Version Alpha, 3.3
 *
 * Last updated: 2018/8/27
 *
 */

import Renderer from './template/Renderer.js'
import Parser from './template/Parser.js'
import BSEvent from '../BSEvent.js'
import BSElement from './template/BSElement.js'
import BSUnique from '../BSUnique.js'

export default class BSComponent {
  constructor() {
    this.template = ''
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
    this.hash = BSUnique.getToken()
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
    this.beforeRender()
    const fragement = document.createDocumentFragment()
    fragement.appendChild(BSElement.createComponentBlockMark(this.hash).compile())
    fragement.appendChild(this.renderer.render())
    fragement.appendChild(BSElement.createComponentBlockMark(this.hash).compile())
    Object.entries(this.need).forEach(([component, prototype]) => {
      new Array().forEach.call(fragement.querySelectorAll(`BSXml-Component[component='${component}']`), mark => {
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
        this.components[name].paint(mark, 'replace', fragement)
      })
    })
    this.afterRender()
    return fragement
  }
  
  paint(target, type = 'replace', document = window.document) {
    this.beforePaint()
    this.render().paint(target, type)
    this.el = document.querySelector(`bsxc[hash='${this.hash}']`).nextElementSibling
    this.$el = this.el.querySelector.bind(this.el)
    this.$$el = this.el.querySelectorAll.bind(this.el)
    this.afterPaint()
  }
  
  refresh() {
    this.beforeRefresh()
    const start = document.querySelector(`bsxc[hash='${this.hash}']`)
    let next = start.nextSibling
    while (next.tagName !== 'BSXC' || !(next instanceof HTMLElement) || next.getAttribute('hash') !== this.hash) {
      next.remove()
      next = start.nextSibling
    }
    next.remove()
    this.paint(start, 'replace')
    this.afterRefresh()
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
  
  beforeRender() {
  }
  
  afterRender() {
  }
  
  beforePaint() {
  }
  
  afterPaint() {
  }
  
  beforeRefresh() {
  }
  
  afterRefresh() {
  }
}