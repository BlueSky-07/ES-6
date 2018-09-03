import BSComponent from '//node.com/modules/BSXml/BSComponent.js'
import DataLoader from '../../utils/DataLoader.js'
import {router} from '../../app.js'
import DateFormatter from '../../utils/DateFormatter.js'

export default class Viewer extends BSComponent {
  constructor() {
    super()
    this.template = `
      div .viewer {
        ~ hidden hidden
        div .viewer-container #viewer-container {
          div .viewer-date {
            ! click changeMode
            span #date {
              {{$date}}
            }
          }
          div .viewer-btns {
            div .viewer-btn #btnFinish {
              ! click finish
              ✔️ 完成
            }
            div .viewer-btn #btnClose {
              ! click close
              ❌ 关闭
            }
          }
          div .viewer-icon #priority {
          }
          div .viewer-title {
            span #title {
              {{$title}}
            }
          }
          div .viewer-content {
            p #content {
              {{$content}}
            }
          }
        }
      }
    `
    this.dataset = {
      title: '', content: '', date: '', priority: 0, mode: 0
    }
    this.functions = {
      finish({$this, dataset}) {
        $this.notify({
          signal: 'system-out',
          message:
              `[DONE] ${dataset.title}
              Due: ${new Date(dataset.date).toLocaleString()}
              ${dataset.content ? 'Detail: ' + dataset.content +'\n' : ''}`,
          style: 'finish'
        })
        $this.notify({
          signal: 'finish', id: dataset.id
        })
        router.gotoRouter('/')
      },
      close() {
        router.gotoRouter('/')
      },
      changeMode({dataset, $this}) {
        dataset.mode++
        if (dataset.mode > 1) {
          dataset.mode = 0
        }
        switch (dataset.mode) {
          case 0:
            $this.refresh('date-dynamic')
            break
          case 1:
            $this.refresh('date-static')
        }
      }
    }
    this.style = `
      .viewer {
        width: 100%;
        height: 0;
        position: relative;
        top: -25em;
      }
      
      .viewer-container {
        background-color: #eaeaeaf2;
        height: 20em;
        overflow-y: auto;
        padding: 2.5em 20%;
      }
      
      .viewer-title {
        font-size: 2em;
        max-height: 5rem;
        overflow-y: auto;
      }
      
      .viewer-content {
        margin-top: 1em;
        font-size: 1.5em;
        font-weight: lighter;
        text-align: right;
        max-height: 10rem;
        overflow-y: auto;
      }
      
      .viewer-content p {
        margin: 0;
      }
      
      .viewer-date {
        height: 0;
        font-size: 2.5em;
        color: #999;
        font-weight: lighter;
        user-select: none;
        cursor: pointer;
        text-align: right;
        position: relative;
        top: 18rem;
        right: -15%;
      }
      
      .viewer-btns {
        height: 0;
        user-select: none;
        text-align: left;
        position: relative;
        top: 19rem;
        left: -15%;
      }
      
      .viewer-btn {
        font-weight: bolder;
        width: max-content;
        font-size: 1.25em;
        border-bottom: 0.05em dashed #777;
        display: inline-block;
        margin-right: 1em;
        padding: 0.15em 0;
        color: #777;
      }
      
      .viewer-icon {
        font-size: 2rem;
        height: 0;
        position: relative;
        top: 0;
        left: -15%;
      }
      
      .viewer-btn:hover {
        border-bottom: 0.05em solid #555;
        cursor: pointer;
        user-select: none;
        color: #555;
      }
      
      .viewer-btn:active {
        color: #000;
      }
      
      .viewer-content *::selection,
      .viewer-title *::selection {
        background-color: #333;
        color: #fff;
      }
    `
  }
  
  afterPaint() {
    this.els = {
      title: this.$el('#title'),
      content: this.$el('#content'),
      date: this.$el('#date'),
      btnFinish: this.$el('#btnFinish'),
      container: this.$el('#viewer-container'),
      priority: this.$el('#priority')
    }
  }
  
  refresh(command, ...args) {
    switch (command) {
      case 'load': {
        const {id, timepoint} = args[0] || {id: -1}
        if (timepoint) {
          this.read(timepoint)
          this.els.btnFinish.style.display = 'inline-block'
          this.refresh('show')
          this.notify({
            signal: 'system-out',
            message:`[TODO] ${timepoint.title}
                     Due: ${new Date(timepoint.date).toLocaleString()}
                     ${timepoint.content ? 'Detail: ' + timepoint.content + '\n': ''}`,
            style: 'date'
          })
        } else {
          DataLoader.getTimepointById(id).then(json => {
            if (json.status === 'Not-Found') {
              throw 'Not-Found'
            }
            return this.refresh('load', {timepoint: json})
          }).catch(() => {
            this.refresh('failure')
          })
        }
        break
      }
      case 'failure': {
        this.read({
          title: '载入失败', content: '请刷新重试'
        })
        this.els.btnFinish.style.display = 'none'
        this.refresh('show')
        break
      }
      case 'hide': {
        this.els.container.classList.remove('viewer-in')
        this.els.container.classList.add('viewer-out')
        this.read({
          title: '', content: '', date: '', priority: 0
        })
        setTimeout(() => {
          this.el.hidden = 'hidden'
        }, 500)
        clearInterval(this.clock)
        this.dataset.mode = 0
        break
      }
      case 'show': {
        this.els.title.innerText = this.dataset.title
        this.els.content.innerText = this.dataset.content
        this.els.date.innerText = DateFormatter.format(this.dataset.date)
        this.els.priority.innerText = getPriorityIcon(this.dataset.priority)
        this.els.container.classList.remove('viewer-out')
        this.els.container.classList.add('viewer-in')
        this.el.hidden = ''
        this.refresh('date-dynamic')
        break
      }
      case 'date-static': {
        this.els.date.innerText = DateFormatter.format(this.dataset.date)
        clearInterval(this.clock)
        break
      }
      case 'date-dynamic': {
        const tick = getClock(this.dataset.date)
        this.clock = setInterval(() => {
          const $tick = tick.next()
          if ($tick.done) {
            this.refresh('date-static')
            return
          }
          const {
            week, day, hour, minute, second
          } = $tick.value
          this.els.date.innerText =
              (week ? week + ' week' + (week > 1 ? 's' : '') : '') + ' ' +
              (day ? day + ' day' + (day > 1 ? 's' : '') : '') + ' ' +
              String(hour).padStart(2, '00') + ':' +
              String(minute).padStart(2, '00') + ':' +
              String(second).padStart(2, '00')
          
        }, 1000)
        break
      }
      default:
        super.refresh()
    }
  }
}

const getPriorityIcon = priority => ['❕', '❗'][priority || 0]

function* getClock(date) {
  let total = new Date(date).getTime() - new Date().getTime()
  if (total < 0) {
    return
  }
  total /= 1000
  total = Math.floor(total)
  let week = Math.floor(total / (60 * 60 * 24 * 7))
  total -= week * (60 * 60 * 24 * 7)
  let day = Math.floor(total / (60 * 60 * 24))
  total -= day * (60 * 60 * 24)
  let hour = Math.floor(total / (60 * 60))
  total -= hour * (60 * 60)
  let minute = Math.floor(total / 60)
  total -= minute * 60
  let second = total
  while (week > 0 || day > 0 || hour > 0 || minute > 0 || second > 0) {
    yield {
      week, day, hour, minute, second
    }
    second--
    if (second < 0 && (week > 0 || day > 0 || hour > 0 || minute > 0)) {
      second = 59
      minute--
    } else if (second < 0) {
      second = 0
    }
    if (minute < 0 && (week > 0 || day > 0 || hour > 0)) {
      minute = 59
      hour--
    } else if (minute < 0) {
      minute = 0
    }
    if (hour < 0 && (week > 0 || day > 0)) {
      hour = 23
      day--
    } else if (hour < 0) {
      hour = 0
    }
    if (day < 0 && week > 0) {
      day = 6
      week--
    } else if (day < 0) {
      day = 0
    }
    if (week < 0) {
      week = 0
    }
  }
}