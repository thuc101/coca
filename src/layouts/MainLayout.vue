<template>
  <div class="app-wrapper">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

      <router-link class="navbar-brand" to="/home">
        My App
      </router-link>

      <button class="navbar-toggler" @click="toggleMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: isOpen }">

        <!-- LEFT MENU -->
        <ul class="navbar-nav mr-auto">

          <li
            v-for="route in menuRoutes"
            :key="route.path"
            class="nav-item"
            :class="{
              dropdown: hasChildren(route),
              active: isActive(route)
            }"
          >

            <!-- DROPDOWN -->
            <template v-if="hasChildren(route)">

              <a
                href="#"
                class="nav-link dropdown-toggle d-flex align-items-center"
                @click.prevent="toggleDropdown(route)"
              >
                <span class="icon">{{ route.meta?.icon }}</span>
                <span>{{ route.meta?.title }}</span>
              </a>

              <!-- ⚡ CHANGED: v-show instead of v-if -->
              <div
                class="dropdown-menu"
                :class="{ show: isMenuOpen(route) }"
              >

                <div v-for="child in route.children" :key="child.path">

                  <router-link
                    class="dropdown-item d-flex align-items-center"
                    :to="getChildPath(route, child)"
                    :class="{ active: isChildActive(route, child) }"
                    @click.native="handleChildClick"
                  >
                    <span class="icon">{{ child.meta?.icon }}</span>
                    <span>{{ child.meta?.title }}</span>
                  </router-link>

                  <div
                    v-if="child.meta?.divider"
                    class="dropdown-divider"
                  ></div>

                </div>

              </div>
            </template>

            <!-- NORMAL -->
            <template v-else>
              <router-link
                class="nav-link d-flex align-items-center"
                :to="getPath(route)"
                active-class="active"
                @click.native="handleMenuClick"
              >
                <span class="icon">{{ route.meta?.icon }}</span>
                <span>{{ route.meta?.title }}</span>
              </router-link>
            </template>

          </li>

        </ul>

        <!-- RIGHT -->
        <ul class="navbar-nav ml-auto right-box">

          <li v-if="user" class="nav-item user-info">
            👤 {{ user.name }} (Lv{{ user.level }})
          </li>

          <li v-if="user" class="nav-item">
            <button class="btn btn-danger btn-sm" @click="logout">
              Logout
            </button>
          </li>

          <li v-else class="nav-item">
            <router-link class="btn btn-primary btn-sm" to="/login">
              Login
            </router-link>
          </li>

        </ul>

      </div>
    </nav>

    <!-- BREADCRUMB -->
    <div class="page-header bg-white border-bottom px-3 py-2">
      <nav class="breadcrumb mb-0">
        <span v-for="(t, i) in breadcrumbList" :key="i">
          <span v-if="i !== 0"> / </span>
          <span :class="{ 'text-primary font-weight-bold': i === breadcrumbList.length - 1 }">
            {{ t }}
          </span>
        </span>
      </nav>
    </div>

    <!-- CONTENT -->
    <div class="content container-fluid">
      <router-view />
    </div>

    <!-- FOOTER -->
    <footer class="footer bg-light border-top">
      © {{ year }} My App
    </footer>

  </div>
</template>

<script>
import { routes } from '@/router/routes'

export default {
  name: 'MainLayout',

  data() {
    return {
      year: new Date().getFullYear(),
      authKey: 0,
      isOpen: false,
      openMenu: null
    }
  },

  computed: {
    user() {
      this.authKey
      try {
        return JSON.parse(localStorage.getItem('user')) || null
      } catch {
        return null
      }
    },

    menuRoutes() {
      const main = routes.find(r => r.path === '/')
      if (!main?.children) return []

      const userLevel = this.user?.level ?? 0

      return main.children
        .map(route => {

          const lv = route.meta?.level ?? 0

          if (route.children) {
            const children = route.children.filter(c => {
              const clv = c.meta?.level ?? 0
              return userLevel >= clv
            })

            if (!children.length) return null
            if (userLevel < lv) return null

            return { ...route, children }
          }

          return userLevel >= lv ? route : null
        })
        .filter(Boolean)
    },

    breadcrumbList() {
      return this.$route.matched
        .filter(r => r.meta?.title)
        .map(r => r.meta.title)
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {

    toggleMenu() {
      this.isOpen = !this.isOpen
    },

    hasChildren(route) {
      return route.children && route.children.length > 0
    },

    isMenuOpen(route) {
      return this.openMenu === route.path
    },

    toggleDropdown(route) {
      this.openMenu = this.openMenu === route.path ? null : route.path
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.openMenu = null
      }
    },

    handleMenuClick() {
      this.isOpen = false
      this.openMenu = null
    },

    handleChildClick() {
      this.isOpen = false
      this.openMenu = null
    },

    getPath(route) {
      return '/' + route.path.replace(/^\//, '')
    },

    getChildPath(route, child) {
      return `/${route.path}/${child.path}`.replace('//', '/')
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      this.authKey++
      this.$router.replace('/home').catch(() => {})
      this.isOpen = false
      this.openMenu = null
    },

    isActive(route) {
      return this.$route.path.startsWith(this.getPath(route))
    },

    isChildActive(route, child) {
      return this.$route.path === `/${route.path}/${child.path}`
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 15px;
}

.footer {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 22px;
  margin-right: 6px;
}

.nav-item {
  position: relative;
}

/* ✅ FIX IMPORTANT */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: #fff;
  z-index: 9999;

  /* 🔥 KEY FIX */
  display: none;
  border-radius: 4px;
  padding: 5px 0;
}

/* SHOW MENU */
.dropdown-menu.show {
  display: block;
}

/* divider */
.dropdown-divider {
  height: 1px;
  margin: 6px 10px;
  background: rgba(0,0,0,0.15);
}

/* active */
.navbar .nav-link.active {
  background: #007bff;
  color: #fff !important;
  border-radius: 4px;
}

.dropdown-item.active {
  background: #007bff;
  color: #fff;
}

.right-box {
  margin-left: auto !important;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  color: #fff;
}

@media (max-width: 991px) {
  .navbar-collapse {
    background: #343a40;
  }
}
</style>