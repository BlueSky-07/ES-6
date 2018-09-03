import BSComponent from '//node.com/modules/BSXml/BSComponent.js'
import CommandHandler from '../../utils/CommandHandler.js'

export default class Console extends BSComponent {
  constructor() {
    super()
    this.template = `
      div .console {
        p .console-logs #logs {
        }
        textarea #console .console-input {
          ~ dict console
          ~ rows 1
          ! keydown typed
        }
        div .type-symbol #symbol {
          ⌨️
        }
      }
    `
    this.dataset = {
      command: '', commands: [], pos: 0
    }
    this.functions = {
      typed({$this, inputs, event, dataset}) {
        if (event.code === 'Enter') {
          event.preventDefault()
          if (inputs.console.trim().length === 0) {
            return
          }
          dataset.command = inputs.console
          dataset.commands.push(dataset.command)
          dataset.pos = dataset.commands.length
          inputs.console = ''
          $this.refresh('input-line', dataset.command)
          $this.refresh('system-out', ...$this.components.handler.handle(dataset.command))
        } else if (event.code === 'ArrowUp') {
          dataset.pos--
          if (dataset.pos < 0) {
            dataset.pos = 0
          }
          inputs.console = dataset.commands[dataset.pos] || ''
        } else if (event.code === 'ArrowDown') {
          dataset.pos++
          if (dataset.pos > dataset.commands.length - 1) {
            dataset.pos = dataset.commands.length - 1
          } else {
            inputs.console = dataset.commands[dataset.pos] || ''
          }
        } else if (event.code === 'Escape') {
          inputs.console = ''
        } else {
          dataset.pos = dataset.commands.length
        }
      }
    }
    this.style = `
      .console {
        margin-top: 0.25em;
        width: 100%;
        height: 20em;
      }
      
      .console-logs {
        width: 95%;
        height: 80%;
        margin: 0 auto;
        padding: 1em;
        background-color: #333;
        color: #eee;
        line-height: 1.75em;
        font-family: 'Consolas', 'Monaco', 'Arial';
        overflow-y: auto;
        word-break: break-all;
        border-radius: 2px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
      }
      
      .console-logs::-webkit-scrollbar {
        width: 0.5em;
        background-color: transparent;
      }
      
      .console-logs::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.36);
        border-bottom-left-radius: 5em;
        border-bottom-right-radius: 5em;
        background-color: #5f5f5f;
      }
      
      .console-logs::-webkit-scrollbar-thumb {
        border-radius: 1em;
        box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.36);
        background-color: #bfbfbf;
      }
      
      .type-symbol {
        width: 2em;
        height: 2em;
        background-color: #111;
        text-align: center;
        color: #fff;
        position: relative;
        top: -2.5em;
        user-select: none;
      }
      
      .console-input {
        width: 95%;
        height: 1.2em;
        display: block;
        margin: 0.25em auto 0;
        padding: 1em 0 1em 2em;
        background-color: #111;
        color: #fff;
        font-size: 1em;
        font-family: 'Consolas', 'Monaco', 'Arial';
        overflow-y: hidden;
        overflow-x: hidden;
        word-wrap: normal;
        border-radius: 2px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
      }
      
      .console-logs::selection,
      .console-input::selection {
        background-color: #fff;
        color: #000;
      }
    `
  }
  
  afterPaint() {
    this.els = {
      console: this.$el('#console'),
      logs: this.$el('#logs'),
      symbol: this.$el('#symbol')
    }
    window.addEventListener('resize', () => {
      this.els.symbol.style.left = this.els.console.offsetLeft + 0.5 + 'px'
    })
    setTimeout(() => {
      this.els.symbol.style.left = this.els.console.offsetLeft + 0.5 + 'px'
    }, 0)
    this.components.handler = new CommandHandler()
  }
  
  refresh(command, ...args) {
    switch (command) {
      case 'focus': {
        this.els.console.focus()
        break
      }
      case 'input-line': {
        const line = args[0]
        this.els.logs.innerText += '⌨️ <- ' + line + '\n'
        this.els.logs.scrollTo(0, this.els.logs.scrollHeight)
        break
      }
      case 'system-out': {
        const message = args[0]
        const style = getSoutStyle(args[1])
        this.els.logs.innerText += style + ' -> ' + message + '\n'
        this.els.logs.scrollTo(0, this.els.logs.scrollHeight)
        if (args[1] === 'new') {
          const timepoint = args[2]
          this.notify({
            signal: 'new-timepoint', timepoint
          })
        }
        break
      }
      default:
        super.refresh()
    }
  }
}

const getSoutStyle = type => {
  switch (type) {
    case 'ok':
    case 'finish':
      return '✅'
    case 'blub':
    case 'tip':
      return '💡'
    case 'delete':
    case 'drop':
      return '🗑️'
    case 'new':
    case 'date':
    case 'plan':
      return '📍'
    case 'alarm':
      return '⏰'
    case 'wrong':
    case 'error':
      return '💥'
    default:
      return '🗨️'
  }
}