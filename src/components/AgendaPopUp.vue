<template>
  <Teleport to="#agendapopup">
    <div class="modal-bg d-flex justify-content-center align-items-center">
      <div class="my-modal position-relative d-flex flex-column align-items-center" v-click-away="callBackClosePopUp">
        <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                @click="callBackClosePopUp"></button>
        <span>
          <button class="m-2 btn btn-success" @click="handleRemove(state)">Set as done</button>
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "AgendaPopUp",
  props : ['callBackClosePopUp','callBackHandleSendData','state'],
  methods : {
    handleRemove(state){
      this.callBackClosePopUp();
      this.callBackHandleSendData(state);
    }
  }
}
</script>

<style scoped>

</style>