<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./Tpl.vue').default"
        :btnText="`Code Tpl [${level}]`"></raw-loader>
    <h4>This is Tpl</h4>
    level : {{ level }}
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  components: {
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
