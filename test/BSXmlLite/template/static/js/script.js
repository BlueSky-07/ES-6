import BSXml from "//node.com/modules/BSXmlLite.js"

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

BSXml.start(['loading', 'timeline'], {
  next() {
    $('#loading').remove()
  }
})