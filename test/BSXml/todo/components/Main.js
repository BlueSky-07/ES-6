import BSComponent from '//node.com/modules/BSXml/BSComponent.js'
import Timeline from './timeline/Timeline.js'
import Viewer from './viewer/Viewer.js'
import Console from './console/Console.js'

export default class Main extends BSComponent {
  constructor() {
    super()
    this.template = `
      div #main-panel {
        @Timeline timeline
        @Viewer viewer
        @Console console
      }
    `
    this.need = {
      Timeline, Viewer, Console
    }
    this.listen = {
      view: (signal) => {
        this.components.viewer.refresh('load', signal)
      },
      'new-timepoint': (signal) => {
        this.components.timeline.refresh('add', signal.timepoint)
      },
      'system-out': (signal) => {
        this.components.console.refresh('system-out', signal.message, signal.style)
      },
      finish: (signal) => {
        this.components.timeline.refresh('finish', signal.id)
      }
    }
    this.style = `
      body {
        margin: 0;
        background-color: #eee;
      }
      
      *::selection {
        background-color: transparent;
      }
    `
  }
  
  refresh(command, ...args) {
    switch (command) {
      case 'show':
        this.components.viewer.refresh('hide')
        this.el.hidden = ''
        break
      default:
        super.refresh()
    }
  }
  
  afterPaint() {
    this.components.console.refresh('focus')
  }
}
