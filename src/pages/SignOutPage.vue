<template>
  <form @submit.prevent="handleLogOut">
    <input type="submit" class="btn btn-primary" value="Sign out">
  </form>
</template>

<script>
import axios from "axios";

export default {
  name: "SignOutPage",
  methods : {
    async handleLogOut(){
      this.$store.commit('clear');
      localStorage.clear();
      try {
        const response = await axios.post('ServletLogin',null,{params :{ action : 'logout'},withCredentials : true});
      }catch (e){
        console.error(e);
      }
      this.$router.push('/')
    },
  },
}
</script>
