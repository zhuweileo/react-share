const _toString = Object.prototype.toString

//判断是否为纯对象
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

//防抖
export function debounce(fn,delay) {
  let timer
  return function () {
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn(...args)
    },delay)
  }
}

//数组去重
export function noRepeat(arr) {
  const result = []
  arr.forEach((a,index) => {
    if(arr.indexOf(a) === index){
      result.push(a)
    }
  })
  return result;
}
