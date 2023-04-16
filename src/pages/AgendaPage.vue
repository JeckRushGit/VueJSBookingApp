<template>
  <div v-if="!offline">

    <div class="m-5 d-flex justify-content-center align-items-center">
      <VueMultiselect style="max-width: 400px" :hideSelected="true" :allowEmpty="false" :options="options" label="label"
                      v-model="selectedOptions"/>
    </div>
    <div class="m-5" v-if="listOfReservedLessons && dataLogic">

      <!--    <div class="my-container m-2 overflow-auto">-->
      <!--      <p>{{ item }} </p>-->
      <!--      <p v-for="(item2,index2) in dataLogic.days[item].lessons">-->
      <!--        <AgendaLessonContainer v-if="dataLogic" :index="index2" :item="item2"-->
      <!--                               :call-back-lesson="handleSubmitLesson"></AgendaLessonContainer>-->
      <!--      </p>-->
      <!--    </div>-->
      <div class="accordion" id="accordionExample" v-for="(item,index) in orderListOfDays ">
        <div class="accordion-item mt-2">
          <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+index"
                    aria-expanded="true" aria-controls="collapseOne">
              {{ item }}
            </button>
          </h2>
          <div :id="'collapse'+index" class="accordion-collapse collapse " aria-labelledby="headingOne"
               data-bs-parent="#accordionExample">
            <div class="accordion-body">
              <p v-for="(item2,index2) in dataLogic.days[item].lessons">
                <AgendaLessonContainer v-if="dataLogic" :index="index2" :item="item2"
                                       :call-back-lesson="handleSubmitLesson"
                                       :available="state === 1"></AgendaLessonContainer>
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
    <div v-else-if="listOfReservedLessons && !dataLogic" class="d-flex justify-content-center align-items-center">
      <p>No lesson available</p>
    </div>

    <div v-else class="d-flex justify-content-center">
      <div class="spacer"></div>
      <LoadingCircle class="mt-5"></LoadingCircle>
      <div class="spacer"></div>
    </div>

    <Teleport to="#agendapopup" v-if="isPopUpOpen && !isFeedBackOpen">
      <div class="modal-bg d-flex justify-content-center align-items-center">

        <div class="my-modal position-relative d-flex flex-column align-items-center" v-click-away="closePopUp">
          <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                  @click="closePopUp"></button>
          <p>{{ stringPopUp }}</p>
          <button @click="buttonListener">Yes</button>
        </div>
      </div>
    </Teleport>

    <Teleport to="#agendapopup" v-if="isFeedBackOpen && !isPopUpOpen">
      <div class="modal-bg d-flex justify-content-center align-items-center">

        <div class="my-modal position-relative d-flex flex-column align-items-center" v-click-away="closePopUp">
          <button type="button" class="btn-close m-2 position-absolute top-0 end-0" aria-label="Close"
                  @click="closePopUp"></button>
          <p>{{ stringFeedBack }}</p>
        </div>
      </div>
    </Teleport>
  </div>
  <div v-else>
    <p class="m-1">Service not available, try again later</p>
  </div>
</template>
<script>
import axios, {options} from "axios";
import {toRaw} from "vue";
import AgendaLessonContainer from "@/components/AgendaLessonContainer.vue";
import FeedBackPopUp from "@/components/FeedBackPopUp.vue";
import AgendaPopUp from "@/components/AgendaPopUp.vue";
import VueMultiselect from 'vue-multiselect'
import LoadingCircle from "@/components/LoadingCircle.vue";

export default {
  name: "AgendaPage",
  components: {LoadingCircle, AgendaPopUp, FeedBackPopUp, AgendaLessonContainer, VueMultiselect},
  data() {
    return {
      state: 1,
      options: [
        {index: 1, label: 'To do'},
        {index: 2, label: 'Done'},
        {index: 3, label: 'Removed'},
      ],
      selectedOptions: null,
      listOfReservedLessons: null,
      dataLogic: null,
      isPopUpOpen: false,
      isFeedBackOpen: false,
      dataToSend: null,
      stringPopUp: '',
      stringFeedBack: '',
      stateFromSubmit: 0,
      offline: false,

    }
  },


  async created() {
    await this.fetchData();
  },

  mounted() {
    this.selectedOptions = this.options[0];
  },

  methods: {
    async fetchData() {
      try {
        const response = await axios.get('ServletGetBookingsForUser', {
          params: {
            action: 'web',
            stato: toRaw(this.state)
          }
        })
        this.listOfReservedLessons = response.data;
      } catch (e) {
        if (e.response) {
          if (e.response.status === 401) {
            this.$handle_session_expired()
          }
        } else {
          this.offline = true
        }
      }
    },

    createLogicFromData(list) {
      if (list.length > 0) {
        const obj = {days: {}};
        for (let i = 0; i < list.length; i++) {
          obj.days[list[i].day + "/" + list[i].month] = {lessons: []};
        }
        for (let i = 0; i < list.length; i++) {
          let listTmp = obj.days[list[i].day + "/" + list[i].month].lessons;
          listTmp.push(list[i]);
        }
        this.dataLogic = obj;

      } else {
        this.dataLogic = null;
      }
    },


    async handleSubmitLesson(index, item, state) {
      this.dataToSend = item;
      this.stateFromSubmit = state;
      this.showPopUpConfirmAction(state);
      // await this.SendData(state);
    },

    showPopUpConfirmAction(state) {
      if (state === 2) {
        this.isPopUpOpen = true;
        this.stringPopUp = 'Are you sure you want to confirm this lesson?';
      } else if (state === 3) {
        this.isPopUpOpen = true;
        this.stringPopUp = 'Are you sure you want to remove this lesson?';
      }
    },


    closePopUp() {
      this.isFeedBackOpen = false;
      this.isPopUpOpen = false;
    },


    async buttonListener() {
      this.isPopUpOpen = false;
      var correct = await this.SendData(this.stateFromSubmit);
      if (correct) {
        if (this.stateFromSubmit === 2) {
          this.stringFeedBack = 'Lesson confirmed'
          this.isFeedBackOpen = true;
        } else if (this.stateFromSubmit === 3) {
          this.isFeedBackOpen = true;
          this.stringFeedBack = 'Lesson removed'
        }
      } else {
        this.stringFeedBack = 'Something went wrong';
        this.isFeedBackOpen = true;
      }
    },

    async SendData(state) {
      try {
        let response;
        let dataToSend = toRaw(this.dataToSend);
        if (state === 2) {
          response = await axios.post('ServletSetBookings', null, {
            params: {
              action: 'web',
              email_professore: dataToSend.professor.email,
              corso: dataToSend.course.course_titol,
              giorno: dataToSend.day,
              mese: dataToSend.month,
              orario: dataToSend.hour,
              stato: state,
            }
          });
        } else if (state === 3) {
          response = await axios.post('ServletSetBookings', null, {
            params: {
              action: 'web',
              email_professore: dataToSend.professor.email,
              corso: dataToSend.course.course_titol,
              giorno: dataToSend.day,
              mese: dataToSend.month,
              orario: dataToSend.hour,
              stato: state,
            }
          });
        }
        await this.fetchData();
        return response.status === 200;
      } catch (e) {
        if (e.response.status === 401) {
          this.$handle_session_expired()
        }
        console.error(e.status)
      }
    }


  },

  watch: {
    listOfReservedLessons(newList, oldList) {
      this.createLogicFromData(toRaw(newList));
    },

    selectedOptions(newValue, oldValue) {
      this.state = newValue.index
      this.fetchData();
    }
  },

  computed: {
    orderListOfDays() {
      if (this.dataLogic) {
        return Object.keys(this.dataLogic.days).sort();
      }
    }
  }
}
</script>


<style>

.my-container {
  height: 200px;
  border: solid 1px black;
}

</style>