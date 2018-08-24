import BSElement from './BSElement.js'

export default class Parser {
  constructor(template = '', {initElement = ''} = {}) {
    Object.defineProperty(this, 'template', {
      configurable: false,
      get:() => {
        return this.lines.join('\n')
      },
      set:template => {
        if (Array.isArray(template)) {
          this.lines = template
        } else {
          this.lines = template.split('\n')
        }
      }
    })
    this.template = template
    if (initElement instanceof Function) {
      this.initElement = initElement
    } else {
      this.initElement = ''
    }
  }
  
  compile(dataset = {}) {
    let child = BSElement.create('vdRoot')
    const parents = []
    
    for (let i = 0; i < this.lines.length; i++) {
      let line = this.lines[i].trim()
      
      // drop comments
      if (
          line.startsWith('//') ||
          (line.startsWith('/*') && line.endsWith('*/'))
      ) {
        continue
      }
      
      // convert $data to dataset[data]
      line = line.replace(
          /{{[^}]*}}/g,
          reg => reg.replace(/\$/g, 'dataset.')
      )
      
      // condition statement
      if (line.includes('@if')) {
        const conditionTemplate = new ConditionParser(line, this.lines, i)
        conditionTemplate.compile(dataset).forEach(
            element => {
              child.children.push(element)
            }
        )
        i += conditionTemplate.lines.length + 1
        continue
      }
      
      // loop statement
      if (line.includes('@for')) {
        const loopTemplate = new LoopParser(line, this.lines, i)
        loopTemplate.compile(dataset).forEach(
            element => {
              child.children.push(element)
            }
        )
        i += loopTemplate.lines.length + 1
        continue
      }
      
      
      // read data from dataset
      line = line.replace(
          /{{[^}]*}}/g,
          reg => {
            reg = reg.slice(2, -2)
            try {
              return eval(reg)
            } catch (e) {
              throw new Error(`cannot calculate the result of ${reg.replace(/dataset[.]/g, '$')}`)
            }
          })
      
      
      // set attributes
      if (line.startsWith('~')) {
        const [key, ...value] = line.slice(1).split(' ').filter(i => i.length > 0)
        child.props[key] = value.join(' ')
        continue
      }
      
      // mark event
      if (line.startsWith('!')) {
        const [eventName, functionName] = line.slice(1).split(' ').filter(i => i.length > 0)
        child.children.push(BSElement.createEventMark(eventName, functionName))
        continue
      }
      
      // create element
      const element = BSElement.create(line)
      
      // mark input and textarea
      if (element.tagName === 'input' || element.tagName === 'textarea') {
        child.children.push(BSElement.createInputMark())
      }
      
      if (line.endsWith('{') && !line.endsWith('{{')) {
        parents.push(child)
        child = element
        initElement(child, line, this.initElement)
      } else if (line.startsWith('}') && !line.startsWith('}}')) {
        const parent = parents.pop()
        parent.children.push(child)
        child = parent
      } else {
        child.children.push(element)
      }
    }
    return child
  }
}

class ConditionParser extends Parser {
  constructor(definition, lines, i) {
    try {
      super(getTemplateOfBlock(i, lines))
    } catch (e) {
      throw new Error(`cannot find the end of condition, first line is: ${definition.replace(/dataset[.]/g, '$')}`)
    }
    this.definition = definition
  }
  
  compile(dataset = {}) {
    const conditionTargetName = this.definition.match(/@if\({{[^}]*}}\)/g)[0].slice(4, -1).slice(2, -2)
    let conditionTarget = null
    try {
      conditionTarget = eval(conditionTargetName)
    } catch (e) {
      throw new Error(`cannot calculate the result of ${conditionTargetName.replace(/dataset[.]/g, '$')}`)
    }
    const elements = []
    if (conditionTarget) {
      super.compile(
          dataset
      ).children.forEach(
          element => {
            elements.push(element)
          }
      )
    }
    return elements
  }
}

class LoopParser extends Parser {
  constructor(definition, lines, i) {
    try {
      super(getTemplateOfBlock(i, lines))
    } catch (e) {
      throw new Error(`cannot find the end of loop, first line is: ${definition.replace(/dataset[.]/g, '$')}`)
    }
    this.definition = definition
  }
  
  compile(dataset = {}) {
    const loopTargetName = this.definition.match(/@for\({{[^}]*}}\)/g)[0].slice(5, -1).slice(2, -2)
    let loopTarget = null
    try {
      loopTarget = eval(loopTargetName)
    } catch (e) {
      throw new Error(`cannot find a variable called ${loopTargetName.replace(/dataset[.]/g, '$')} from dataset`)
    }
    if (!Array.isArray(loopTarget)) {
      throw new Error(`$${loopTargetName.replace(/dataset[.]/g, '')} must be an array`)
    }
    const elements = []
    for (let index = 0; index < loopTarget.length; index++) {
      super.compile(
          Object.assign({},
              dataset, {
                index, item: loopTarget[index]
              }
          )
      ).children.forEach(
          element => {
            elements.push(element)
          }
      )
    }
    return elements
  }
}

const getTemplateOfBlock = (indexOfCurrent = -1, lines = []) => {
  const template = []
  const countOfBrackets = {
    left: 0, right: 0
  }
  for (let i = indexOfCurrent + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.endsWith('{') && !line.endsWith('{{')) {
      countOfBrackets.left++
    } else if (line.endsWith('}') && !line.endsWith('}}')) {
      countOfBrackets.right++
    }
    if (countOfBrackets.right > countOfBrackets.left) {
      break
    } else {
      template.push(line)
    }
  }
  if (countOfBrackets.right > countOfBrackets.left) {
    return template
  } else {
    throw new Error()
  }
}

const initElement = (element, raw = '', initElement = '') => {
  if (element instanceof BSElement) {
    if (!initElement) {
      const props = {
        class: (raw.match(/[.][\w\d-]* /g) || []).map(i => i.trim().slice(1)).join(' '),
        id: (raw.match(/[#][\w\d-]* /) || [''])[0].slice(1).trim()
      }
      if (element.tagName === 'a') {
        props.href = (raw.match(/"[^]*"/) || [''])[0].slice(1, -1)
        if (raw.includes('*"')) props.target = '_blank'
      }
      Object.assign(element.props, props)
    } else {
      initElement.call(null, element, raw)
    }
  }
}