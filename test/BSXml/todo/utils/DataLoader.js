import BSFetch from '//node.com/modules/BSFetch.js'
import uuid from '//node.com/modules/libs/uuid.js'

export default class DataLoader {
  static async getTimeline() {
    DataLoader.storage = DataLoader.storage || JSON.parse(localStorage.getItem('todo') || '[]')
    return await DataLoader.storage
  }
  
  static async getTimepointById(id) {
    return await DataLoader.storage.find(tp => String(tp.id) === String(id)) || {status: 'Not-Found'}
  }
  
  static async addTimepoint(tp) {
    const id = uuid()
    DataLoader.storage.push(Object.assign({
      id, date: new Date(tp.date).toISOString()
    }, tp))
    DataLoader.saveToLocalStorage()
    return await {status: 'Success'}
  }
  
  static async deleteTimepointById(id) {
    DataLoader.storage = DataLoader.storage.filter(tp => String(tp.id) !== String(id))
    DataLoader.saveToLocalStorage()
    return await {status: 'Success'}
  }
  
  static saveToLocalStorage() {
    localStorage.setItem('todo', JSON.stringify(DataLoader.storage))
  }
}

class DataLoaderForServer {
  static async getTimeline() {
    return await BSFetch.get('data/timeline.json')
  }
  
  static async getTimepointById(id) {
    return await BSFetch.get(`data/timepoint/${id}.json`)
  }
  
  static async addTimepoint(timepoint) {
    return await BSFetch.post('data/new', {
      data: timepoint
    })
  }
  
  static async deleteTimepointById(id) {
    return await BSFetch.delete(`timepoint/${id}`)
  }
}