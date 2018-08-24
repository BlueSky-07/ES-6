import Renderer from '../template/Renderer.js'
import Parser from '../template/Parser.js'
import BSEvent from '../../BSEvent.js'

export default class BSComponent {
  constructor({template = '', dataset = {}, functions = {}, need = {}, listen = {}} = {}) {
    this.template = template
    this.parser = new Parser(template)
    this.renderer = new Renderer(this.parser, {dataset, functions})
    this.renderer.component = this
    this.dataset = this.renderer.dataset
    this.functions = this.renderer.functions
    this.need = need
    this.components = {}
    this.parent = null
    this.emitter = new BSEvent(new Date().getTime())
    this.listen = listen
    
    Object.entries(this.listen).forEach(([signal, callback]) => {
      if (signal.startsWith('_')) {
        this.emitter.once(signal.slice(1), callback)
      } else {
        this.emitter.on(signal, callback)
      }
    })
  }
  
  read(dataset) {
    Object.entries(dataset).forEach(([key, value]) => {
      this.renderer.dataset[key] = value
    })
    return this
  }
  
  plug(components = {}) {
    Object.entries(components).forEach(([name, component]) => {
      this.components[name] = component
      this.components[name].parent = this
    })
    return this
  }
  
  render() {
    const domRoot = this.renderer.render()
    Object.entries(this.need).forEach(([component, prototype]) => {
      new Array().forEach.call(domRoot.querySelectorAll(`BSXml-Component[component=${component}]`), mark => {
        const name = mark.getAttribute('name')
        if (!this.components[name]) {
          this.components[name] = new prototype()
          this.components[name].parent = this
        }
        this.components[name].paint(mark, 'replace')
      })
    })
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
    } else if(signal.signal){
      this.emitter.emit(signal.signal, signal)
    }
  }
  
  paint(target, type = 'replace') {
    this.render().paint(target, type)
  }
}