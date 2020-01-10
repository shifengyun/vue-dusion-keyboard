export const vDrag = {
  update: function (el, value, vNode) {
    const on = value.value.switch // 开关
    let firstUse = true // 初始化
    let startX = el.offsetLeft
    let startY = el.offsetTop
    let disX = 0
    let disY = 0
    let firstTime = '',
      lastTime = '';
    el.ontouchstart = function (e) {
      if (on && firstUse) {
        firstUse = false
        // 记录dom初始位置
        startX = el.offsetLeft
        startY = el.offsetTop

        // 鼠标按下，计算当前元素距离可视区的距离
        disX = e.touches[0].clientX - el.offsetLeft
        disY = e.touches[0].clientY - el.offsetTop
      } else if (on) {
        disX = e.touches[0].clientX - el.offsetLeft
        disY = e.touches[0].clientY - el.offsetTop
      }
    }
    el.ontouchmove = function (e) {
      if (on) {
        // 通过事件委托，计算移动的距离
        let left = e.touches[0].clientX - disX
        let top = e.touches[0].clientY - disY

        // 移动当前元素
        el.style.transition = 'all .01s ease-out'
        el.style.left = left + 'px'
        el.style.top = top + 'px'

      }
    }
    el.ontouchend = function (e) {
      //   e.preventDefault()
      // 恢复初始位置
      //   el.style.left = startX + 'px'
      //   el.style.top = startY + 'px'
    }
  }
}
