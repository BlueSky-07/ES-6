import md5 from '../../libs/md5.js'
import Parser from './Parser.js'

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
    this.dataset = Object.assign({}, dataset)
    this._dataStorage_ = new Map()
    this.inputs = {}
    this._inputs_ = new Map()
    
    Object.entries(this.dataset).forEach(([key, value]) => {
      Object.defineProperty(this.dataset, key, {
        configurable: false,
        get: () => {
          return this._dataStorage_.get(key)
        },
        set: value => {
          this._dataStorage_.set(key, value)
        }
      })
      this.dataset[key] = value
    })
  }
  
  render() {
    const vdRoot = this.parser.compile(this.dataset)
    const domRoot = vdRoot.compile()
    const fragment = document.createDocumentFragment()
    new Array().forEach.call(domRoot.children, element => {
      fragment.appendChild(element)
    })
    
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
                  this.functions[functionName].call(this.functions, window.event, target, this.dataset, this.inputs)
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
          const inputName = `${(target.getAttribute('name') || new Date().getTime())}`
          const hash = md5(inputName)
          target.setAttribute('md5', hash)
          Object.defineProperty(
              this.inputs,
              inputName, {
                configurable: false,
                enumerable: true,
                get: () => {
                  const hash = md5(inputName)
                  return this._inputs_.get(hash).value
                },
                set: value => {
                  const hash = md5(inputName)
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

Object.defineProperty(
    DocumentFragment.prototype,
    'paint', {
      get() {
        return (target, type = 'insert-before') => {
          if (!(target instanceof HTMLElement)) {
            throw new Error('target should be an instance of HTMLElement')
          }
          switch (type) {
            case 'insert-before':
              target.parentNode.insertBefore(this, target)
              break
            case 'append-child':
              target.appendChild(this)
              break
          }
        }
      }
    }
)