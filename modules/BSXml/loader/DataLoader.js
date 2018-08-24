import BSFetch from '../../BSFetch.js'

export default class DataLoader {
  static async load(realTemplateNode) {
    if (realTemplateNode.getAttribute('data')) {
      const data = realTemplateNode.getAttribute('data').trim()
      try {
        return await BSFetch.get(data)
      } catch (e) {
        throw new Error(`cannot fetch dataset from ${data}`)
      }
    }
  }
}