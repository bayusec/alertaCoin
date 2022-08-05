<template>
  <div class="container mt-5">
    <div class="text-bg-dark p-4 rounded">
      <h2>Configurar alerta de precios por monedas</h2>
      <div v-if="!switchState" class="form-check form-switch mt-4">
        <input class="form-check-input" type="checkbox" role="switch" id="switchNotification" v-model="switchState"
               @change="toggleNotification">
        <label class="form-check-label" for="switchNotification">Habilitar Notificaciones de Navegador</label>
      </div>
    </div>

    <div v-if="watchCoins.length>0" v-for="(chunk, index) of arrayChunk(watchCoins,3)"
         class="row justify-content-center mt-3">
      <div v-for="(coin) of chunk"
           class="card col-lg-4 m-3" style="width: 18rem;">
        <div class="card-header">
          {{ coin.name }}
        </div>
        <ul class="list-group list-group-flush ">
          <li class="list-group-item container">
            <div class="row">
              <PriceComponent :coin="coin.name"/>
            </div>
            <div class="row mt-2">
              <span class="col-12">Min:<input :ref="coin.name+'_min'" class="form-control col-auto" type="number"
                                              min="0" :value="coin.minPrice"></span>
              <span class="col-12">Max:<input :ref="coin.name+'_max'" class="form-control col-auto" type="number"
                                              min="0" :value="coin.maxPrice"></span>
            </div>
            <div class="row my-3 justify-content-center">
              {{ coin.min_price }}
              <button @click="saveMinMax(coin.name)"
                      class="col-auto btn btn-warning btn-sm">Crear Alerta
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import {mapState} from "vuex";
import PriceComponent from '@/components/Price'

export default {
  name: "Alertas",
  data() {
    return {
      switchState: false,
    }
  },
  components: {
    PriceComponent
  },
  mounted() {
    this.checkNotificacionPermission()
  },
  computed: {
    ...mapState('Monedas', ['watchCoins'])
  },
  methods: {
    addAlert(data) {
      this.$store.dispatch('Monedas/addAlertToCoin', data)
    },

    toggleNotification(state) {
      this.checkNotificacionPermission()
    },
    checkNotificacionPermission() {
      try {
        Notification.requestPermission().then((result) => {
          if (result == 'granted') this.switchState = true
        })
      } catch (e) {
        this.switchState = false

      }
    },
    arrayChunk(arr, chunkSize) {
      let globalArr = []
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize)
        globalArr.push(chunk)
      }
      return globalArr
    },
    saveMinMax(coin) {
      const minPrice = this.$refs[coin + '_min'][0].value
      const maxPrice = this.$refs[coin + '_max'][0].value
      this.addAlert({name: coin, 'minPrice': minPrice, 'maxPrice': maxPrice})
    }
  }
}
</script>

<style scoped>

</style>