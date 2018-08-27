export default class BSElement {
  constructor(tagName = '', props = {}, children = []) {
    this.tagName = tagName
    this.props = props
    this.children = children
  }
  
  compile() {
    const element = document.createElement(this.tagName)
    
    Object.entries(this.props).forEach(([key, value]) => {
      if (value) element.setAttribute(key, value)
    })
    
    this.children.forEach(
        child => {
          const childElement = (child instanceof BSElement)
              ? child.compile()
              : document.createTextNode(child)
          element.appendChild(childElement)
        })
    
    return element
  }
  
  static create(text = '') {
    const tagName = text.trim().split(' ')[0]
    if (tagName.length === 0) {
      return ' '
    }
    if (HTMLTags.has(tagName)) {
      return new BSElement(tagName)
    } else {
      return text.trim()
    }
  }
  
  static createEventMark(eventName = '', functionName = '') {
    if (HTMLEvents.has(eventName)) {
      return new BSElement('BSXml-Event', {eventName, functionName})
    } else {
      throw new Error(`invalid event name ${eventName}`)
    }
  }
  
  static createInputMark() {
    return new BSElement('BSXml-Input')
  }
  
  static createComponentMark(component, name, args) {
    return new BSElement('BSXml-Component', {component, name, args})
  }
  
  static createComponentBlockMark(hash) {
    return new BSElement('bsxc', {hash})
  }
}

// HTML tags reference
// http://www.w3school.com.cn/tags/index.asp
const HTMLTags = new Set([
  'vdRoot', // root
  // '!--...--', '!DOCTYPE'
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio',
  'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button',
  'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command',
  'datalist', 'dd', 'del', 'details', 'dir', 'div', 'dfn', 'dialog', 'dl', 'dt',
  'em', 'embed',
  'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html',
  'i', 'iframe', 'img', 'input', 'ins', 'isindex',
  'kbd', 'keygen',
  'label', 'legend', 'li', 'link',
  'map', 'mark', 'menu', 'menuitem', 'meta', 'meter',
  'nav', 'noframes', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'param', 'pre', 'progress',
  'q',
  'rp', 'rt', 'ruby',
  's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt',
  'u', 'ul',
  'var', 'video',
  'wbr',
  'xmp'
])

// HTML events reference
// http://www.w3school.com.cn/tags/html_ref_eventattributes.asp
const HTMLEvents = new Set([
  'abort', 'afterprint',
  'beforeprint', 'beforeunload', 'blur',
  'canplay', 'canplaythrough', 'change', 'click', 'contextmenu',
  'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange',
  'emptied', 'ended', 'error',
  'focus', 'formchange', 'forminput',
  'haschange',
  'input', 'invalid',
  'keydown', 'keypress', 'keyup',
  'load', 'loadeddata', 'loadedmetadata', 'loadstart',
  'message', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel',
  'offline', 'online',
  'pagehide', 'pageshow', 'pause', 'play', 'playing', 'popstate', 'progress',
  'ratechange', 'readystatechange', 'redo', 'reset', 'resize',
  'scroll', 'seeked', 'seeking', 'select', 'stalled', 'storage', 'submit', 'suspend',
  'timeupdate',
  'undo', 'unload',
  'volumechange',
  'waiting'
])