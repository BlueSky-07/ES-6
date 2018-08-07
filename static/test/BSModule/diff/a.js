import BSModule from '//node.com/modules/BSModule.js'

document.querySelector('#a').innerHTML = 'module_a has been added.<br>'
document.querySelector('#a').innerHTML += 'data:<br>'
document.querySelector('#a').innerHTML += JSON.stringify(BSModule.data)