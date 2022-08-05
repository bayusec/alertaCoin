<template>

  <nav class="navbar navbar-expand-lg navbar-dark ">
    <div class="container-fluid m-1">

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarMenu">
        <a class="navbar-brand" href="#/">
          <img class="bg-warning rounded shadow p-1 mt-3 mt-lg-0 " alt="alert" src="./assets/logo.png" width="60"
               height="50">
        </a>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 mt-1 fs-4">
          <li class="nav-item mx-3">
            <router-link class="nav-link active" to="/">Dashboard <span class="d-none d-lg-inline ms-5">|</span></router-link>
          </li>
          <li class="nav-item mx-3">
            <router-link class="nav-link active" to="/monedas">Monedas <span class="ms-5 d-none d-lg-inline">|</span></router-link>
          </li>
          <li class="nav-item mx-3">
            <router-link class="nav-link active" to="/alertas">Alertas <span class="ms-5 d-none d-lg-inline">|</span></router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view/>
</template>

<style>
  body{
    background-color: #121212 !important;
  }
  nav{
    background-color: rgba(var(--bs-dark-rgb));
  }
</style>
<script>
import {mapActions, mapState} from 'vuex'

export default {
  mounted() {

    if (this.connection == null && this.watchCoins.length > 0) {
      console.log(this.connection)
      this.wsGetCoinPrices()
    }
    const localCoins = localStorage.getItem('Coins')
    if (localCoins != null) {
      JSON.parse(localCoins).forEach((e) => {
        this.saveWatchCoin(e)
      })
    }
  },
  computed: {
    ...mapState('Monedas', ['watchCoins']),
    ...mapState('wsPrecios', ['connection'])
  },
  methods: {
    ...mapActions('wsPrecios', ['wsGetCoinPrices']),
    ...mapActions('Monedas', ['saveWatchCoin']),
    alertPrice(coin, limit){
      const text = `Alerta: "${coin}" ${limit} precio.`;
      new Notification('ALERTA DE PRECIOS', { body: text })
      const audio = new Audio('https://assets.mixkit.co/sfx/download/mixkit-doorbell-tone-2864.wav');
      audio.play();
    }
  },
  watch:{
    watchCoins:{
      deep:true,
      handler(newVal) {
        newVal.find(e=>{
          if(e.price>0) {
            if (e.price <= e.minPrice && e.minPrice > 0) {
              this.alertPrice(e.name, 'min')
              e.minPrice = 0
            }
            if (e.price >= e.maxPrice && e.maxPrice > 0) {
              this.alertPrice(e.name, 'max')
              e.maxPrice = 0
            }
          }
        })

        // localStorage.clear()
        localStorage.setItem('Coins',JSON.stringify(newVal))
      }
    }
  }
}
</script>