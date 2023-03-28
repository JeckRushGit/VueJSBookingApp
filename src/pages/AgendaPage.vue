<template>
  <div class="m-5 d-flex justify-content-center align-items-center">
    <VueMultiselect style="max-width: 400px" :hideSelected="true" :allowEmpty="false" :options="options" label="label"
                    v-model="selectedOptions"/>
  </div>
  <div class="m-5" v-if="dataLogic" >

<!--    <div class="my-container m-2 overflow-auto">-->
<!--      <p>{{ item }} </p>-->
<!--      <p v-for="(item2,index2) in dataLogic.days[item].lessons">-->
<!--        <AgendaLessonContainer v-if="dataLogic" :index="index2" :item="item2"-->
<!--                               :call-back-lesson="handleSubmitLesson"></AgendaLessonContainer>-->
<!--      </p>-->
<!--    </div>-->
    <div class="accordion" id="accordionExample" v-for="(item,index) in orderListOfDays ">
      <div class="accordion-item mt-2" >
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+index" aria-expanded="true" aria-controls="collapseOne">
            {{item}}
          </button>
        </h2>
        <div :id="'collapse'+index" class="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <p v-for="(item2,index2) in dataLogic.days[item].lessons">
                      <AgendaLessonContainer v-if="dataLogic" :index="index2" :item="item2"
                                             :call-back-lesson="handleSubmitLesson" :available="state === 1"></AgendaLessonContainer>
                    </p>
          </div>
        </div>
      </div>

    </div>



  </div>
  <div v-else class="d-flex justify-content-center align-items-center">
    <p>No lesson available</p>
  </div>
  <AgendaPopUp v-if="isPopUpOpen && state === 1" :call-back-close-pop-up="closePopUp" :call-back-handle-send-data="SendData"/>
  <FeedBackPopUp v-if="isFeedBackOpen" :teleport-tag="'#agendapopup'"
                 :call-back-close-pop-up="opencloseFeedBack"></FeedBackPopUp>
</template>
<script>
import axios, {options} from "axios";
import {toRaw} from "vue";
import AgendaLessonContainer from "@/components/AgendaLessonContainer.vue";
import FeedBackPopUp from "@/components/FeedBackPopUp.vue";
import AgendaPopUp from "@/components/AgendaPopUp.vue";
import VueMultiselect from 'vue-multiselect'

export default {
  name: "AgendaPage",
  components: {AgendaPopUp, FeedBackPopUp, AgendaLessonContainer,VueMultiselect},
  data() {
    return {
      state: 1,
      options : [
        {index : 1,label : 'To do'},
        {index : 2,label : 'Done'},
        {index : 3,label : 'Removed'},
      ],
      selectedOptions : null,
      listOfReservedLessons: null,
      dataLogic: null,
      isPopUpOpen: false,
      isFeedBackOpen: false,
      dataToSend: null,
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
        console.error(e);
        if (e.response.status === 401) {
          this.$handle_session_expired()
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

      }else{
        this.dataLogic = null;
      }
    },


    async handleSubmitLesson(index, item,state) {
      this.dataToSend = item;
      await this.SendData(state);
    },

    closePopUp() {
      this.isPopUpOpen = false;
    },

    opencloseFeedBack(flag) {
      this.isFeedBackOpen = flag;
    },

    async SendData(state) {
      try {
        let response;
        let dataToSend = toRaw(this.dataToSend);
        if (state === 2) {
          response = axios.post('ServletSetBookings',null,{params : {action : 'web',email_professore : dataToSend.professor.email,corso : dataToSend.course.course_titol,giorno : dataToSend.day,mese : dataToSend.month,orario : dataToSend.hour,stato : state,}});
        } else if (state === 3) {
          response = axios.post('ServletSetBookings',null,{params : {action : 'web',email_professore : dataToSend.professor.email,corso : dataToSend.course.course_titol,giorno : dataToSend.day,mese : dataToSend.month,orario : dataToSend.hour,stato : state,}})
        }
        await this.fetchData();
      } catch (e) {
        console.error(e.response)
      }
    }


  },

  watch: {
    listOfReservedLessons(newList, oldList) {
      this.createLogicFromData(toRaw(newList));
    },

    selectedOptions(newValue,oldValue){
      this.state = newValue.index
      this.fetchData();
    }
  },

  computed: {
    orderListOfDays() {
      if(this.dataLogic){
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