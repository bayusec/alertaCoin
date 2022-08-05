import {mapState} from "vuex";

export default {
    name: 'wsPrecios',
    namespaced: true,
    state: {
        connection: null,
        precio: 0
    },
    computed: {
        ...mapState('Monedas', ['watchCoins'])
    },
    mutations: {
        setConnection(state, conn) {
            state.connection = conn
        },
        closeConnection(state) {
            console.log("Conexión cerrada")
            state.connection = null
        },
    },
    actions: {
        wsGetCoinPrices({commit, state}) {
            if(this.state.Monedas.watchCoins.length>0){
                const queryCoins = this.state.Monedas.watchCoins.map((e) => e.name).join('@ticker/') + '@ticker'
                const conn = new WebSocket("wss://stream.binance.com:9443/ws/" + queryCoins.toLowerCase())
                commit('setConnection', conn)

                state.connection.onmessage = (message) => {
                    const doc = JSON.parse(message.data)
                    this.state.Monedas.watchCoins.find(e => {
                        if (e.name == doc.s) {
                            e.price = Math.round((parseFloat(doc.c) + Number.EPSILON) * 100) / 100
                        }
                    })
                }

                state.connection.onopen = function (event) {
                    console.log("Se conecto correctamente al ws")
                }

                state.connection.onerror = function (event) {
                    console.error("Error al conectar al WebSocket:", event);
                    commit('closeConnection')
                }
            }
        }
    }

}
