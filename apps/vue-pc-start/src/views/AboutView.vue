<template>
  <div class="about">
    <h1>This is an about page {{ title }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('<ref-str>');
</script>
