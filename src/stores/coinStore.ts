import { defineStore } from 'pinia'

export const useCoinStore = defineStore('market', {
  state: () => ({
    selectedCoin: null as any
  }),

  actions: {
    setSelectedCoin(coin: any) {
      this.selectedCoin = coin
    }
  }
})