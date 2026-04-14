<template>
  <div style="max-width:300px;margin:100px auto">
    <h3>Login</h3>

    <input v-model="user" placeholder="username" class="w3-input w3-border mb-1" />
    <br />

    <input v-model="pass" type="password" placeholder="password" class="w3-input w3-border mb-1" />
    <br />

    <button class="w3-button w3-blue w3-block" @click="login">
      Login
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
      pass: ''
    }
  },

  methods: {
    login() {
      const u = String(this.user).trim().toLowerCase()
      const p = String(this.pass).trim().toLowerCase()

      const accounts = {
        admin:   { level: 9, name: 'Admin' },
        manager: { level: 5, name: 'Manager' },
        staff:   { level: 2, name: 'Staff' },
        user:    { level: 1, name: 'User' }
      }

      const acc = accounts[u]

      if (acc && p === u) {
        localStorage.setItem('token', '123')

        localStorage.setItem('user', JSON.stringify({
          username: u,
          level: acc.level,
          name: acc.name
        }))

        this.$router.push({ name: 'home' })
      } else {
        alert('Sai tài khoản! (admin/admin, user/user, staff/staff)')
      }
    }
  }
}
</script>