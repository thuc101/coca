<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./HoaDon.vue').default"
      :btnText="`Code HoaDon [${level}]`"></raw-loader>
    <h4>This is HoaDon</h4>
    level : {{ level }}
    <TableData></TableData>
  </div>
</template>

<script>
import TableData from '../Com/TableData.vue';
export default {
  name: 'HomeView',
  components: {
    TableData
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
