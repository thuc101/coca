<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>

import VeeValidate from "vee-validate";
import Vue from "vue";
Vue.use(VeeValidate, {
  classes: true,
  fieldsBagName: "veeFields",
});

import moment from "moment";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import axios from "axios";


export default {
  components: {
  },
  async mounted() {

    // console.log('kiểm tra db trước khi vào app')

    // const db = await this.checkDb()

    // if (!db) {
    //   alert('Không mở được database!')
    //   return
    // }

    // console.log('DB OK')

    // // 🔥 count table
    // const tableCount = db.objectStoreNames.length
    // console.log('Số bảng:', tableCount)

    // // 🔥 liệt kê tên bảng luôn
    // const tables = Array.from(db.objectStoreNames)
    // console.log('Danh sách bảng:', tables)


  },
  methods: {

    checkDb() {
      return new Promise((resolve) => {
        const request = indexedDB.open('erp-db', 1)

        request.onerror = () => {
          resolve(null)
        }

        request.onsuccess = () => {
          const db = request.result

          // 🔥 kiểm tra bảng
          // if (!db.objectStoreNames.contains('users')) {
          //   alert('Thiếu bảng users!')
          // }

          resolve(db)
        }

        request.onupgradeneeded = (e) => {
          const db = e.target.result

          // 🔥 tạo bảng nếu chưa có
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'Id' })
          }

          if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', { keyPath: 'Id' })
          }
        }
      })
    }





  }




  /*
  export default {
    async mounted() {
    },
  
    methods: {
  
  
  
  
  
    }
  }
  */






}
</script>