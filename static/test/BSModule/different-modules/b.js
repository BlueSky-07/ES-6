import BSModule from '//node.com/modules/BSModule.js'

document.querySelector('#b').innerHTML = 'module_b has been added.<br>'
document.querySelector('#b').innerHTML += 'data:<br>'
document.querySelector('#b').innerHTML += JSON.stringify(BSModule.data)