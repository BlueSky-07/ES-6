/**
 * Browser-Simple-Fetch
 * @BlueSky
 *
 * Version Alpha, 0.1
 *
 * Last updated: 2018/8/6
 *
 */
import BSData from './BSData.js'

class Request {
  constructor(url = '', {} = {}) {
    this.url = url
    this.config = {}
    
    for (const key of ['body', 'credentials', 'headers', 'method']) {
      Object.defineProperty(this, key, {
        get() {
          return this.config[key]
        },
        set(value) {
          this.config[key] = value
        }
      })
    }
  }
}

class BSFetch {
  static init({basepath = '', port = 80} = {}) {
    BSFetch.basepath = basepath
    BSFetch.port = port
  }
  
  static async get(url = '', {data = {}, config = {}} = {}) {
    return this.fetch(url, 'GET', {data, config})
  }
  
  static async post(url = '', {data = {}, config = {}} = {}) {
    return this.fetch(url, 'POST', {data, config})
  }
  
  static async fetch(url = '', method = '', {data = {}, config = {json: false, cookies: false, await: false}} = {}) {
    const request = new Request(url)
    
    method = method.toLowerCase()
    if (['get', 'post'].includes(method)) {
      request.method = method.toUpperCase()
    } else {
      throw new Error('method must be set, valid values: ["Get", "Post"]')
    }
    
    if (request.method === 'GET') {
      request.url += '?' + BSData.object_to_body(data)
    } else {
      if (config.json) {
        request.body = BSData.object_to_json(data)
        request.headers = {
          'Content-Type': 'application/json'
        }
      } else {
        request.body = BSData.object_to_body(data)
        request.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }
    
    if (config.cookies) {
      request.credentials = 'include'
    }
    
    if (config.await) {
      return await doRequest_await(request)
    } else {
      return doRequest(request)
    }
  }
  
  static URL(request = '') {
    BSFetch.basepath = this.basepath || location.hostname || ''
    BSFetch.port = this.port || location.port || '80'
    return `//${BSFetch.basepath}:${BSFetch.port}/${request}`
  }
}

const doRequest = (request = new Request()) => {
  return new Promise((resolve, reject) => {
    fetch(
        request.url, request.config
    ).then(
        response => response.json()
    ).then(
        data => {
          resolve(data)
        }
    ).catch(
        e => {
          reject(e)
        }
    )
  })
}

const doRequest_await = async (request = new Request()) => {
  let result = {}
  await fetch(
      request.url, request.config
  ).then(
      response => response.json()
  ).then(
      data => {
        result = data
      }
  ).catch(
      e => {
        throw e
      }
  )
  return result
}

export default BSFetch