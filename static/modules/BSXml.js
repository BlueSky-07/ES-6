/**
 * Browser-Slim-XML
 * @BlueSky
 *
 * Version Alpha, 1.3
 *
 * Last updated: 2018/8/1
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
        , init = () => {
        }, next = () => {
        }
      } = {}) {
    
    init()
    
    // generate NEXT.next() function
    // real next() will be called after all templateNodes have been showRendered
    let NEXT = next
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
      [].forEach.call(templateNodes
          , async templateNode => {
            if (templateNode) {
              let realTemplateNode = null
              
              // String or Node
              if (templateNode instanceof HTMLElement) {
                realTemplateNode = templateNode
              } else {
                realTemplateNode = this.getTemplateNode(templateNode)
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
              this.showRendered(this.generateVirtualDOM(realTemplateNode.innerHTML, Object.assign(realDataset, dataset)), realTemplateNode)
              
              // call NEXT.next()
              NEXT.next()
            }
          })
    } else {
      throw new Error('templateNodes should be an array')
    }
  }
  
  static showRendered(vdRoot, templateNode) {
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
  
  static generateVirtualDOM(template = '', dataset = {}) {
    const lines = template.split('\n')
    let child = this.createElement('vdRoot')
    const parents = []
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      
      // drop comments
      if (line.trim().startsWith('//')) {
        continue
      }
      
      // convert $data to dataset[data]
      line = line.trim().replace(/:[^:]*:/g, reg => reg.replace(/\$/g, 'dataset.'))
      
      // loop statement
      if (line.includes('@for')) {
        const loopTargetName = line.match(/@for\(:[^:]*:\)/g)[0].slice(5, -1).slice(1, -1)
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
            this.generateVirtualDOM(loopTemplate.join('\n'), Object.assign(dataset, {
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
        const conditionTargetName = line.match(/@if\(:[^:]*:\)/g)[0].slice(4, -1).slice(1, -1)
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
            this.generateVirtualDOM(ifTemplate.join('\n'), dataset).children.forEach(i => {
              child.children.push(i)
            })
          }
        } else {
          throw new Error(`cannot find end of the condition, first line is: ${ifTemplate[0]}`)
        }
        continue
      }
      
      // fetch read data from dataset
      line = line.replace(/:[^:]*:/g, reg => eval(reg.slice(1, -1)))
      
      // create element
      const el = this.createElement(line)
      if (line.includes('{')) {
        parents.push(child)
        child = el
        this.setElementProps(child, line, dataset)
      } else if (line.includes('}')) {
        const parent = parents.pop()
        parent.children.push(child)
        child = parent
      } else {
        child.children.push(el)
      }
    }
    return child
  }
  
  static createElement(text = '') {
    const tagName = text.trim().split(' ')[0]
    switch (tagName) {
      case '':
        return ' '
      case 'vdRoot':
      case 'a':
      case 'br':
      case 'div':
      case 'p':
      case 'span':
        return new El(tagName)
      default:
        return text.trim()
    }
  }
  
  static setElementProps(element, raw = '') {
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
  
  static getTemplateNode(name = '') {
    if (name.trim().length > 0) {
      return document.querySelector(`BSX[name=${name}]`)
    } else {
      return null
    }
  }
}

export default BSXml