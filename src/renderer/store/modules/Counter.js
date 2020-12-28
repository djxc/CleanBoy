const state = {
  main: 2,
  lon_x: 120,
  lat_y: 36
}

const mutations = {
  DECREMENT_MAIN_COUNTER(state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER(state) {
    state.main++
  },
  CHANGE_LON_X(state, newLonx) {
    state.lon_x = newLonx
  },
  CHANGE_LAT_Y(state, newLaty) {
    state.lat_y = newLaty
  }
}

const actions = {
  someAsyncTask({ commit }) {
    commit('INCREMENT_MAIN_COUNTER')
  },
  CHANGE_LON_X(context, newLonx) {
    context.commit('CHANGE_LON_X', newLonx)
  },
  CHANGE_LAT_Y(context, newLaty) {
    context.commit('CHANGE_LAT_Y', newLaty)
  }
}

export default {
  state,
  mutations,
  actions
}
