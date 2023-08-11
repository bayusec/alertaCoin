<script setup>
import { OnClickOutside } from '@vueuse/components'
</script>

<!--@TODO FIX
-cambiar base url del fichero en live.
-Cambiar el favicon
-->

<template>
  <div class=" vh-100 mh-100">
    <div class="container-fluid text-bg-dark rounded mt-5 p-4 ">
      <div id="searchHelp" class="form-text">
        <span class="text-light fs-5">Filtre y seleccione el simbolo de la moneda que desea agregar.</span>
      </div>

      <OnClickOutside  @trigger="clearSearch" :class="openSearch?'openSearch':'closeSearch'">

        <input @keyup="filterCoins($event.target.value)" placeholder="Ex: BTCUSDT"
               class="form-control mt-3" type="text" aria-describedby="searchHelp">

        <div v-if="resultSearchCoins.length>0"
             class="mt-0 container-fluid rounded-bottom" id="results">
          <div v-for="(coin,index) in resultSearchCoins" :key="index"
               class="row">
            <span class="col-12 itemSearch form-control" @click="addCoinToWatch(coin)">{{ coin }}</span>
          </div>
        </div>
      </OnClickOutside>
    </div>


    <div v-if="watchCoins.length>0" id="watchedCoins" class="container mt-5 text-white">
      <h1>Monedas agregadas</h1>
      <ul class="list-group mt-4">
        <li class="list-group-item container"
            v-for="(wCoin, index) of watchCoins" :key="index">
          <div class="row justify-content-around">
            <span class="col-4">{{ wCoin.name }} </span>
            <button class="col-auto text-center btn btn-danger btn-sm" @click="deleteCoin(wCoin.name)">(-)</button>
          </div>
        </li>
      </ul>

    </div>

  </div>


</template>

<script>
import {mapState,mapGetters, mapActions} from 'vuex'


export default {
  name: 'Monedas',
  data() {
    return {
      resultSearchCoins: [],
      openSearch:false
    }
  },
  mounted() {
    this.getAllCoins()
  },
  computed: {
    ...mapGetters('Monedas', ['getAppCoins']),
    ...mapState('Monedas',['watchCoins'])
  },
  methods: {
    ...mapActions('Monedas', ['getAllCoins','saveWatchCoin','deleteWatchCoin']),

    filterCoins(txt) {
      if(txt.length>=2){
        this.openSearch = true
        if (this.getAppCoins) {
          this.resultSearchCoins = this.getAppCoins.filter(e => e.startsWith(txt.toUpperCase()))
        }
      }
    },
    clearSearch() {
      this.openSearch=false
      this.resultSearchCoins=[]
    },
    addCoinToWatch(coin) {
      this.saveWatchCoin({name:coin})
      this.clearSearch()
    },
    deleteCoin(coin){
      const newCoins = this.watchCoins.filter(e=>e.name!=coin)
      this.deleteWatchCoin(newCoins)
    }
  }
}
</script>
<style scoped>
.openSearch input{
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-width: 0px;
}
.closeSearch input{
  border-radius: .375rem;
}
.openSearch span{
  border-radius: 0;
}
.itemSearch{
  background: white;
  border-left: none;
  cursor: pointer;
}
.itemSearch:hover {
  background: #e7e7e7;
}
</style>
