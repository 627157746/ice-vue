<template>
  <iframe :src="src" :height="height" :width="width" />
</template>

<script>
export default {
  name: 'FormGen',
  data() {
    return {
      src: 'https://mrhj.gitee.io/form-generator/#/',
      height: document.body.clientHeight,
      width: document.body.clientWidth
    }
  }
}
</script>

<style scoped>

</style>
