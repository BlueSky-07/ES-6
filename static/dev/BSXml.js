/**
 * Browser-Slim-XML
 * @BlueSky
 *
 * Version Alpha, 2.0
 *
 * Last updated: 2018/8/6
 *
 */

class El {
  constructor(tagName = '', props = {}, children = []) {
    this.tagName = tagName
    this.props = props
    this.children = children
  }
  
  render() {
    const el = document.createElement(this.tagName)
    const props = this.props
    
    for (const propName in props) {
      const propValue = props[propName]
      if (!propValue) continue
      el.setAttribute(propName, propValue)
    }
    
    const children = this.children || []
    
    children.forEach(
        child => {
          const childEl = (child instanceof El)
              ? child.render()
              : document.createTextNode(child)
          el.appendChild(childEl)
        })
    
    return el
  }
}

class BSXml {
  static start(
      templateNodes = [], {
        dataset = {}
        , functions = {}
        , init = () => {
        }, next = () => {
        }
      } = {}) {
    
    init()
    
    const finalNext = () => {
      // register events
      [].forEach.call(
          document.querySelectorAll('BSXml-Event')
          , target => {
            const eventName = target.getAttribute('eventName')
            const functionName = target.getAttribute('functionName')
            if (Object.keys(functions).includes(functionName)) {
              target.parentNode.addEventListener(eventName, () => {
                  functions[functionName].call(null, window.event, dataset)
              })
              target.remove()
            } else {
              throw new Error(`cannot find a function named ${functionName}`)
            }
          }
      )
      
      // user's next function
      next()
    }
    
    // generate NEXT.next() function
    // real next() will be called after all templateNodes have been showRendered
    let NEXT = finalNext
    for (let i = 0; i < templateNodes.length; i++) {
      NEXT = {
        NEXT
        , next() {
          if (this.NEXT.NEXT) {
            this.NEXT = this.NEXT.NEXT
          } else {
            this.NEXT()
          }
        }
      }
    }
    
    if (Array.isArray(templateNodes)) {
      [].forEach.call(
          templateNodes
          , async templateNode => {
            if (templateNode) {
              let realTemplateNode = null
              
              // String or Node
              if (templateNode instanceof HTMLElement) {
                realTemplateNode = templateNode
              } else {
                realTemplateNode = getTemplateNode(templateNode)
              }
              if (realTemplateNode === null) {
                throw new Error(`cannot find a node named ${templateNode}`)
              }
              
              // fetch template
              if (realTemplateNode.getAttribute('link')) {
                const link = realTemplateNode.getAttribute('link').trim()
                await fetch(link).then(
                    r => {
                      if (r.ok) {
                        return r.text()
                      } else {
                        throw new Error(`cannot fetch template from ${link}`)
                      }
                    }
                ).then(
                    text => {
                      realTemplateNode.innerHTML = text
                    }
                ).catch(
                    e => {
                      throw e
                    }
                )
              }
              
              // fetch dataset
              let realDataset = {}
              if (realTemplateNode.getAttribute('data')) {
                const data = realTemplateNode.getAttribute('data').trim()
                await fetch(data).then(
                    r => {
                      if (r.ok) {
                        return r.json()
                      } else {
                        throw new Error(`cannot fetch dataset from ${data}`)
                      }
                    }
                ).then(
                    json => {
                      realDataset = json
                    }
                ).catch(
                    e => {
                      throw e
                    }
                )
              }
              
              // work
              showRendered(generateVirtualDOM(realTemplateNode.innerHTML, Object.assign(realDataset, dataset)), realTemplateNode)
              
              // call NEXT.next()
              NEXT.next()
            }
          })
    } else {
      throw new Error('templateNodes should be an array')
    }
  }
}

const showRendered = (vdRoot, templateNode) => {
  if (!templateNode instanceof HTMLElement || !vdRoot instanceof HTMLElement) {
    throw new Error('illegal call')
  }
  
  // insert before templateNode
  const parentNode = templateNode.parentNode
  const leftNodesToInsert = vdRoot.render().children
  while (leftNodesToInsert.length > 0) {
    parentNode.insertBefore(leftNodesToInsert[0], templateNode)
  }
  
  // keep or remove templateNode
  if (templateNode.getAttribute('keep') !== 'true') {
    parentNode.removeChild(templateNode)
  }
}

const generateVirtualDOM = (template = '', dataset = {}) => {
  const lines = template.split('\n')
  let child = createElement('vdRoot')
  const parents = []
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    
    // drop comments
    if (line.startsWith('//') || (line.startsWith('/*') && (line.endsWith('*/')))) {
      continue
    }
    
    // convert $data to dataset[data]
    line = line.replace(/{{[^}]*}}/g, reg => reg.replace(/\$/g, 'dataset.'))
    
    // loop statement
    if (line.includes('@for')) {
      const loopTargetName = line.match(/@for\({{[^}]*}}\)/g)[0].slice(5, -1).slice(1, -1)
      let loopTarget = null
      try {
        loopTarget = eval(loopTargetName)
      } catch (e) {
        throw new Error(`cannot find a variable called $${loopTargetName.replace(/dataset[.]/g, '')} from dataset`)
      }
      if (!Array.isArray(loopTarget)) {
        throw new Error(`$${loopTargetName.replace(/dataset[.]/g, '')} must be an array`)
      }
      const loopTemplate = []
      const countOfBrackets = {
        left: 0, right: 0
      }
      for (i++; i < lines.length; i++) {
        const _line = lines[i]
        if (_line.includes('{')) {
          countOfBrackets.left++
        } else if (_line.includes('}')) {
          countOfBrackets.right++
        }
        if (countOfBrackets.right > countOfBrackets.left) {
          break
        } else {
          loopTemplate.push(_line)
        }
      }
      if (countOfBrackets.right > countOfBrackets.left) {
        const back = {}
        back.index = dataset.index
        back.item = dataset.item
        for (let index = 0; index < loopTarget.length; index++) {
          generateVirtualDOM(loopTemplate.join('\n'), Object.assign(dataset, {
            index, item: loopTarget[index]
          })).children.forEach(i => {
            child.children.push(i)
          })
        }
        back.index ? (dataset.index = back.index) : ''
        back.item ? (dataset.item = back.item) : ''
      } else {
        throw new Error(`cannot find end of the loop, first line is: ${loopTemplate[0]}`)
      }
      continue
    }
    
    // condition statement
    if (line.includes('@if')) {
      const conditionTargetName = line.match(/@if\({{[^}]*}}\)/g)[0].slice(4, -1).slice(1, -1)
      let conditionTarget = null
      try {
        conditionTarget = eval(conditionTargetName)
      } catch (e) {
        throw new Error(`cannot calculate the result of $${conditionTargetName.replace(/dataset[.]/g, '')}`)
      }
      const ifTemplate = []
      const countOfBrackets = {
        left: 0, right: 0
      }
      for (i++; i < lines.length; i++) {
        const _line = lines[i]
        if (_line.includes('{')) {
          countOfBrackets.left++
        } else if (_line.includes('}')) {
          countOfBrackets.right++
        }
        if (countOfBrackets.right > countOfBrackets.left) {
          break
        } else {
          ifTemplate.push(_line)
        }
      }
      if (countOfBrackets.right > countOfBrackets.left) {
        if (conditionTarget) {
          generateVirtualDOM(ifTemplate.join('\n'), dataset).children.forEach(i => {
            child.children.push(i)
          })
        }
      } else {
        throw new Error(`cannot find end of the condition, first line is: ${ifTemplate[0]}`)
      }
      continue
    }
    
    // fetch read data from dataset
    line = line.replace(/{{[^}]*}}/g, reg => eval(reg.slice(1, -1)))
    
    // set attributes
    if (line.startsWith('~')) {
      line = line.slice(1)
      const key_value = line.split(' ').filter(i => i.length > 0)
      const key = key_value[0]
      const value = key_value.slice(1).join(' ')
      setElementPropsByKeyValue(child, key, value)
      continue
    }
    
    // add events
    if (line.startsWith('!')) {
      line = line.slice(1)
      const args = line.split(' ').filter(i => i.length > 0)
      const eventName = args[0]
      const functionName = args[1]
      child.children.push(registerEvent(eventName, functionName))
      continue
    }
    
    // create element
    const el = createElement(line)
    if (line.endsWith('{') && !line.endsWith('{{')) {
      parents.push(child)
      child = el
      setElementProps(child, line)
    } else if (line.startsWith('}') && !line.startsWith('}}')) {
      const parent = parents.pop()
      parent.children.push(child)
      child = parent
    } else {
      child.children.push(el)
    }
  }
  return child
}

// HTML events reference
// http://www.w3school.com.cn/tags/html_ref_eventattributes.asp
const HTMLEvents = new Set([
  'abort', 'afterprint'
  , 'beforeprint', 'beforeunload', 'blur'
  , 'canplay', 'canplaythrough', 'change', 'click', 'contextmenu'
  , 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange'
  , 'emptied', 'ended', 'error'
  , 'focus', 'formchange', 'forminput'
  , 'haschange'
  , 'input', 'invalid'
  , 'keydown', 'keypress', 'keyup'
  , 'load', 'loadeddata', 'loadedmetadata', 'loadstart'
  , 'message', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel'
  , 'offline', 'online'
  , 'pagehide', 'pageshow', 'pause', 'play', 'playing', 'popstate', 'progress'
  , 'ratechange', 'readystatechange', 'redo', 'reset', 'resize'
  , 'scroll', 'seeked', 'seeking', 'select', 'stalled', 'storage', 'submit', 'suspend'
  , 'timeupdate'
  , 'undo', 'unload'
  , 'volumechange'
  , 'waiting'
])

// HTML tags reference
// http://www.w3school.com.cn/tags/index.asp
const HTMLTags = new Set([
  'vdRoot' // root
  // '!--...--', '!DOCTYPE'
  , 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio'
  , 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button'
  , 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command'
  , 'datalist', 'dd', 'del', 'details', 'dir', 'div', 'dfn', 'dialog', 'dl', 'dt'
  , 'em', 'embed'
  , 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset'
  , 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html'
  , 'i', 'iframe', 'img', 'input', 'ins', 'isindex'
  , 'kbd', 'keygen'
  , 'label', 'legend', 'li', 'link'
  , 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter'
  , 'nav', 'noframes', 'noscript'
  , 'object', 'ol', 'optgroup', 'option', 'output'
  , 'p', 'param', 'pre', 'progress'
  , 'q'
  , 'rp', 'rt', 'ruby'
  , 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup'
  , 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt'
  , 'u', 'ul'
  , 'var', 'video'
  , 'wbr'
  , 'xmp'
])

const registerEvent = (eventName = '', functionName = '') => {
  if (HTMLEvents.has(eventName)) {
    return new El('BSXml-Event', {eventName, functionName})
  } else {
    throw new Error(`invalid`)
  }
}

const createElement = (text = '') => {
  const tagName = text.trim().split(' ')[0]
  if (tagName.length === 0) {
    return ' '
  }
  if (HTMLTags.has(tagName)) {
    return new El(tagName)
  } else {
    return text.trim()
  }
}

const setElementProps = (element, raw = '') => {
  if (element instanceof El) {
    const props = {
      class: (raw.match(/[.][\w\d-]* /g) || []).map(i => i.trim().slice(1)).join(' ')
      , id: (raw.match(/[#][\w\d-]* /) || [''])[0].slice(1).trim()
    }
    if (element.tagName === 'a') {
      props.href = (raw.match(/"[^]*"/) || [''])[0].slice(1, -1)
      if (raw.includes('*"')) props.target = '_blank'
    }
    element.props = props
  }
}

const setElementPropsByKeyValue = (element, key = '', value = '') => {
  if (!element.props) {
    element.props = {}
  }
  element.props[key] = value
}

const getTemplateNode = (name = '') => {
  if (name.trim().length > 0) {
    return document.querySelector(`BSX[name=${name}]`)
  } else {
    return null
  }
}

export default BSXml