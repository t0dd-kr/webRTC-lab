import { createStore } from 'vuex'
import { useMouse } from '@vueuse/core'
const { x , y } = useMouse()

export default createStore({
  state() {
    return {
      mouseX: x,
      mouseY: y,
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {
    
  }
})