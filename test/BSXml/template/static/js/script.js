import BSXml from "//node.com/modules/BSXml.js"

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

BSXml.start(['loading'])
BSXml.start(['timeline'], {
  next() {
    $('#loading').remove()
  }
})