<template>
  <div class="container-fluid text-center mt-5">
    <div v-if="watchCoins.length>0" v-for="(chunk, index) of arrayChunk(watchCoins,3)" class="row justify-content-center">
      <div v-for="(coin) of chunk"
          class="card col-lg-4 m-3" style="width: 18rem;">
        <div class="card-header">
          {{coin.name}}
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <p v-if="coin.price>0">{{coin.price}}</p>
            <p v-else>Cargando...</p>
          </li>
        </ul>
      </div>
    </div>
    <div v-else><p>No has agregado ninguna moneda aún.</p></div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  name: 'Dashboard',
  computed:{
    ...mapState('Monedas',['watchCoins']),
  },
  methods:{
    arrayChunk(arr,chunkSize){

      let globalArr = []
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        globalArr.push(chunk)
      }
      return globalArr
    }
  }
}
</script>
