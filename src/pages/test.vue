<template>
  <h1>{{count}}</h1>
  <button @click="Foo">Premimi</button>
  <h1>{{CountPerQuattro}}</h1>
</template>

<script>
export default {
  name: "test",
  data(){
    return{
      count : 0,
      CountPerQuattro : 0
    }
  },
  methods : {
    Foo(){
      this.count++;
    }
  },
  computed : {
    CountPerQuattro(){
      return this.count;
    }
  },

  watch : {


    count(newValue,oldValue){
      this.CountPerQuattro = newValue * 4;
    }


  }

}
</script>

<style scoped>


</style>