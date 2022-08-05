import axios from 'axios'
import {mapActions, mapMutations} from "vuex";

export const session = axios.create({
    baseURL: 'https://api.binance.com',
});

export default {
    namespaced:true,
    state: {
        listCoins:[],
        watchCoins:[]
    },
    methods:{
        ...mapMutations('wsPrecios',['closeConnection']),
        ...mapActions('wsPrecios',['wsGetCoinPrices']),
    },
    getters:{
        getAppCoins(state){
            if(state.listCoins.symbols) {
                return state.listCoins.symbols.filter(e => e.symbol.endsWith('USDT')&& e.status=="TRADING").map(e=>e.symbol);
            }
        }
    },
    mutations:{
        pushListCoins(state, listCoins){
            state.listCoins = listCoins
        },
        sortWatchCoins(state){
            state.watchCoins.sort((a,b)=>{
                const fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
                if (fa < fb) return -1;
                if (fa > fb) return 1;
                return 0;
            })
        }
    },
    actions:{
        getAllCoins: async function (context){
            const response = await session.get('/api/v3/exchangeInfo').then(function (res){
                if(res.status==200){
                    context.commit('pushListCoins', res.data)
                }
                else return false
            });
        },
        saveWatchCoin({dispatch, commit, state, rootState},data){
            const cIndex = state.watchCoins.find(c=>c.name===data.name)
            if(!cIndex){
                state.watchCoins.push({
                        'name':data.name,
                        'price':0,
                        'minPrice':data.minPrice?data.minPrice:0,
                        'maxPrice':data.maxPrice?data.maxPrice:0
                })
                dispatch('wsPrecios/wsGetCoinPrices',false,{root:true})
                commit('sortWatchCoins')
                localStorage.setItem('Coins',JSON.stringify(state.watchCoins))
            }
        },
        deleteWatchCoin({dispatch, commit, state, rootState},data){
            state.watchCoins = []
            localStorage.clear()
            commit('wsPrecios/closeConnection', false, {root:true})
            if(data.length>0) data.forEach(e=>dispatch('saveWatchCoin',e))
        },
        addAlertToCoin({state},data){
            state.watchCoins.find(e=>{
                if(e.name==data.name){
                    e.minPrice=data.minPrice
                    e.maxPrice=data.maxPrice
                }
            })
        }
    }
}