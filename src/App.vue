<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary " style="background-color: #3D5A80">
    <div class="container-fluid">
      <a id="white-text" class="navbar-brand" href="#">BOOKIT</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="my-router-style" to="/">Home</router-link>
          </li>
          <li class="nav-item" v-if="user">
            <router-link class="my-router-style" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="my-router-style" to="/calendar">Calendar</router-link>
          </li>
          <li class="nav-item" v-if="!user">
            <router-link class="my-router-style" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'Client'">
            <router-link class="my-router-style" to="/agenda">Agenda</router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'Administrator'">
            <router-link class="my-router-style" to="/adminremovelessons">Remove lessons</router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'Administrator'">
            <router-link class="my-router-style" to="/addteachingspage">Add teachings</router-link>
          </li>
        </ul>
      </div>
    </div>

    <button @click="isModalOpen = true" v-if="user" class="my-button" style="margin-right: 5px">
      Sign out
      <div class="arrow-wrapper">
        <div class="arrow"></div>
      </div>
    </button>
  </nav>
  <router-view/>
  <Teleport to="#modal">
    <div class="modal-bg d-flex justify-content-center align-items-center" v-if="isModalOpen">
      <div class="my-modal position-relative" v-click-away="onClickAway">
        <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                @click="isModalOpen = false"></button>
        <p>Are you sure you want to log out?</p>
        <button type="button" class="btn btn-primary" @click="handleLogOut">Sign out</button>
      </div>
    </div>
  </Teleport>
</template>


<script>

import axios from "axios";


export default {

  data() {
    return {
      isModalOpen: false
    }
  }, methods: {
    onClickAway(event) {
      this.isModalOpen = false;
    },
    async handleLogOut() {
      this.$store.commit('clear');
      localStorage.clear();
      try {
        const response = await axios.post('ServletLogin', null, {params: {action: 'logout'}, withCredentials: true});
      } catch (e) {
        console.error(e);
      }
      this.isModalOpen = false
      this.$router.push('/')
    },
  },
  created() {
    const res = localStorage.getItem('session');
    if (res) {
      this.$store.commit('setInit', JSON.parse(res));
    }
  },
  computed: {
    user() {
      return this.$store.getters.userdata
    }
  }
}
</script>


<style>


@font-face {
  font-family: MyMontSerrat;
  src: url("../public/fonts/Montserrat/Montserrat-Regular.ttf");
}

#app {
  font-family: MyMontSerrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1A1A1C;
  height: 100%;
}


nav {
  padding: 30px;
  text-align: center;
}

#white-text {
  color: white;
}

nav a {
  font-weight: bold;
  color: #FFFFFF;
}

.nav-item {
  margin-right: 15px;
}

nav a.router-link-exact-active {
  color: #293241;
}

.my-router-style {
  text-decoration: none !important;
}


.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.my-modal {
  background: white;
  padding: 50px 100px;
  border-radius: 5px;
  box-shadow: 0px 10px 5px 2px rgba(0, 0, 0, 0.1);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.my-button {
  overflow: hidden;
  white-space: nowrap;
  --primary-color: #293241;
  --secondary-color: #fff;
  --hover-color: #111;
  --arrow-width: 10px;
  --arrow-stroke: 2px;
  box-sizing: border-box;
  border: 0;
  border-radius: 20px;
  color: var(--secondary-color);
  padding: 0.5em 0.8em;
  background: var(--primary-color);
  display: flex;
  transition: 0.2s background;
  align-items: center;
  gap: 0.6em;
  font-weight: bold;
}

.my-button .arrow-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-button .arrow {
  margin-top: 1px;
  width: var(--arrow-width);
  background: var(--primary-color);
  height: var(--arrow-stroke);
  position: relative;
  transition: 0.2s;
}

.my-button .arrow::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  border: solid var(--secondary-color);
  border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
  display: inline-block;
  top: -3px;
  right: 3px;
  transition: 0.2s;
  padding: 3px;
  transform: rotate(-45deg);
}

.my-button:hover {
  background-color: var(--hover-color);
}

.my-button:hover .arrow {
  background: var(--secondary-color);
}

.my-button:hover .arrow:before {
  right: 0;
}

</style>

