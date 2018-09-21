import BSComponent from '//node.com/modules/BSXml/BSComponent.js'
import {router} from '../../app.js'
import DateFormatter from '../../utils/DateFormatter.js'

export default class TimePoint extends BSComponent {
  constructor(id = 0, date = new Date('2000/1/1').getTime(), title = '') {
    super()
    id = decodeURI(id)
    date = DateFormatter.format(decodeURI(date))
    title = decodeURI(title)
    this.template = `
      div .timepoint .timepoint-in {
        ! click view
        ~ draggable true
        ! dragstart willDelete
        ! dragend cancelDelete
        
        div #title .title {
          {{$title}}
        }
        div #date .date {
          {{$date}}
        }
      }
    `
    this.dataset = {
      id, date, title
    }
    this.functions = {
      view({$this, dataset}) {
        router.gotoRouter('/view/' + dataset.id)
      },
      willDelete({$this, event, dataset}) {
        const offsetX = event.target.offsetLeft + event.target.offsetWidth / 2
        const offsetY = event.target.offsetTop + event.target.offsetHeight
        $this.notify({
          signal: 'trash-show', offsetX, offsetY
        })
        event.dataTransfer.setData('id', dataset.id)
      },
      cancelDelete({$this}) {
        $this.notify('trash-hide')
      }
    }
  }
  
  refresh(command, ...args) {
    switch (command) {
      case 'drop': {
        this.el.classList.remove('timepoint-in')
        this.el.classList.add('timepoint-out')
        setTimeout(() => {
          this.el.hidden = 'hidden'
        }, 500)
        break
      }
      default:
        super.refresh()
    }
  }
}