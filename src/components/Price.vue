<template>
  <span class="col-12">Current Price: <span class="ms-3"></span>{{getPrice}}</span>
</template>

<script>
import {mapState} from "vuex";
export default {
  name: "PriceComponent",
  props:{
    coin: String
  },
  computed:{
    ...mapState('Monedas', ['watchCoins']),
    getPrice(){
      return this.watchCoins.find(e=>e.name==this.coin).price
    }
  }
}
</script>

<style scoped>

</style>