import BSModule from '//node.com/modules/BSModule.js'

document.querySelector('#out').innerHTML = 'module form a.js has been added.<br>'
document.querySelector('#out').innerHTML += 'data:<br>'
document.querySelector('#out').innerHTML += JSON.stringify(BSModule.dataStorage.module)