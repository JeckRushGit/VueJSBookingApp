<template>
  <div v-if="!offline">
    <div class="d-flex flex-row">
      <div class="my-spacer"></div>
      <div class="inner-container d-flex mt-5 align-items-center flex-column">
        <template v-if="userdata">
          <h1>Profile page</h1>
          <div class="mt-5">
            <p>Email : {{ userdata.email }}</p>
            <p>Name : {{ userdata.name }}</p>
            <p>Surname : {{ userdata.surname }}</p>
            <p>Birthday : {{ userdata.birthday }}</p>
            <p>Profession : {{ userdata.profession }}</p>
          </div>
        </template>
        <template v-else>
          <LoadingCircle/>
        </template>
      </div>
      <div class="my-spacer"></div>
    </div>
  </div>
  <div v-else>
    <p class="m-1">Service not available, try again later</p>
  </div>
</template>


<script>


import axios from "axios";
import LoadingCircle from "@/components/LoadingCircle.vue";

export default {
  name: 'About',
  components: {
    LoadingCircle
  },
  data() {
    return {
      userdata: null,
      offline : false
    }
  },
  async created() {
    try {
      const response = await axios.get('ServletGetUserInfo');
      this.userdata = response.data;
    } catch (e) {
      if(e.response){
        if(e.response.status === 401){
          this.$handle_session_expired()
        }
      }else{
        this.offline = true;
      }
    }
  }
}
</script>


<style>
.inner-container {
  flex-grow: 2;
}


.my-spacer {
  flex-grow: 4;
}
</style>
