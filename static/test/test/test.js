import BSModule from 'https://static.ihint.me/BSModule.js'

console.log(`imported a module named: ${BSModule.lastModuleName}`)
console.log(`data received: ${JSON.stringify(BSModule.dataStorage[BSModule.lastModuleName])}`)