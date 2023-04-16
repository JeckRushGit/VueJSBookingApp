<template>
  <div v-if="!offline">
    <div v-if="listOfProfessors">
      <div class="d-flex justify-content-around align-items-center">
        <div class="mt-5" style="width: 400px">
          <VueMultiselect :hideSelected="true" :allowEmpty="false" v-if="listOfProfessors" label="label"
                          :options="listOfProfessorLogic" v-model="selectedProfessor"/>
        </div>
        <div class="mt-5" style="width: 400px;">
          <VueMultiselect :hideSelected="true" :allowEmpty="false" v-if="listOfCourses" label="course_titol"
                          :options="listOfCourses" v-model="selectedCourse"/>
        </div>
      </div>

      <div v-if="selectedProfessor && selectedCourse">
        <div class="d-flex align-items-baseline">
          <h2 class="m-5">Selected professor : </h2>
          <p>{{ selectedProfessor.label }}</p>
        </div>

        <button class="m-5 btn btn-primary" @click="sendData(selectedProfessor,selectedCourse)">Create teaching</button>


        <div class="d-flex align-items-baseline">
          <h2 class="m-5">Selected course : </h2>
          <p>{{ selectedCourse.course_titol }}</p>
        </div>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center">
      <div class="spacer"></div>
      <LoadingCircle class="mt-5"></LoadingCircle>
      <div class="spacer"></div>
    </div>
  </div>
  <div v-else>
    <p class="m-1">Service not available, try again later</p>
  </div>
</template>

<script>
import axios from "axios";
import VueMultiselect from "vue-multiselect/src/Multiselect.vue";
import LoadingCircle from "@/components/LoadingCircle.vue";

export default {
  name: "AddTeachingsPage",
  components: {LoadingCircle, VueMultiselect},
  data() {
    return {
      listOfProfessors: null,
      selectedProfessor: null,
      listOfCourses: null,
      selectedCourse: null,
      offline: false,
    }
  },

  async created() {
    await this.fetchProfessors();
  },
  methods: {
    async fetchProfessors() {
      try {
        const response = await axios.get('ServletProfessorRequests', {params: {action: 'getProfessors'}})
        this.listOfProfessors = response.data;

      } catch (e) {
        if (e.response) {
          if (e.response.status === 401) {
            this.$handle_session_expired()
          }
        } else {
          this.offline = true;
        }
      }
    },
    async fetchCourses(professor) {
      try {
        const response = await axios.get('ServletProfessorRequests', {
          params: {
            action: 'getCourses',
            professorEmail: professor.email
          }
        });
        this.listOfCourses = response.data;

      } catch (e) {
        if (e.response) {
          if (e.response.status === 401) {
            this.$handle_session_expired()
          }
        } else {
          this.offline = true;
        }
      }
    },


    async sendData(professor, course) {
      try {
        const response = await axios.post('ServletProfessorRequests', null, {
          params: {
            professorEmail: professor.info.email,
            courseTitol: course.course_titol
          }
        });
        this.removeCourse(course);
        console.log("lezione aggiunta con successo");
      } catch (e) {
        if (e.response) {
          if (e.response.status === 401) {
            this.$handle_session_expired()
          }
        } else {
          this.offline = true;
        }
      }
    },

    removeCourse(course) {
      // for(let i = 0 ; i < this.listOfCourses.length ; i++){
      //   if(this.listOfCourses[i].courseTitol === course.courseTitol){
      //     this.listOfCourses.splice(i,1);
      //   }
      // }
      // this.selectedCourse = this.listOfCourses[0];
      this.fetchCourses(this.selectedProfessor.info)
    }

  },
  watch: {
    listOfProfessors(newList, oldList) {
      this.selectedProfessor = this.listOfProfessorLogic[0];
    },

    async selectedProfessor(newProfessor, oldProfessor) {
      await this.fetchCourses(newProfessor.info)
    },
    listOfCourses(newList, oldList) {
      this.selectedCourse = newList[0];
    }
  },

  computed: {
    listOfProfessorLogic() {
      return this.listOfProfessors.map(function (professor) {
        return {label: professor.name + " " + professor.surname + " (" + professor.email + ")", info: professor};
      });
    }
  }
}
</script>

<style scoped>

</style>