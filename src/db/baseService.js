import { getDB } from './db'

export function createService(storeName) {
  return {


    async count() {
      const db = await getDB()
      return await db.count(storeName)
    },

    async getPagingCursor({
      page = 1,
      pageSize = 10,
      keyword = ''
    } = {}) {
      const db = await getDB()
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)

      let all = await store.getAll()

      // 🔥 SEARCH
      if (keyword) {
        const kw = keyword.toLowerCase()
        all = all.filter(x =>
          Object.values(x).some(v =>
            String(v).toLowerCase().includes(kw)
          )
        )
      }

      // 🔥 SORT giảm dần theo Id (PHẢI đặt trước paging)
      all = all.sort((a, b) => b.Id - a.Id)

      const total = all.length

      // paging
      const start = (page - 1) * pageSize
      const items = all.slice(start, start + pageSize)

      return {
        items,
        total
      }
    },

    async getAll() {
      const db = await getDB()
      return await db.getAll(storeName)
    },

    async getById(id) {
      const db = await getDB()
      return await db.get(storeName, id)
    },

    async add(data) {
      const db = await getDB()
      const Id = await db.add(storeName, data)

      return {
        ...data,
        Id
      }
    },

    async update(data) {
      const db = await getDB()
      return await db.put(storeName, data)
    },

    async delete(id) {
      const db = await getDB()
      return await db.delete(storeName, id)
    },

    async clear() {
      const db = await getDB()
      return await db.clear(storeName)
    },

    async where(predicate) {
      const db = await getDB()
      const all = await db.getAll(storeName)
      return all.filter(predicate)
    },

    async count() {
      const db = await getDB()
      return await db.count()
    }



  }
}