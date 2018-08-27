import Parser from './Parser.js'
import BSUnique from '../../BSUnique.js'

export default class Renderer {
  constructor(parser, {
    dataset = {},
    functions = {}
  } = {}) {
    if (parser instanceof Parser) {
      this.parser = parser
    } else {
      throw new Error('parser should be an instance of Parser')
    }
    
    this.functions = functions
    this.dataset = dataset
    this.inputs = {}
    this._inputs_ = new Map()
    this.component = null
  }
  
  render() {
    const vdRoot = this.parser.compile(this.dataset)
    const domRoot = vdRoot.compile()
    const fragment = document.createDocumentFragment()
    
    while(domRoot.childNodes[0]) {
      fragment.append(domRoot.childNodes[0])
    }
    
    // register events
    new Array().forEach.call(
        fragment.querySelectorAll('BSXml-Event'),
        mark => {
          const target = mark.parentNode
          const eventName = mark.getAttribute('eventName')
          const functionName = mark.getAttribute('functionName')
          if (Object.keys(this.functions).includes(functionName)) {
            target.addEventListener(
                eventName,
                () => {
                  this.functions[functionName].call(
                      this.functions, {
                        event: window.event,
                        target,
                        dataset: this.dataset,
                        inputs: this.inputs,
                        component: this.component,
                        $this: this.component
                      })
                }
            )
            mark.remove()
          } else {
            throw new Error(`cannot find a function named ${functionName}`)
          }
        }
    )
    
    // register inputs
    new Array().forEach.call(
        fragment.querySelectorAll('BSXml-Input'),
        mark => {
          const target = mark.nextElementSibling
          const hash = BSUnique.getToken()
          const inputName = target.getAttribute('dict') || hash
          Object.defineProperty(
              this.inputs,
              inputName, {
                configurable: false,
                enumerable: true,
                get: () => {
                  return this._inputs_.get(hash).value
                },
                set: value => {
                  this._inputs_.get(hash).value = value
                }
              }
          )
          this._inputs_.set(hash, target)
          mark.remove()
        }
    )
    return fragment
  }
}

DocumentFragment.prototype.paint = function (target, type = 'before') {
  if (!(target instanceof HTMLElement)) {
    throw new Error('target should be an instance of HTMLElement')
  }
  switch (type) {
    case 'before':
      target.parentNode.insertBefore(this, target)
      break
    case 'after':
      if (target.nextElementSibling) {
        target.parentNode.insertBefore(this, target.nextElementSibling)
      } else {
        target.parentNode.appendChild(this)
      }
      break
    case 'replace':
      target.parentNode.replaceChild(this, target)
      break
    case 'push':
      if (target.children[0]) {
        target.insertBefore(this, target.children[0])
      } else {
        target.appendChild(this)
      }
      break
    case 'append':
      target.appendChild(this)
      break
  }
}