export default class CommandHandler {
  current() {
    const date = new Date()
    this.year = date.getFullYear()
    this.month = date.getMonth() + 1
    this.day = date.getDate()
    this.week = date.getDay()
    this.hour = date.getHours()
    this.minute = date.getMinutes()
    this.second = date.getSeconds()
    this.time = date.getTime()
    this.date = date
    this.today = new Date(
        this.year + '/' +
        this.month + '/' +
        this.day
    )
  }
  
  handle(command = '') {
    this.current()
    if (command.length === 0) {
      return ['type any command to start, \'help\' for manual.']
    }
    if (command === 'help') {
      return [
        `try these commands:
          [Today]
          17:00 !meeting at 205, 2F; topic: new app
          +3:00 rest take a rest after 3 hours working
          [Tomorrow]
          tmw 15:00 !dentist Mr.Donald, 3601, Main Street
          [Next]
          fri 17:00 barbecue buy 3 boxes of beer
          `
        , 'tip']
    }
    try {
      return this.after(command)
    } catch (e) {
      if (e !== 'not match') {
        return [e, 'error']
      }
    }
    try {
      return this.at(command)
    } catch (e) {
      if (e !== 'not match') {
        return [e, 'error']
      }
    }
    return ['command not found, \'help\' for manual.']
  }
  
  after(command = '') {
    if (command.startsWith('+')) {
      command = command.slice(1)
      return this.at(command, {after: true})
    }
    const cmdlc = command.toLowerCase()
    if (
        cmdlc.startsWith('tmw ') ||
        cmdlc.startsWith('tomorrow ') ||
        cmdlc.startsWith('明天 ')
    ) {
      command = command.split(' ').slice(1).join(' ')
      return this.at(command, {offset: 1})
    }
    if (WEEKDAY.has(cmdlc.split(' ')[0])) {
      const weekday = WEEKDAY.get(cmdlc.split(' ')[0])
      if (weekday > this.week) {
        return this.at(command.split(' ').slice(1).join(' '), {offset: weekday - this.week})
      } else {
        return this.at(command.split(' ').slice(1).join(' '), {offset: weekday - this.week + 7})
      }
    }
    throw 'not match'
  }
  
  at(command = '', {after = false, offset = 0} = {}) {
    const time = command.split(' ')[0] || ''
    let hour = -1
    let minute = -1
    let second = 0
    do {
      if (FORMATTER.hm.test(time)) {
        hour = Number.parseInt(time.split(':')[0])
        minute = Number.parseInt(time.split(':')[1])
        if (offset) {
          break
        }
        if (after) {
          second = this.second
          minute += this.minute
          if (minute >= 60) {
            hour++
            minute %= 60
          }
          hour += this.hour
          if (hour > 24) {
            offset = 1
            hour %= 24
            break
          }
        }
        if (hour < this.hour ||
            (hour === this.hour && minute < this.minute)
        ) {
          return [time + ' has passed!', 'alarm']
        } else if (hour === this.hour && minute === this.minute) {
          return [time + ' is current!', 'alarm']
        }
      }
    } while (false)
    if (hour !== -1 && minute !== -1) {
      const alarmDate = new Date(
          this.today.getTime() + 1000 * (hour * 3600 + minute * 60 + second + offset * 3600 * 24)
      )
      return this.act(command.slice(time.length + 1), alarmDate)
    }
    throw 'not match'
  }
  
  act(command = '', date = new Date()) {
    let [title, ...content] = command.split(' ')
    let priority = 0
    content = content.join(' ')
    if (title.startsWith('!')) {
      title = title.slice(1)
      priority = 1
    }
    content = content || ''
    const timepoint = {
      title, content, priority, date
    }
    return [
      `[NEW] ${title}
      Due: ${date.toLocaleString()}
      ${content ? 'Detail: ' + content + '\n' : ''}`,
      'new',
      timepoint
    ]
  }
}

const FORMATTER = {
  hm: /^([0-1]\d|2[0-3]|\d):([0-5]\d)$/
}

const WEEKDAY = new Map([
  ['sun', 0],
  ['mon', 1],
  ['tue', 2],
  ['wes', 3],
  ['thr', 4],
  ['fri', 5],
  ['sat', 6]
])