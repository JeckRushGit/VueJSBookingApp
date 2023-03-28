<template>
  <Teleport to="#calendarpopup">
    <div class="modal-bg d-flex justify-content-center align-items-center">
      <div class="my-modal position-relative d-flex flex-column align-items-center" v-click-away="callBackClosePopUp">
        <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                @click="callBackClosePopUp"></button>
        <p>Are you sure you want to reserve the lesson held by
          {{ selectedProfessor.name + " " + selectedProfessor.surname }} on {{ selectedDay + "/" + selectedMonth }} at
          {{ selectedHour }} of {{ selectedCourseTitol }} ?</p>
        <button @click="handleSubmit" class="btn btn-outline-success">
          <Icon name="tick-circle"/>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script>
import Icon from "@/components/Icon.vue";
import axios from "axios";
import {toRaw} from "vue";

export default {
  name: "CalendarPopUp",
  components: {Icon},
  props: ['selectedProfessor', 'selectedDay', 'selectedMonth', 'selectedHour', 'selectedCourseTitol', 'callBackClosePopUp','callBackOpenFeedBack', 'selectedCell','callBackFeedBackMessage'],
  methods: {
    async handleSubmit() {
      this.callBackClosePopUp();
      await this.sendData();
    },

    async sendData() {
      try {
        const response = await axios.post('ServletBookTeaching', null, {
          params: {
            action: 'web',
            professorEmail: toRaw(this.selectedProfessor).email,
            courseTitol: toRaw(this.selectedCourseTitol),
            day: toRaw(this.selectedDay),
            month: toRaw(this.selectedMonth),
            hour: toRaw(this.selectedHour)
          }
        });
        if(response.status === 200){
          const old_cell = toRaw(this.selectedCell);
          let new_cell = old_cell.cloneNode(true);
          old_cell.parentNode.replaceChild(new_cell,old_cell);
          new_cell.className = "table-default";
          this.callBackFeedBackMessage("The lesson has been reserved");
        }
        this.callBackOpenFeedBack(true);
      } catch (e) {
        if (e.response.status === 401) {
          this.$handle_session_expired()
        } else if (e.response.status === 406) {
          const old_cell = toRaw(this.selectedCell);
          let new_cell = old_cell.cloneNode(true);
          old_cell.parentNode.replaceChild(new_cell,old_cell);
          new_cell.className = "table-default";
          this.callBackFeedBackMessage(e.response.data);
          this.callBackOpenFeedBack(true);
        } else if(e.response.status === 500){
          alert(e.response.data);
        }
      }
    }
  }
}
</script>


<style>
.filter-green {
  width: 25px;
  height: 25px;
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%);
}
</style>