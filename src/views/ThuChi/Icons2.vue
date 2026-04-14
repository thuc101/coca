<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./Icons2.vue').default"
      :btnText="`Code Icons2 [${level}]`"></raw-loader>
    <h4>This is Tpl</h4>
    level : {{ level }}

    <ul>
      <li v-for="x in ds" :key="x.id" class="my-1">
        {{ x.label }} - {{ x.id }}
        <button @click="copyIcon(x.label)">copy</button>
      </li>
    </ul>

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
  data() {
    return {

      ds: [
        { id: 'Home', label: '🏠' },
        { id: 'Dashboard', label: '📊' },
        { id: 'Analytics', label: '📈' },
        { id: 'Admin', label: '🖥️' },
        { id: 'Settings', label: '⚙️' },

        { id: 'Product', label: '📦' },
        { id: 'Cart', label: '🛒' },
        { id: 'Tag', label: '🏷️' },
        { id: 'List', label: '📋' },
        { id: 'Folder', label: '📁' },

        { id: 'User', label: '👤' },
        { id: 'Users', label: '👥' },
        { id: 'Login', label: '🔐' },
        { id: 'Key', label: '🔑' },
        { id: 'Logout', label: '🚪' },

        { id: 'Phone', label: '📞' },
        { id: 'Mail', label: '✉️' },
        { id: 'Chat', label: '💬' },
        { id: 'Email', label: '📧' },

        { id: 'Money', label: '💰' },
        { id: 'Card', label: '💳' },
        { id: 'Loss', label: '📉' },
        { id: 'Profit', label: '📈' },
        { id: 'Invoice', label: '🧾' },

        { id: 'Tools', label: '🛠️' },
        { id: 'Fix', label: '🔧' },
        { id: 'Test', label: '🧪' },
        { id: 'Deploy', label: '🚀' }
      ],


    }
  },

methods: {
  async copyIcon(icon) {
    try {
      await navigator.clipboard.writeText(icon)
      console.log('Copied:', icon)
      // nếu có toast thì show ở đây
    } catch (err) {
      console.error('Copy failed', err)

      // fallback cho browser cũ
      const textarea = document.createElement('textarea')
      textarea.value = icon
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }
}








}
</script>
