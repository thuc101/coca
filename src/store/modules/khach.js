
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

    async LoadPaging({ commit, state }, payload = {}) {

      const page = payload.page || 1
      const pageSize = payload.pageSize || state.pageSize
      const keyword = payload.keyword ?? state.keyword

      commit('SET_KEYWORD', keyword)

      const allData = await dbService.getAll('Khach')
      commit('SET_RAW', allData)

      let data = allData

      if (keyword && keyword.trim() !== '') {
        const kw = keyword.toLowerCase()

        data = data.filter(x =>
          (x.Ten || '').toLowerCase().includes(kw)
        )
      }

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

    async Insert({ dispatch }, item) {
      await dbService.insert('Khach', item)
      dispatch('LoadPaging')
    },

    async Update({ dispatch }, item) {
      await dbService.update('Khach', item)
      dispatch('LoadPaging')
    },

    async Delete({ dispatch }, id) {
      await dbService.delete('Khach', id)
      dispatch('LoadPaging')
    }

  }
}


/* =====================================================
📌 HƯỚNG DẪN SỬ DỤNG MODULE: Khach
=====================================================

1️⃣ Register store:
   import Khach from './store/Khach.store'
   store.registerModule('Khach', Khach)

2️⃣ Load paging:
   this.$store.dispatch('Khach/LoadPaging', {
     page: 1,
     pageSize: 5,
     keyword: ''
   })

3️⃣ Get list:
   this.$store.getters['Khach/All']

4️⃣ Insert:
   this.$store.dispatch('Khach/Insert', item)

5️⃣ Update:
   this.$store.dispatch('Khach/Update', item)

6️⃣ Delete:
   this.$store.dispatch('Khach/Delete', id)

===================================================== */
