<template>
  <div class="svg-background">
    <div class="p-4 d-flex flex-column justify-content-center align-items-center">
      <h1 style="color: #293241; font-weight: bold" class="align-self-sm-start">Welcome to BOOKIT</h1>
      <div class="d-flex flex-row align-self-sm-start justify-content-center align-items-center">
        <div class="d-flex flex-column" style="margin-left: 130px">
          <h2 style="color: #3D5A80">The easiest way</h2>
          <h2 style="color: #3D5A80"> to book your private lessons</h2>
        </div>
        <div style="width: 120px"></div>
        <img height="383px" width="409px" src="~@/assets/myimage.png" alt="immagine di una ragazza stilizzata che preme su un pulsante">
      </div>

    </div>
  </div>
</template>
<script>


export default {
  name: 'HomeView',

}
</script>

<style>
  .svg-background {
    background-image: url("~@/assets/blob-scene-haikei.svg");
    height: 100%;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>

