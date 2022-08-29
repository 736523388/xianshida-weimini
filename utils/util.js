const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const change = t => {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}

const timestampToTime = timestamp => {
  var date = new Date(timestamp * 1000);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = change(date.getDate()) + '';
  let h = change(date.getHours()) + ':';
  let m = change(date.getMinutes()) + ':';
  let s = change(date.getSeconds());
  return Y + M + D ;
}

module.exports = {
  formatTime: formatTime,
  timestampToTime
}
