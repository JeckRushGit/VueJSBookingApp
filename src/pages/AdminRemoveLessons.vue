<template>
  <div v-if="!offline">
    <div v-if="users">
      <div class="m-5 d-flex flex-row align-items-center">
        <h3>List of users : </h3>
        <div style="width: 400px;margin-left: 20px">
          <VueMultiselect v-if="users" label="label" :options="userData" v-model="selectedUser"/>
        </div>
      </div>
      <div v-if="listOfLessons" class="accordion" id="accordionExample"
           v-for="(item,index) in Object.keys(listOfLessonsLogic).sort()">
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
              <div v-for="item2 in listOfLessonsLogic[item]">
                <div class="d-flex flex-row justify-content-between align-items-center">
                  <p> - {{ item2.hour }} : {{ item2.course.course_titol }} , {{ item2.professor.name }}
                    {{ item2.professor.surname }} ({{ item2.professor.email }})</p>
                  <button @click="removeLesson(item2)" class="m-1 btn btn-danger btn-circle">
                    <Icon name="trash"/>
                  </button>
                </div>
                <hr/>
              </div>

            </div>
          </div>
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
import VueMultiselect from 'vue-multiselect'
import axios from "axios";
import {toRaw} from "vue";
import Icon from "@/components/Icon.vue";
import LoadingCircle from "@/components/LoadingCircle.vue";

export default {
  name: "AdminRemoveLessons",
  components: {
    LoadingCircle,
    Icon,
    VueMultiselect
  },

  async created() {
    await this.fetchUsers();
  },

  data() {
    return {
      users: null,
      selectedUser: null,
      listOfLessons: null,
      offline: false
    }
  },



  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('ServletAdminGetBookings', {
          params: {
            action: 'getListOfUsers',
            device: 'web'
          }
        });
        this.users = response.data;

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

    async fetchBookingsForUser(selectedUser) {
      try {
        const response = await axios.get('ServletAdminGetBookings', {
          params: {
            action: 'getBookingsForUser',
            device: 'web',
            userEmail: selectedUser.email
          }
        });
        this.listOfLessons = response.data;
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

    async sendData() {
      await this.fetchUsers();
    },

    async removeLesson(row) {
      try {
        const response = await axios.post('ServletSetBookings', null, {
          params: {
            action: 'web',
            email_professore: row.professor.email,
            email_utente: row.user.email,
            corso: row.course.course_titol,
            giorno: row.day,
            mese: row.month,
            orario: row.hour,
            stato: 3
          }
        });
        for (let i = 0; i < this.listOfLessons.length; i++) {
          if (this.listOfLessons[i].day === row.day && this.listOfLessons[i].hour === row.hour && this.listOfLessons[i].month === row.month) {
            this.listOfLessons.splice(i, 1);
          }
        }
      } catch (e) {
        if (e.response) {
          if (e.response.status === 401) {
            this.$handle_session_expired()
          }
        } else {
          this.offline = true;
        }
      }


    }
  },
  computed: {
    userData() {
      return this.users.map(function (user) {
        return {label: user.name + " " + user.surname + " (" + user.email + ")", info: user};
      });
    },
    listOfLessonsLogic() {
      return this.listOfLessons.reduce((dates, info) => {
        if (!dates[info.day + '/' + info.month]) {
          dates[info.day + '/' + info.month] = [];
        }
        dates[info.day + '/' + info.month].push(info);
        return dates;
      }, {});
    },
    removeElem(day) {
      console.log(day);
    }
  },
  watch: {
    users(newUsers, oldUsers) {
      this.selectedUser = this.userData[0];
    },

    async selectedUser(newSelectedUser, oldSelectedUser) {
      await this.fetchBookingsForUser(newSelectedUser.info);
    }
  }
}
</script>

<style>
.btn-circle {
  width: 30px;
  height: 30px;
  padding: 0px 0px;
  border-radius: 20px;
  font-size: 8px;
  text-align: center;
}
</style>