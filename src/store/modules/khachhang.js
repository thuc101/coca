import { dbService } from '@/db/dbService'

export default {
  namespaced: true,

  state: {
    items: [],
    rawItems: [],

    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 1,

    keyword: ''
  },

  getters: {
    All: s => s.items,
    Page: s => s.page,
    TotalPages: s => s.totalPages,
    Keyword: s => s.keyword
  },

  mutations: {

    SET_PAGING(state, res) {
      state.items = res.data
      state.page = res.page
      state.pageSize = res.pageSize
      state.total = res.total
      state.totalPages = res.totalPages
    },

    SET_KEYWORD(state, keyword) {
      state.keyword = keyword
    },

    SET_RAW(state, data) {
      state.rawItems = data
    }

  },

  actions: {

    // =========================
    // LOAD
    // =========================
    async LoadPaging({ commit, state }, payload = {}) {

      const page = payload.page || 1
      const pageSize = payload.pageSize || state.pageSize
      const keyword = payload.keyword ?? state.keyword

      //commit('SET_KEYWORD', keyword)

      // 🔥 LOAD FULL TABLE
      const allData = await dbService.getAll('KhachHang')

      commit('SET_RAW', allData)

      let data = allData

      // 🔍 SEARCH
      if (keyword && keyword.trim() !== '') {
        const kw = keyword.toLowerCase()

        data = data.filter(x =>
          (x.Ten || '').toLowerCase().includes(kw)
        )
      }

      // 📄 PAGING
      const total = data.length
      const totalPages = Math.ceil(total / pageSize)

      const start = (page - 1) * pageSize
      const paged = data.slice(start, start + pageSize)

      commit('SET_PAGING', {
        data: paged,
        page,
        pageSize,
        total,
        totalPages
      })

      return paged
    },

    // =========================
    // INSERT
    // =========================
    async Insert({ dispatch }, item) {
      await dbService.insert('KhachHang', item)
      dispatch('LoadPaging')
    },

    // =========================
    // UPDATE
    // =========================
    async Update({ dispatch }, item) {
      await dbService.update('KhachHang', item)
      dispatch('LoadPaging')
    },

    // =========================
    // DELETE
    // =========================
    async Delete({ dispatch }, id) {
      await dbService.delete('KhachHang', id)
      dispatch('LoadPaging')
    }

  }
}