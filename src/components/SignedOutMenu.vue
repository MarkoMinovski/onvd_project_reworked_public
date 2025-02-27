<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 200);
});
</script>

<template>
  <div class="flex justify-center items-center h-[80vh] w-full bg-gray-100 p-5 opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': isVisible }">
    <div class="text-center max-w-lg">
      <h1 class="text-4xl font-bold mb-5">Welcome to Chat-Twist</h1>
      <p class="text-lg text-gray-700">To get started, you need to sign up. At the moment, this app only supports
      signing up with Google, but that's okay because making accounts everywhere is annoying anyway</p>
    </div>
  </div>
</template>

<style scoped>

</style>