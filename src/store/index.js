import { createStore } from 'vuex'
import Monedas from "@/store/modules/Monedas";
import wsPrecios from "@/store/modules/Precios";

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  modules: {
    Monedas,
    wsPrecios
  },
  watch(){

  }
})
