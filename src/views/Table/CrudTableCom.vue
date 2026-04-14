<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./CrudTableCom.vue').default"
        :btnText="`Code CrudTableCom [${level}]`"></raw-loader>
    <h4>This is Tpl</h4>
    level : {{ level }}
    <crud-table-com v-model="ct" ></crud-table-com>
  </div>
</template>

<script>
import CrudTableCom from './Com_2/CrudTableCom.vue';
import { hoaDonService } from '@/db/hoaDonService';


export default {
  name: 'HomeView',
  components: {
    CrudTableCom
  },
  data(){
    return{
      ct:[],
    }
  },
  async mounted(){
    this.ct= await hoaDonService.getAll()
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user') || '{}')
    },
    level() {
      return this.user.level || 0
    }
  },







}
</script>
