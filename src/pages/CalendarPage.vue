<template>
  <div class="d-flex flex-column justify-content-center" v-if="listOfCourses" style="width: 100%">

    <div class="d-flex">
      <div class="spacer"></div>
      <div class="mt-5 text-center">
        <p>Selected Professor :</p>
        <VueMultiselect :max-height="150"
                        class="dropdown-style" label="course" :hideSelected="true" :allowEmpty="false"
                        :options="listOfCourses" v-model="selectedCourse"/>
      </div>
      <div class="spacer" style="flex-grow: 4"></div>

      <div class="mt-5 text-center">
        <p>Selected Course :</p>
        <VueMultiselect :max-height="150"
                        class="dropdown-style" label="professorKey" :allowEmpty="false" :hideSelected="true"
                        :options="listOfProfessor"
                        v-model="selectedProfessor"/>
      </div>
      <div class="spacer"></div>
    </div>
    <div v-if="bookings && bookings.length > 0 && days && month" class="m-5">
      <CalendarView v-if="bookings && bookings.length > 0 && days && month" :data="bookings" :callback="refresh"
                    :days="days" :month="month"></CalendarView>
    </div>

    <div v-else-if="bookings && bookings.length === 0" class="mt-5 d-flex justify-content-center align-items-center">
      <h1>Non ci sono lezioni disponibili</h1>
    </div>


  </div>
  <div v-else class="d-flex justify-content-center">
    <div class="spacer"></div>
    <LoadingCircle class="mt-5"></LoadingCircle>
    <div class="spacer"></div>
  </div>
</template>
<script>

import axios from "axios";
import VueMultiselect from 'vue-multiselect'
import {toRaw} from "vue";
import LoadingCircle from "@/components/LoadingCircle.vue";
import CalendarView from "@/components/CalendarView.vue";

export default {
  name: "CalendarPage",
  components: {
    VueMultiselect,
    LoadingCircle,
    CalendarView
  },
  data() {
    return {
      selectedProfessor: null,
      selectedCourse: null,
      listOfCourses: null,
      listOfProfessor: null,
      bookings: null,
      month: null,
      days: null,
    }
  },

  async created() {
    await this.fetchData();
  },

  methods: {

    refresh(){
      this.$router.go();
    },

    async fetchData() {
      try {
        const response = await axios.get('ServletGetTeachings', {params: {action: 'web'}});
        let x = toRaw(response.data);
        let map = new Map();
        for (let i = 0; i < x.length; i++) {
          let key = x[i].course.course_titol;
          if (!map.has(key)) {
            // let listOfProfessor = [x[i].professor];
            let listOfProfessor = [{
              professorKey: x[i].professor.name + " " + x[i].professor.surname + " " + "(" + x[i].professor.email + ")",
              professorInfo: x[i].professor
            }];
            map.set(key, listOfProfessor);
          } else {
            let listOfProfessor = map.get(key);
            listOfProfessor.push({
              professorKey: x[i].professor.name + " " + x[i].professor.surname + " " + "(" + x[i].professor.email + ")",
              professorInfo: x[i].professor
            });
          }
        }
        let list = [];
        map.forEach((value, key) => {
          list.push({course: key, listOfProfessor: value});
        })
        this.listOfCourses = list;
        this.selectedCourse = list[0];
        this.listOfProfessor = list[0].listOfProfessor;
        this.selectedProfessor = list[0].listOfProfessor[0];
        const response2 = await axios.get('ServletGetAvBookings',{params : {action : 'web-getdaysandmonth'}});
        this.month = response2.data.month;
        this.days = response2.data.days;
      } catch (e) {
        console.error(e);
        if(e.response.status === 401){
          this.$handle_session_expired()
        }

      }
    },
    async fetchBookings(professor, course) {
      try {
        const response = await axios.get('ServletGetAvBookings', {
          params: {
            titoloCorso: course.course,
            emailProfessore: professor.professorInfo.email
          }
        });
        this.bookings = response.data;
      } catch (e) {
        console.error(e,"qui");
        if(e.response.status === 401){
          this.$handle_session_expired()
        }
      }
    }
  },
  watch: {
    selectedCourse(newCourse, oldCourse) {
      this.listOfProfessor = newCourse.listOfProfessor;
      this.selectedProfessor = newCourse.listOfProfessor[0];
    },
    selectedProfessor(newProfessor, oldProfessor) {
      this.fetchBookings(toRaw(newProfessor), toRaw(this.selectedCourse))
    }
  }
}
</script>


<style>

.dropdown-style {
  width: 400px;
  flex-grow: 4;

}

.spacer {
  flex-grow: 1;
}

</style>