<template>
  <div class="p-4">
    <h2>🗂 DB Explorer</h2>

    <!-- {{ dbTree }}     -->
    <ul>
      <li v-for="x in dbTree" >
        <span style="background-color: silver; padding: 4px;" class="mr-1" >{{ x.name }}</span>
        <button @click="dropDb(x.name)" style="color:red">Delete</button>
        <div>
          <!-- {{ x.stores }} -->
          <!-- <ul>
            <li v-for="y in x.stores">
              {{ y }}
            </li>
          </ul> -->
          <div v-for="y in x.stores" style=" display: inline-block; border: 1px solid blue; padding: 3px; margin: 3px; " >
            {{ y.name }} ( {{y.count}} )<br>
            <!-- <button class="mr-1">View</button>
            <button class="mr-1">Clear</button> -->

            <button class="mr-1" @click="loadData(x.name, y.name)">View</button>
            <button class="mr-1" @click="clear(x.name, y.name)">Clear</button>


            <!-- { "name": "Ban", "count": 3 }  -->
          </div>

        </div>
      </li>
    </ul>  
    <hr>
    <!-- ALL DBs + STORES -->
    <!-- <div v-for="db in dbTree" :key="db.name" class="mb-4 border rounded p-3">

      <div class="flex justify-between items-center mb-2">
        <b>{{ db.name }}</b>
        <button @click="dropDb(db.name)" style="color:red">Delete</button>
      </div>

      <div v-for="store in db.stores" :key="store.name" class="ml-3 mb-3">
        <div class="flex justify-between items-center">
          <span>📁 {{ store.name }} ({{ store.count }})</span>
          <div>
            <button @click="loadData(db.name, store.name)">View</button>
            <button @click="clear(db.name, store.name)">Clear</button>
          </div>
        </div>
      </div>



    </div> -->

    <!-- DATA VIEW -->
     <div v-if="items.length">

        <!-- {{ columns }}<br>
        {{ items }}<br> -->
        <button class="mr-1" @click="copyData()">Copy</button>
        <button class="mr-1" @click="copyAsCode()">Copy for seeding</button>
        <b-table :items="items"></b-table>





     </div>
<!--     
    <div v-if="items.length">
      <h3>📄 Data: {{ currentStore }}</h3>

      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th v-for="k in columns" :key="k">{{ k }}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row[idKey]">
            <td v-for="k in columns" :key="k">
              <input v-model="row[k]" />
            </td>
            <td>
              <button @click="save(row)">Save</button>
              <button @click="remove(row)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-2">
        <h4>Add</h4>
        <input v-for="k in columns" :key="k" v-model="newItem[k]" :placeholder="k" />
        <button @click="add">Add</button>
      </div>
    </div>
 -->
  </div>
</template>

<script>
import {
  listDatabases,
  getStores,
  getAllData,
  getStoreInfo,
  deleteRecord,
  upsert,
  clearStore,
  deleteDatabase,
  count
} from '@/db/dbManagerService' //'@/db/dbInspectorService'

export default {
  data() {
    return {
      dbTree: [],
      items: [],
      columns: [],
      idKey: 'id',
      currentDb: '',
      currentStore: '',
      newItem: {}
    }
  },
  async created() {
    await this.loadAll()
  },
  methods: {
    async loadAll() {
      const dbs = await listDatabases()
      const result = []

      for (let db of dbs) {
        const stores = await getStores(db.name)
        const storeObjs = []

        for (let s of stores) {
          const c = await count(db.name, s)
          storeObjs.push({ name: s, count: c })
        }

        result.push({ name: db.name, stores: storeObjs })
      }

      this.dbTree = result
    },

    async loadData(dbName, storeName) {
      this.currentDb = dbName
      this.currentStore = storeName

      const info = await getStoreInfo(dbName, storeName)
      this.items = await getAllData(dbName, storeName)

      if (this.items.length) {
        this.columns = Object.keys(this.items[0])
        this.idKey = info.keyPath || 'id'
      }
    },

    async save(row) {
      await upsert(this.currentDb, this.currentStore, row)
    },

    async remove(row) {
      await deleteRecord(this.currentDb, this.currentStore, row[this.idKey])
      this.loadData(this.currentDb, this.currentStore)
    },

    async add() {
      await upsert(this.currentDb, this.currentStore, this.newItem)
      this.newItem = {}
      this.loadData(this.currentDb, this.currentStore)
    },

    async clear(db, store) {
      if (!confirm('Clear store?')) return
      await clearStore(db, store)
      this.loadAll()
    },

    async dropDb(db) {
      if (!confirm('Delete DB?')) return
      await deleteDatabase(db)
      this.loadAll()
    },
    async copyData() {
      if (!this.items.length) return

      const text = JSON.stringify(this.items, null, 2)

      try {
        await navigator.clipboard.writeText(text)
        alert('Copied!')
      } catch (err) {
        console.error(err)
        alert('Copy failed')
      }
    },

    async copyAsCode() {
      if (!this.items.length) return

      const lines = this.items.map(row => {
        return `store.add(${JSON.stringify(row)})`
      })

      const text = lines.join('\n')

      try {
        await navigator.clipboard.writeText(text)
        alert('Copied code!')
      } catch (e) {
        console.error(e)
        alert('Copy failed')
      }
    },




  }
}
</script>