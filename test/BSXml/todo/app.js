import BSModule from '//node.com/modules/BSModule.js'

const router = new BSModule({
  idPrefix: 'router-',
  jsRoot:'routers/',
  emptyJS: 'js/empty.js'
})

router.setRouters([
    ['/', 'panel'],
    ['/view/{id}', 'view']
])

router.applyModule()

BSModule.jumpAtIndex()

const panels = new Map()

export {router, panels}