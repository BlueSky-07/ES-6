/**
 * Browser-Slim-Unique-Token-Generator
 * @BlueSky
 *
 * Version Alpha, 0.1
 *
 * Last updated: 2018/8/27
 *
 */
import md5 from './libs/md5.js'

export default class BSUnique {
  static getToken() {
    const token = md5(new Date().getTime() + BSUnique.lastToken)
    if (BSUnique.tokens.has(token)) {
      return BSUnique.getToken()
    } else {
      BSUnique.tokens.add(token)
      return token
    }
  }
}

BSUnique.tokens = new Set()
BSUnique.lastToken = new Date().getTime() + '@BlueSky'