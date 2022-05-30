import Vue from 'vue'

Vue.directive('img-error', {
  inserted(el, options) {
    el.onerror = function() {
      // console.log('监听到了', el)
      el.src = options.value
    }
  }
})

