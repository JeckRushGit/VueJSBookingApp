<template>
  <Teleport :to="teleportTag">
    <div class="modal-bg d-flex justify-content-center align-items-center">
      <div class="my-modal position-relative d-flex flex-column align-items-center" v-click-away="handleClose">
        <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                @click="handleClose"></button>
        <p>{{stringalert}}</p>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "FeedBackPopUp",
  props : ['stringalert','callBackClosePopUp','teleportTag'],
  methods : {
    handleClose(){
      this.callBackClosePopUp(false);
    }
  },
}
</script>
