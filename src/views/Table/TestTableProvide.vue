<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./TestTableProvide.vue').default"
        :btnText="`Code TestTableProvide [${level}]`"></raw-loader>
    <h4>This is Tpl</h4>
    level : {{ level }}
    <TableProvider></TableProvider>
  </div>
</template>

<script>
import TableProvider from './Com_2/TableProvider.vue'

export default {
  name: 'HomeView',
  components: {
    TableProvider
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
