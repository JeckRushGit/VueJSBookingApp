<template>
  <table ref="my-table" class="table table-striped table-responsive table-bordered">
    <thead>
      <tr>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">15:00-16:00</th>
      </tr>
      <tr>
        <th scope="row">16:00-17:00</th>
      </tr>
      <tr>
        <th scope="row">17:00-18:00</th>
      </tr>
      <tr>
        <th scope="row">18:00-19:00</th>
      </tr>
    </tbody>
  </table>
  <CalendarPopUp v-if="isPopUpOpen && user && user.role === 'Client'" :call-back-close-pop-up="closePopUp" :selected-professor="selectedProfessor" :selected-course-titol="selectedCourseTitol" :selected-day="selectedDay" :selected-hour="selectedHour" :selected-month="selectedMonth" :selected-cell="selectedCell" :call-back-open-feed-back="opencloseFeedBackPopUp" :call-back-feed-back-message="setFeedBackMessage"/>
  <FeedBackPopUp v-if="isPopUpFeedBackOpen && !isPopUpOpen" :stringalert="feedBackMessage" :call-back-close-pop-up="opencloseFeedBackPopUp" :teleport-tag="'#calendarpopup'"/>
</template>

<script>

import {toRaw} from "vue";
import axios from "axios";
import CalendarPopUp from "@/components/CalendarPopUp.vue";
import FeedBackPopUp from "@/components/FeedBackPopUp.vue";


export default {
  name: "CalendarView",
  components: {FeedBackPopUp, CalendarPopUp},
  props : {
    data : {
      required : true
    },
    callback :{
      required: true
    },
    days : {
      required : true
    },
    month : {
      required : true
    }
  },
  data(){
    return{
      isPopUpOpen : false,
      isPopUpFeedBackOpen : false,
      myObj : null,
      selectedDay : null,
      selectedHour : null,
      selectedMonth : null,
      selectedProfessor : null,
      selectedCourseTitol : null,
      selectedCell : null,
      feedBackMessage : '',
      user : null
    }
  },

  created() {
    this.user = this.$store.getters.userdata;
    this.calendarLogic(toRaw(this.data));
  },

  mounted() {
    this.createTable();
  },

  watch :{
    data: function(newVal,oldVal){
      this.calendarLogic(toRaw(newVal));
      this.updateTable();
    }
  },

  methods :{

    closePopUp(){
      this.isPopUpOpen = false;
    },

    opencloseFeedBackPopUp(flag){
      this.isPopUpFeedBackOpen = flag;
    },

    setFeedBackMessage(string){
      this.feedBackMessage = string;
    },

    createTable(){
      try {
        let month = toRaw(this.month);
        let professorInfo = toRaw(this.data)[0].professor;
        let courseTitol = toRaw(this.data)[0].course.course_titol;
        let days = toRaw(this.days);
        const table = this.$refs["my-table"];
        const calendarLogic = toRaw(this.myObj);
        for (let i = 0; i < table.rows.length; i++) {
          const row = table.rows[i];
          // Loop through the columns of the row
          if (i === 0) {
            this.fillHeadRow(row)
          }
          if (i !== 0) {
            for (let j = 1; j < 6; j++) {
              let hour = row.cells[0].innerHTML;
              let dayIsAvailable = calendarLogic.days[days[j - 1]][hour];
              const cell = row.insertCell(j);
              if (dayIsAvailable) {
                cell.classList.add('bg-success');
                cell.addEventListener('click', async function () {
                  const day = days[j - 1];
                  this.isPopUpOpen = true;
                  this.selectedDay = day;
                  this.selectedHour = hour;
                  this.selectedMonth = month;
                  this.selectedProfessor = professorInfo;
                  this.selectedCourseTitol = courseTitol;
                  this.selectedCell = cell;
                  // await this.handleSubmitLesson(day, hour, month, professorEmail, courseTitol);
                }.bind(this), false);
              } else {
                cell.classList.add('table-default');
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    },

    updateTable(){
      let month = toRaw(this.month);
      let professorInfo = toRaw(this.data)[0].professor;
      let courseTitol = toRaw(this.data)[0].course.course_titol;
      const table = this.$refs["my-table"];
      const calendarLogic = toRaw(this.myObj);
      let days = toRaw(this.days);
      for(let i = 1 ; i < table.rows.length ; i++){
        const row = table.rows[i];
        for(let j = 1 ; j < 6 ; j++){
          let hour = row.cells[0].innerHTML;
          let dayIsAvailable = calendarLogic.days[days[j - 1]][hour];
          let old_cell = row.cells[j];
          let new_cell = old_cell.cloneNode(true);
          old_cell.parentNode.replaceChild(new_cell,old_cell);
          if(dayIsAvailable){
            new_cell.className = "bg-success";
            new_cell.addEventListener('click', async function () {
              const day = days[j - 1];
              this.isPopUpOpen = true;
              this.selectedDay = day;
              this.selectedHour = hour;
              this.selectedMonth = month;
              this.selectedProfessor = professorInfo;
              this.selectedCourseTitol = courseTitol;
              this.selectedCell = new_cell;
              // await this.handleSubmitLesson(day, hour, month, professorEmail, courseTitol);
            }.bind(this), false);
          }else{
            new_cell.className = "table-default";
          }
          // cell.className = "bg-success";
        }
      }


    },

    async handleSubmitLesson(day,hour,month,professorEmail,courseTitol){
      try {
        const response = await axios.post('ServletBookTeaching',null,{params : {action : 'web',professorEmail : professorEmail,courseTitol : courseTitol,day : day,month : month,hour : hour}});
        this.callback();
      }catch (e){
        console.error(e);
      }
    },


    fillHeadRow(headRow){

      let days = toRaw(this.days);



      for(let i = 0 ; i < 6; i++){
        const cell = headRow.insertCell(i);
        if(i === 0){
          cell.innerHTML = '#';
        }
        switch (i){
          case 1:
            cell.innerHTML = 'Monday'+" "+days[i-1];
            break;
          case 2:
            cell.innerHTML = 'Tuesday'+" "+days[i-1];
            break;
          case 3:
            cell.innerHTML = 'Wednesday'+" "+days[i-1];
            break;
          case 4:
            cell.innerHTML = 'Thursday'+" "+days[i-1];
            break;
          case 5:
            cell.innerHTML = 'Friday'+" "+days[i-1];
            break;
        }
      }
    },

    calendarLogic(rawData){
      try {
        let obj = {days : {}};
        let days = toRaw(this.days);

        //setta prima tutti i giorni a false

        for(let i = 0 ; i < days.length ; i++){
          obj.days[days[i]] = {
            '15:00-16:00' : false,
            '16:00-17:00' : false,
            '17:00-18:00' : false,
            '18:00-19:00' : false,
          };
        }


//        setta i giorni a true disponibili all'utente per quel corso di quel professor
        for(let i = 0; i < rawData.length ; i++){
          obj.days[rawData[i].day][rawData[i].hour] = true;
        }

        this.myObj = obj;
      }catch (e){
        console.error(e);
      }
    },

    onClickAway(event) {
      this.isPopUpOpen = false;
    },

  }
}
</script>

