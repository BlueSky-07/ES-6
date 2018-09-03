import {panels} from '../app.js'
import Main from '../components/Main.js'
import BSModule from '//node.com/modules/BSModule.js'

let main = panels.get('main')
if (!panels.has('main')) {
  main = new Main()
  panels.set('main', main)
  main.paint(document.querySelector('#loading'), 'replace')
}
setTimeout(() => {
  main.signal(Object.assign({
    signal: 'view'
  }, BSModule.dataStorage.view || {}))
}, 0)