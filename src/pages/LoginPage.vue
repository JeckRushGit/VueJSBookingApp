<template>
  <div v-if="!offline">
    <div class="d-flex flex-row">
      <div class="my-spacer"></div>
      <div class="inner-form d-flex mt-5 justify-content-center flex-column">
        <h1 style="text-align: center">Sign in</h1>
        <form @submit.prevent="handleSubmit">
          <!--      campo email-->
          <div class="mb-3">
            <label for="input1" class="form-label">Email Address</label>
            <input type="email" required="true" class="form-control" id="input1" placeholder="name@example.com"
                   v-model="email">
          </div>
          <!--      campo password-->
          <div class="mb-3">
            <label for="input2" class="form-label">Password</label>
            <input type="password" required="true" class="form-control" id="input2" placeholder="your password"
                   v-model="password">
          </div>
          <!--        bottone submit-->
          <div class="d-flex flex-row justify-content-center flex-fill">
            <input class="btn btn-primary" type="submit" value="Login"/>
          </div>
        </form>
      </div>

      <div class="my-spacer"></div>

    </div>

  </div>
  <div v-else>
    <p class="m-1">Service not available, try again later</p>
  </div>

<!--  pop up credenziali errate-->
  <Teleport to="#modal" v-if="wrongCredentials">
    <div class="modal-bg d-flex justify-content-center align-items-center">
      <div class="my-modal position-relative d-flex flex-column align-items-center" v-click-away="() => wrongCredentials = false">
        <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                @click="wrongCredentials = false"></button>
        <p>Wrong email or password</p>
      </div>
    </div>
  </Teleport>
</template>

<script>

import axios from "axios";

export default {
  name: "LoginPage",

  data() {
    return {
      email: '',
      password: '',
      offline : false,
      wrongCredentials : false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post('ServletLogin', null, {
          params: {
            email: this.email,
            password: this.password,
            action: 'web'
          }, withCredentials: true
        });
        let attributes = response.data.session.attributes;
        localStorage.setItem('session', JSON.stringify(attributes));
        this.$store.commit('setInit', attributes);
        this.$router.push('/')
      } catch (e) {
        if(e.response){
          if(e.response.status === 401){
            this.wrongCredentials = true;
          }
        }else{
          this.offline = true;
        }
      }
    }
  }
}
</script>


<style>
.container-3 {
  height: 100%;
  width: 100%;
}

.inner-form {
  flex-grow: 2;
}


.my-spacer {
  flex-grow: 4;
}
</style>



