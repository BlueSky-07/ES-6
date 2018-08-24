/**
 * Browser-Simple-Module
 * @BlueSky
 *
 * Version Alpha, 1.3
 *
 * Last updated: 2018/8/23
 *
 */
import md5 from './libs/md5.js'
import BSData from './BSData.js'

const $ = document.querySelector.bind(document)

class BSModule {
  constructor({idPrefix = 'js_module_', jsRoot = 'js/', emptyJS = 'empty.js'} = {}) {
    this.idPrefix = idPrefix
    this.jsRoot = jsRoot
    this.emptyJS = `${jsRoot}${emptyJS}`
    
    this.routers = {}
  }
  
  static addJS(id, src, {callback = '', type = ''} = {}) {
    try {
      $(`#${id}`).remove()
    } catch (e) {
    }
    if (typeof id !== 'string' || id.length === 0) {
      throw new Error('id must be set as a not empty string')
    }
    if (typeof src !== 'string' || src.length === 0) {
      throw new Error('src must be set as a not empty string')
    }
    
    const newScript = document.createElement('script')
    newScript.src = `${src}?${new Date().getTime()}`
    newScript.id = id
    
    callback = callback || new Function()
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function without args')
    } else {
      newScript.onload = callback
    }
    if (type === 'module') {
      newScript.type = 'module'
    }
    document.body.appendChild(newScript)
  }
  
  addModule(name = '', {src = '', callback = ''} = {}) {
    BSModule.addJS(`${this.idPrefix}${name}`, `${this.jsRoot}${src || name}.js`, {callback, type: 'module'})
  }
  
  addModules(modules = [], callback = '') {
    for (const module of modules) {
      for (const {name, src} of module) {
        this.addModule(name, {src})
      }
    }
    BSModule.addJS(`${this.idPrefix}callback`, this.emptyJS, {callback, type: 'module'})
  }
  
  // import module or go to another page
  autoHandle(name = '', {target = '', data = {}} = {}) {
    const currentPathname = location.pathname
    const targetPathname = target || currentPathname
    if (currentPathname === targetPathname) {
      BSModule.dataStorage[name] = data
      this.applyModule(name, true)
    } else {
      Object.assign(
          data, {
            _from_: currentPathname
          }
      )
      location.href = `${targetPathname}#${name}?${BSData.object_to_body(data)}`
    }
  }
  
  applyModule(name = '', isCurrent = false, isRouter = false) {
    if (!isCurrent) {
      name = (location.hash.split('?')[0] || '').slice(1)
      if (name.startsWith('/')) {
        const path = name
        const realPath = this.getRegisteredPath(path)
        isRouter = true
        const hash = md5(realPath)
        name = this.routers[hash].name
        BSModule.dataStorage[name] = this.getDataFromPath(path, hash)
      } else {
        BSModule.dataStorage[name] = {}
      }
      const rawData = location.hash.slice(location.hash.split('?')[0].length + 1)
      Object.assign(BSModule.dataStorage[name], BSData.body_to_object(rawData))
    }
    if (name) {
      BSModule.lastModuleName = name
      if (isRouter) {
        delete BSModule.dataStorage[name]._src_
      }
      const src = BSModule.dataStorage[name]._src_ || name
      this.addModule(name, {src})
    }
  }
  
  setRouter(path = '', name = '', isDelete = false) {
    path = path.trim()
    if (!path.startsWith('/')) {
      throw new Error('path must start with /')
    }
    
    const args = []
    const subpaths = path.slice(1).split('/')
    for (const subpath of subpaths) {
      if (subpath.startsWith('{') && subpath.endsWith('}')) {
        args.push(subpath.slice(1, -1))
      } else {
        args.push('')
      }
    }
    path = path.replace(/{[^}]*}/g, '...')
    const hash = md5(path)
    if (this.routers[hash]) {
      if (isDelete) {
        this.routers[hash] = undefined
        return
      }
      throw new Error(`${path} has already been registered`)
    } else {
      if (isDelete) {
        throw new Error(`${path} has not been registered `)
      }
    }
    this.routers[hash] = {path, name, args}
    
    if (!BSModule.hasHashchangeEventAdded) {
      window.onhashchange = () => {
        if (BSModule.gotoPreventApplyAgain) {
          BSModule.gotoPreventApplyAgain = false
        } else {
          this.applyModule()
        }
      }
      BSModule.hasHashchangeEventAdded = true
    }
  }
  
  setRouters(routers = []) {
    if (Array.isArray(routers)) {
      for (const router of routers) {
        if (Array.isArray(router)) {
          const [path, name] = router
          this.setRouter(path, name)
        } else if (router.path && router.name) {
          const {path, name} = router
          this.setRouter(path, name)
        } else {
          throw new Error('item should be [path, name] or {path, name}')
        }
      }
    } else {
      throw new Error('routers should be an array')
    }
  }
  
  removeRouter(path) {
    this.setRouter(path, '', true)
  }
  
  gotoRouter(path = '', data = {}) {
    BSModule.gotoPreventApplyAgain = true
    const realPath = this.getRegisteredPath(path)
    const hash = md5(realPath)
    const name = this.routers[hash].name
    BSModule.dataStorage[name] = Object.assign(this.getDataFromPath(path), data)
    location.href = `${location.pathname}#${path}`
    this.applyModule(name, true, true)
  }
  
  getDataFromPath(rawPath, hash = '') {
    const data = {}
    const rawArgs = rawPath.slice(1).split('/')
    if (!hash) {
      hash = md5(this.getRegisteredPath(rawPath))
    }
    const registeredArgs = this.routers[hash].args
    for (let i = 0; i < registeredArgs.length; i++) {
      const rawArg = rawArgs[i]
      const registeredArg = registeredArgs[i]
      if (rawArg && registeredArg) {
        data[registeredArg] = rawArg
      }
    }
    return data
  }
  
  getRegisteredPath(rawPath) {
    const iterator = getPathIterator(rawPath)
    let {value, done} = iterator.next()
    let foundPath = ''
    while (!done) {
      if (this.routers[md5(value)]) {
        foundPath = value
        break
      }
      ({value, done} = iterator.next())
    }
    if (!foundPath) {
      throw new Error(`${rawPath} has not been registered`)
    }
    return foundPath
  }
  
  static jumpAtIndex({filename = 'index.html', indexPath = '/'} = {}) {
    if (location.pathname.endsWith(filename)) {
      location.href = `${location.pathname.slice(0, 0 - (filename.length))}#${indexPath}`
    }
  }
}

function* getPathIterator(path) {
  const subpaths = path.slice(1).split('/')
  let pattern = 2 ** subpaths.length - 1
  while (pattern >= 0) {
    let pat = pattern
    const result = []
    for (let i = subpaths.length - 1; i >= 0; i--) {
      result.push(pat & 1 ? subpaths[i] : '...')
      pat >>= 1
    }
    yield '/' + result.reduce((total, current) => current + '/' + total)
    pattern--
  }
}

BSModule.dataStorage = {}

export default BSModule