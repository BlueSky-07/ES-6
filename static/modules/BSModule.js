/**
 * Browser-Simple-Module
 * @BlueSky
 *
 * Version Alpha, 0.3
 *
 * Last updated: 2018/8/6
 *
 */
import BSData from './BSData.js'

const $ = document.querySelector.bind(document)

class BSModule {
  constructor({id_prefix = 'js_module_', js_root = 'js/', emptyjs = 'empty.js'}) {
    this.id_prefix = id_prefix
    this.js_root = js_root
    this.emptyjs = `${js_root}${emptyjs}`
  }
  
  static add_js(id, src, callback) {
    try {
      $(`#${id}`).remove();
    } catch (e) {
    }
    const newScript = document.createElement("script");
    newScript.src = `${src}?${new Date().getTime()}`;
    newScript.id = id;
    newScript.onload = callback;
    newScript.type = 'module';
    document.body.appendChild(newScript);
  }
  
  add_module(name = '', {src = '', callback = ''} = {}) {
    src = src || name
    callback = callback || (() => {
    })
    BSModule.add_js(`${this.id_prefix}${name}`, `${this.js_root}${src}.js`, callback)
  }
  
  add_modules(modules = [], callback = '') {
    callback = callback || (() => {
    })
    for (let {name, src} of modules) {
      this.add_module(name, {src})
    }
    BSModule.add_js(`${this.id_prefix}callback`, this.emptyjs, callback)
  }
  
  goto(module_name = '', {htmlpath = '', data = {}} = {}) {
    const current_htmlpath = location.pathname
    const target_htmlpath = htmlpath || current_htmlpath
    const transferring_data = Object.assign(data, {
      __from__: current_htmlpath
    })
    location.href = `${target_htmlpath}#${module_name}?${BSData.object_to_body(transferring_data)}`
    this.render_module()
  }
  
  render_module() {
    const module_name = location.hash.match(/#[\w-_]+/)[0].slice(1) || ''
    const raw_data = location.hash.replace(/#[\w]+[\?]?/, '') || ''
    BSModule.data = BSData.body_to_object(raw_data) || ''
    data_hide_props()
    const src = BSModule.data.__src__ || module_name
    this.add_module(
        module_name
        , {
          src
          , callback: () => {
            location.href = `${location.pathname}#${module_name}?${BSData.object_to_body(copy_data_hide_props())}`
          }
        })
  }
}

const data_hide_props = () => {
  for (const prop of ['__from__', '__src__']) {
    Object.defineProperty(
        BSModule.data, prop, {
          value: BSModule.data[prop]
          , configurable: false
          , enumerable: false
          , writable: false
        })
  }
}

const copy_data_hide_props = () => {
  const copy = Object.assign(BSModule.data, {})
  for (const prop of ['__from__', '__src__']) {
    try {
      delete copy[prop]
    } catch (e) {
    }
  }
  return copy
}

export default BSModule