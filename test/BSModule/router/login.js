import BSModule from '//node.com/modules/BSModule.js'

document.querySelector('#page_name').innerHTML = 'login'
document.querySelector('#data').innerHTML = `data:${JSON.stringify(BSModule.dataStorage.login)}<br>`