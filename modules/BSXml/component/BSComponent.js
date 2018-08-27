import Renderer from '../template/Renderer.js'
import Parser from '../template/Parser.js'
import BSEvent from '../../BSEvent.js'

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
    const domRoot = this.renderer.render()
    Object.entries(this.need).forEach(([component, prototype]) => {
      new Array().forEach.call(domRoot.querySelectorAll(`BSXml-Component[component=${component}]`), mark => {
        const name = mark.getAttribute('name')
        if (!this.components[name]) {
          this.components[name] = new prototype()
        }
        this.components[name].parent = this
        this.components[name].context = this.context
        this.components[name].paint(mark, 'replace')
      })
    })
    this.afterRender()
    return domRoot
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
  
  paint(target, type = 'replace') {
    this.beforePaint()
    this.render().paint(target, type)
    this.afterPaint()
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
}