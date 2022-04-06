<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { generaMenu } from "./assets/js/menu";
export default {
  created() {
    generaMenu();
  }
};
</script>
