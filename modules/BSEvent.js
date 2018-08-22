/**
 * Browser-Simple-EventEmitter
 * @BlueSky
 *
 * Version Alpha, 0.1
 *
 * Last updated: 2018/8/22
 *
 */

class EventBundle {
  constructor() {
    this.funs = []
  }
  
  push(f, once) {
    this.funs.push({
      f, once
    })
  }
  
  handle(args) {
    this.funs.forEach(fun => {
      fun.f.call(null, ...args)
    })
    this.funs = this.funs.filter(fun => !fun.once)
  }
  
  remove(f) {
    this.funs = this.funs.filter(fun => fun.f !== f)
  }
  
  clear() {
    this.funs = []
  }
  
}

class BSEvent {
  constructor(name = '') {
    this.events = {}
    
    BSEvent[name] = this
  }
  
  on(name = '', callbacks = new Function(), once = false) {
    if (!name) {
      throw new Error('name must be a string')
    }
    if (!this.events[name]) {
      this.events[name] = new EventBundle()
    }
    if (!(callbacks instanceof Array)) {
      callbacks = [callbacks]
    }
    for (const callback of callbacks) {
      if (!(callback instanceof Function)) {
        throw new Error('callback must be a function')
      }
      this.events[name].push(callback, once)
    }
  }
  
  once(name, callback) {
    this.on(name, callback, true)
  }
  
  emit(name = '', ...args) {
    try {
      this.events[name].handle(args)
    } catch (e) {
      throw new Error(`${name} has not been registered`)
    }
  }
  
  remove(name, callback) {
    try {
      this.events[name].remove(callback)
    } catch (e) {
      throw new Error(`${name} has not been registered`)
    }
  }
  
  clear(name) {
    try {
      this.events[name].clear()
    } catch (e) {
      throw new Error(`${name} has not been registered`)
    }
  }
}

export default BSEvent