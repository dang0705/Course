<template>
  <div class="course">
    <div id="titleImg">
      <img width="100%" :src="listParams.img" alt="">
    </div>
  </div>
</template>

<script>
	export default {
		name: "course",
    data(){
		  return{
        listParams:{}
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(from);
      next()
    }
  }
</script>

<style scoped lang="stylus">

</style>
