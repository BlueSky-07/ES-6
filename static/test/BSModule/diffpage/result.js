import BSModule from '//node.com/modules/BSModule.js'

document.querySelector('#out').innerHTML += 'data:<br>'
document.querySelector('#out').innerHTML += `last applied module name: ${BSModule.lastModuleName}<br>`
document.querySelector('#out').innerHTML += JSON.stringify(BSModule.dataStorage[BSModule.lastModuleName])