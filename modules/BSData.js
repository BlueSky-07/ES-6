/**
 * Browser-Simple-DataHandler
 * @BlueSky
 *
 * Version Alpha, 0.3
 *
 * Last updated: 2018/11/29
 *
 */

class BSData {
  static object2Json(data = {}) {
    return JSON.stringify(data)
  }
  
  static json2Object(json_string = '') {
    return JSON.parse(json_string)
  }
  
  static object2Body(data = {}) {
    let res = ''
    Object.entries(data)
        .forEach(
            ([key, value]) => {
              res += `&${key}=${value}`
            }
        )
    return res.slice(1)
  }
  
  static body2Object(body_string = '') {
    const data = {}
    body_string
        .split('&')
        .map(
            i => i.split('=')
        )
        .forEach(
            ([key, value]) => {
              key = decodeURI(key)
              value = decodeURI(value)
              data[key] = value
            }
        )
    delete data['']
    return data
  }
  
  static formdata2Object(formdata = new FormData()) {
    if (formdata instanceof FormData) {
      const data = {}
      for (const entry of formdata.entries()) {
        const [key, value] = entry
        data[key] = value
      }
      return data
    } else {
      throw new Error('arg must be an instance of FormData')
    }
  }
  
  static object2Formdata(data = {}) {
    const formdata = new FormData()
    Object.entries(data)
        .forEach(
            ([key, value]) => {
              formdata.append(key, value)
            }
        )
    return formdata
  }
}

export default BSData