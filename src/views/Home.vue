<template>
  <div class="home">
    <div class="overlay">
      <h1>This is Home view</h1>
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 🌿 NATURE DESKTOP */
  background-image: url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* overlay giúp dễ đọc chữ */
.overlay {
  text-align: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 30px;
  border-radius: 12px;
  color: #fff;
  backdrop-filter: blur(4px);
}

img {
  width: 120px;
  margin-top: 15px;
}

/* 📱 MOBILE */
@media (max-width: 768px) {
  .home {
    background-image: url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1080&q=80");
  }

  .overlay {
    width: 90%;
    padding: 20px;
  }

  img {
    width: 90px;
  }
}
</style>