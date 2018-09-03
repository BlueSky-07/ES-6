import {panels} from '../app.js'
import Main from '../components/Main.js'

if (panels.has('main')) {
  panels.get('main').refresh('show')
} else {
  const main = new Main()
  panels.set('main', main)
  main.paint(document.querySelector('#loading'), 'replace')
}

