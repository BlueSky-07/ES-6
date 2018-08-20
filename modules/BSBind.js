/**
 * Browser-Simple-DataBind
 * @BlueSky
 *
 * Version Alpha, 0.1
 *
 * Last updated: 2018/8/14
 *
 */
import md5 from './libs/md5.js'

class DataUnit {
  constructor(value) {
    this.senders = []
    this.receivers = []
    this.listeners = []
    Object.defineProperty(this, 'value', {
      get() {
        return this._value
      },
      set(value) {
        this._value = value
        // notify all listener
        this.listeners.forEach(listener => {
          listener.target[listener.property] = value
        })
      }
    })
    this.value = value
  }
  
  add(prefix, target, property) {
    let fn = ''
    if (target[`__bsbind_id_${property}__`]) {
      fn = 'bind'
    }
    if (target[`__bsbind_lid_${property}__`]) {
      fn = 'bindListener'
    }
    if (target[`__bsbind_bid_${property}__`]) {
      fn = 'bindBoth'
    }
    if (fn) {
      throw new Error(`target has been called ${fn}() before`)
    }
    let array = ''
    switch (prefix) {
      case 'l':
        array = this.listeners
        target[property] = this.value
        break
      case 'b':
        array = this.senders
        Object.defineProperty(target, property, {
          configurable: true,
          get: () => this.value,
          set: value => {
            this.value = value
          }
        })
        break
      default:
        array = this.receivers
        Object.defineProperty(target, property, {
          configurable: true,
          get: () => this.value,
          set: value => {
          }
        })
    }
    const id = array.push({
      target, property
    })
    Object.defineProperty(target, `__bsbind_${prefix}id_${property}__`, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: id
    })
  }
  
  // bind()
  addListener(target, property) {
    this.add('l', target, property)
  }
  
  // bindCopy()
  addReceiver(target, property) {
    this.add('', target, property)
  }
  
  // bindBoth()
  addSender(target, property) {
    this.add('b', target, property)
  }
  
  remove(prefix, target, property) {
    const id = (target[`__bsbind_${prefix}id_${property}__`] || 0) - 1
    let fn = ''
    let array = ''
    switch (prefix) {
      case 'l':
        fn = 'bindListener'
        array = this.listeners
        break
      case 'b':
        fn = 'bindBoth'
        array = this.senders
        break
      default:
        fn = 'bind'
        array = this.receivers
    }
    if (id === -1 || !array[id]) {
      throw new Error(`target has not been called ${fn}() before`)
    } else {
      target[`__bsbind_${prefix}id_${property}__`] = undefined
      array[id] = undefined
      Object.defineProperty(target, property, {
        configurable: true,
        writable: true,
        value: target[property]
      })
    }
    
  }
  
  // unbind()
  removeListener(target, property) {
    this.remove('l', target, property)
  }
  
  // unbindCopy()
  removeReceiver(target, property) {
    this.remove('', target, property)
  }
  
  // unbindBoth()
  removeSender(target, property) {
    this.remove('b', target, property)
  }
  
  clearAll(array = '', fn = '', all = true) {
    if (all) {
      this.clearAllListeners()
      this.clearAllReceivers()
      this.clearAllSenders()
    } else {
      array.filter(item => item).forEach(item => {
        try {
          fn.call(this, item.target, item.property)
        } catch (e) {
        }
      })
    }
  }
  
  clearAllListeners() {
    this.clearAll(this.listeners, this.removeListener, false)
  }
  
  clearAllReceivers() {
    this.clearAll(this.receivers, this.removeReceiver, false)
  }
  
  clearAllSenders() {
    this.clearAll(this.senders, this.removeSender, false)
  }
}

class BSBind {
  static bind(name, target, property = '', type = '', undo = false, all = false) {
    if (typeof target !== 'object') {
      throw new Error('target must be an object')
    }
    if (typeof property !== 'string') {
      throw new Error('property must be a string')
    }
    checkName(name)
    property = property || name
    hasThen(name, (hash, unit) => {
      if (undo && all) {
        unit[({
          copy: 'clearAllReceivers', both: 'clearAllSenders', '': 'clearAllListeners'
        })[type]]()
      } else if (undo) {
        unit[({
          copy: 'removeReceiver', both: 'removeSender', '': 'removeListener'
        })[type]](target, property)
      } else {
        unit[({
          copy: 'addReceiver', both: 'addSender', '': 'addListener'
        })[type]](target, property)
      }
    })
  }
  
  static bindCopy(name, target, property = '') {
    this.bind(name, target, property, 'copy')
  }
  
  static bindBoth(name, target, property = '') {
    this.bind(name, target, property, 'both')
  }
  
  static unbind(name, target, property = '') {
    this.bind(name, target, property, '', true)
  }
  
  static unbindCopy(name, target, property = '') {
    this.bind(name, target, property, 'copy', true)
  }
  
  static unbindBoth(name, target, property = '') {
    this.bind(name, target, property, 'both', true)
  }
  
  static unbindAll(name) {
    this.bind(name, '', '', '', true, true)
  }
  
  static unbindAllCopy(name) {
    this.bind(name, '', '', 'copy', true, true)
  }
  
  static unbindAllBoth(name) {
    this.bind(name, '', '', 'both', true, true)
  }
  
  static clearAll(name) {
    checkName(name)
    hasThen(name, (hash, unit) => {
      unit.clearAll()
    })
  }
  
  static put(name, value = '') {
    checkName(name)
    const hash = md5(name)
    if (BSBind.names.has(hash)) {
      BSBind.storage[hash].clearAll()
    }
    BSBind.names.add(hash)
    BSBind.storage[hash] = new DataUnit(value)
  }
  
  static has(name) {
    checkName(name)
    return BSBind.names.has(md5(name))
  }
  
  static get(name) {
    checkName(name)
    let value = ''
    hasThen(name, (hash, unit) => {
      value = unit.value
    })
    return value
  }
  
  static set(name, value = '') {
    checkName(name)
    hasThen(name, (hash, unit) => {
      unit.value = value
    })
  }
}

const checkName = name => {
  if (typeof name !== 'string') {
    throw new Error(`'${name}' must be a string`)
  }
}

const hasThen = (name, fn) => {
  const hash = md5(name)
  if (!BSBind.names.has(hash)) {
    throw new Error(`'${name}' must be put before`)
  } else {
    fn(hash, BSBind.storage[hash])
  }
}

BSBind.names = new Set()
BSBind.storage = {}

export default BSBind