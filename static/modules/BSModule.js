/**
 * Browser-Simple-Module
 * @BlueSky
 *
 * Version Alpha, 1.1
 *
 * Last updated: 2018/8/10
 *
 */
import md5 from './libs/md5.js'
import BSData from './BSData.js'

const $ = document.querySelector.bind(document)

class BSModule {
  constructor({id_prefix = 'js_module_', js_root = 'js/', emptyjs = 'empty.js'} = {}) {
    this.id_prefix = id_prefix
    this.js_root = js_root
    this.emptyjs = `${js_root}${emptyjs}`
  }
  
  static add_js(id, src, {callback = '', type = ''} = {}) {
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
  
  add_module(name = '', {src = '', callback = ''} = {}) {
    BSModule.add_js(`${this.id_prefix}${name}`, `${this.js_root}${src || name}.js`, {callback, type: 'module'})
  }
  
  add_modules(modules = [], callback = '') {
    for (const module of modules) {
      for (const {name, src} of module) {
        this.add_module(name, {src})
      }
    }
    BSModule.add_js(`${this.id_prefix}callback`, this.emptyjs, {callback, type: 'module'})
  }
  
  // import module or go to another page
  auto(module_name = '', {htmlpath = '', data = {}} = {}) {
    const current_htmlpath = location.pathname
    const target_htmlpath = htmlpath || current_htmlpath
    if (current_htmlpath === target_htmlpath) {
      BSModule.dataStorage[module_name] = data
      this.apply_module(module_name, true)
    } else {
      const transferring_data = Object.assign(
          data, {
            _from_: current_htmlpath
          }
      )
      location.href = `${target_htmlpath}#${module_name}?${BSData.object_to_body(transferring_data)}`
    }
  }
  
  apply_module(module_name = '', is_current = false, is_router = false) {
    if (!is_current) {
      module_name = (location.hash.split('?')[0] || '').slice(1)
      if (module_name.startsWith('/')) {
        const path = module_name
        try {
          module_name = this.routers[md5(path)].module_name
          is_router = true
        } catch (e) {
          throw new Error(`router for ${path} must be registered before apply`)
        }
      }
      const raw_data = location.hash.slice(location.hash.split('?')[0].length + 1)
      BSModule.dataStorage[module_name] = BSData.body_to_object(raw_data) || {}
    }
    if (module_name) {
      BSModule.lastModuleName = module_name
      if (is_router) {
        delete BSModule.dataStorage[module_name]._src_
      }
      const src = BSModule.dataStorage[module_name]._src_ || module_name
      this.add_module(module_name, {src})
    }
  }
  
  register_router(path = '', module_name = {}) {
    if (path[0] !== '/') {
      throw new Error('path must start with /')
    }
    if (!this.routers) {
      this.routers = {}
    }
    const hash = md5(path)
    this.routers[hash] = {path, module_name}
    if (!BSModule.hashchange_event_registered) {
      BSModule.hashchange_event_registered = true
      window.onhashchange = () => {
        if (BSModule.gotoPreventApplyAgain) {
          BSModule.gotoPreventApplyAgain = false
        } else {
          this.apply_module()
        }
      }
    }
  }
  
  register_routers(routers = []) {
    if (Array.isArray(routers)) {
      for (const router of routers) {
        if (Array.isArray(router)) {
          const [path, module_name] = router
          this.register_router(path, module_name)
        } else if (router.path && router.module_name) {
          const {path, module_name} = router
          this.register_router(path, module_name)
        } else {
          throw new Error('item should be [path, module_name] or {path, module_name}')
        }
      }
    } else {
      throw new Error('routers should be an array')
    }
  }
  
  goto(path = '', {data = {}} = {}) {
    const hash = md5(path)
    if (this.routers[hash]) {
      BSModule.gotoPreventApplyAgain = true
      const module_name = this.routers[hash].module_name
      BSModule.dataStorage[module_name] = data
      location.href = `${location.pathname}#${path}`
      this.apply_module(module_name, true, true)
    } else {
      throw new Error(`${path} has not be registered`)
    }
  }
  
  static prevent_index_html({filename = 'index.html', index_path = '/'} = {}) {
    if (location.pathname.endsWith(filename)) {
      location.href = `${location.pathname.slice(0, 0 - (filename.length))}#${index_path}`
    }
  }
}

BSModule.dataStorage = {}

export default BSModule