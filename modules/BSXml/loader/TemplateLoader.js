import BSFetch from '../../BSFetch.js'

export default class TemplateLoader {
  static async load(realTemplateNode) {
      if (realTemplateNode.getAttribute('link') && !realTemplateNode.getAttribute('ignore-link')) {
        const link = realTemplateNode.getAttribute('link').trim()
        await BSFetch.get(link, {
          restype: 'text'
        }).then(text => {
          realTemplateNode.innerHTML = text
        }).catch(() => {
          throw new Error(`cannot fetch template from ${link}`)
        })
        realTemplateNode.setAttribute('ignore-link', 'true')
      }
  }
}