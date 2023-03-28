<template>

  <div class="d-flex justify-content-between">
    <p>- {{ item.hour }} {{ item.professor.name }} {{
        item.professor.surname
      }}({{ item.professor.email }}) {{ item.course.course_titol }}</p>
    <div v-if="available">
      <button  @click="handleClick(3)" class="m-1 btn btn-danger btn-circle ">
        <Icon name="trash"/>
      </button>
      <button  @click="handleClick(2)" class="m-1 btn btn-success btn-circle ">
        <Icon name="tick-circle"/>
      </button>
    </div>
  </div>

  <hr/>
</template>

<script>
import {toRaw} from "vue";
import Icon from "@/components/Icon.vue";

export default {
  name: "AgendaLessonContainer",
  components: {Icon},
  props: {
    item: {
      required: true
    },
    index: {
      required: true
    },
    callBackLesson: {
      required: true
    },
    available :{
      required : true
    }
  },
  methods: {
    handleClick(state) {
      console.log("ciao");
      this.callBackLesson(this.index, toRaw(this.item),state);
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