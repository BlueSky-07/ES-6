import BSModule from '//node.com/modules/BSModule.js'

document.querySelector('#page_name').innerHTML = BSModule.dataStorage.core.page || 'index'
document.querySelector('#data').innerHTML = `data:${JSON.stringify(BSModule.dataStorage.core)}<br>`