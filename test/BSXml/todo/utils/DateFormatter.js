export default class DateFormatter {
  static format (date = 0, formatter = '') {
    date = new Date(String(date))
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = date.getDay()
    const weekEnStr = ['Sun', 'Mon', 'Tue', 'Wes', 'Thu', 'Fri', 'Sat'][week]
    const weekZhStr = ['日', '一', '二', '三', '四', '五', '六'][week]
    const hour = date.getHours()
    const hourStr = String(hour).padStart(2, '00')
    const minute = date.getMinutes()
    const minuteStr = String(minute).padStart(2, '00')
    const second = date.getSeconds()
    const secondStr = String(second).padStart(2, '00')
    const millisecond = date.getMilliseconds()
    const time = date.getTime()
    switch (formatter) {
      default:
        return `${hourStr}:${minuteStr} · ${weekEnStr} · ${month}/${day}`
    }
  }
}