import BSComponent from '//node.com/modules/BSXml/BSComponent.js'
import TimePoint from './TimePoint.js'
import DataLoader from '../../utils/DataLoader.js'

export default class Timeline extends BSComponent {
  constructor(timepoints = []) {
    super()
    this.template = `
      div #timeline .timeline {
        div .timeline-container {
          @if({{$timepoints.length}}) {
            @for({{$timepoints}}) {
              @TimePoint tp-{{$item.id}} {{encodeURI($item.id)}} {{encodeURI($item.date)}} {{encodeURI($item.title)}}
            }
          }
          div #empty .timeline-empty {
            ~ hidden {{$timepoints.length ? 'hidden' : ''}}
            h1 {
              All Done
            }
          }
        }
        div #trash .trash {
          ~ hidden hidden
          
          ! dragover willDelete
          ! dragleave cancelDelete
          ! drop delete
        }
      }
    `
    this.dataset = {
      timepoints
    }
    this.need = {
      TimePoint
    }
    this.listen = {
      'trash-show': ({offsetX, offsetY}) => {
        this.refresh('trash-show', offsetX, offsetY)
      },
      'trash-hide': () => {
        this.refresh('trash-hide')
      }
    }
    this.functions = {
      willDelete: ({event}) => {
        event.preventDefault()
        this.refresh('trash-hover')
      },
      cancelDelete: () => {
        this.refresh('trash-leave')
      },
      delete: ({event}) => {
        this.refresh('finish', event.dataTransfer.getData('id'), false)
      }
    }
    this.style = `
      .timeline {
        width: 100%;
        height: 25em;
        background: #fafafa;
        box-shadow: #333 0 0 1em;
      }
      
      .timeline-container {
        width: 90%;
        height: 100%;
        margin: auto;
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      
      .timeline-empty {
        width: 100%;
        text-align: center;
        font-size: 2em;
        color: #aaa;
        user-select: none;
      }
      
      .timeline-container::-webkit-scrollbar {
        height: 0.36em;
        background-color: transparent;
      }
      
      .timeline-container::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.36);
        border-bottom-left-radius: 5em;
        border-bottom-right-radius: 5em;
        background-color: #fff;
      }
      
      .timeline-container::-webkit-scrollbar-thumb {
        border-radius: 1em;
        box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.36);
        background-color: #ccc;
      }
      
      .timepoint {
        min-height: 10em;
        max-height: 20em;
        margin-right: 2em;
        padding: 0.75em;
        border-left: 0.05em solid #000;
        writing-mode: vertical-lr;
        cursor: pointer;
        user-select: none;
        border-top-right-radius: 0.5em;
      }
      
      .timepoint:hover {
        background-color: #eee;
      }
      
      .timepoint .title {
        text-align: right;
        font-size: 2em;
      }
      
      .timepoint .date {
        font-weight: lighter;
      }
      
      .trash {
        background-image: url('img/trash.png');
        background-size: cover;
        position: fixed;
        top: 21em;
        left: 1em;
        width: 32px;
        height: 32px;
      }
      
      .trash-dragover {
        background-image: url('img/trash.png'), linear-gradient(#f00, #ffb000);
        background-blend-mode: lighten;
      }
    `
  }
  
  async beforeRender() {
    this.read({
      timepoints: (await DataLoader.getTimeline()).sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
    })
  }
  
  afterPaint() {
    this.els = {
      trash: this.$el('#trash')
    }
  }
  
  refresh(command, ...args) {
    switch (command) {
      case 'trash-show': {
        const offsetX = args[0] || 16
        const offsetY = (args[1] || 21 * 16) - pageYOffset
        const finalY = offsetY > 21 * 16 ? 21 * 16 : offsetY
        this.els.trash.hidden = ''
        this.els.trash.style.left = offsetX - 16 + 'px'
        this.els.trash.style.top = finalY + 16 + 'px'
        break
      }
      case 'trash-hide': {
        this.els.trash.hidden = 'hidden'
        this.els.trash.style.left = '1em'
        this.els.trash.style.top = '21em'
        this.els.trash.classList.remove('trash-dragover')
        break
      }
      case 'trash-hover': {
        this.els.trash.classList.add('trash-dragover')
        break
      }
      case 'trash-leave': {
        this.els.trash.classList.remove('trash-dragover')
        break
      }
      case 'add': {
        const timepoint = args[0]
        DataLoader.addTimepoint(timepoint)
            .then(json => {
              if (json.status === 'Success') {
                this.notify({
                  signal: 'system-out',
                  message: `[SYNC-ADDED]\n`,
                  style: 'default'
                })
                super.refresh()
              } else {
                throw 'Failure'
              }
            })
            .catch(() => {
              this.notify({
                signal: 'system-out',
                message: `[SYNC-ERROR]: Fail to add, check network\n`,
                style: 'default'
              })
            })
        break
      }
      case 'finish': {
        const id = args[0]
        const notNotify = args[1] || true
        const tpCom = this.components['tp-' + id]
        tpCom.refresh('drop')
        this.refresh('trash-hide')
        delete this.components['tp-' + id]
        const timepoint = this.dataset.timepoints.filter(tp => String(tp.id) === String(id))[0]
        this.read({
          timepoints: this.dataset.timepoints.filter(tp => String(tp.id) !== String(id))
        })
        if (this.dataset.timepoints.length === 0) {
          this.refresh()
        }
        if (!notNotify) {
          this.notify({
            signal: 'system-out',
            message: `[DROP] ${timepoint.title}
                   Due: ${new Date(timepoint.date).toLocaleString()}
                   ${timepoint.content ? 'Detail: ' + timepoint.content + '\n' : ''}`,
            style: 'drop'
          })
        }
        DataLoader.deleteTimepointById(id)
            .then(() => {
              this.notify({
                signal: 'system-out',
                message: `[SYNC-DROPPED]\n`,
                style: 'default'
              })
            })
            .catch(() => {
              this.notify({
                signal: 'system-out',
                message: `[SYNC-ERROR]: Fail to drop, check network\n`,
                style: 'default'
              })
            })
        break
      }
      default:
        super.refresh()
    }
  }
}