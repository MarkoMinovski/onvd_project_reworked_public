<script setup>
defineProps({
  text: String,
  imgURL: String,
  isSentByThisClient: Boolean,
  timeSent: Date
})
</script>

<template>
  <div v-if="isSentByThisClient" class="flex items-start gap-2.5 bg-blue-600 self-end">
    <span class="text-sm font-normal text-gray-900">{{ timeSent.getTime().toLocaleString('en-GB') }}</span>
    <!-- <img src={{imgURL}} alt="" class="w-8 h-8 rounded-full"/> <-->
    <p class="py-2.5 text-sm font-normal text-white">{{ text }}</p>
  </div>

  <div v-else class="flex items-start gap-2.5 bg-gray-500">
    <span class="text-sm font-normal text-gray-900">{{ timeSent.getTime().toLocaleString('en-GB') }}</span>
    <!-- <img src={{imgURL}} alt="" class="w-8 h-8 rounded-full"/> <-->
    <p class="py-2.5 text-sm font-normal">{{ text }}</p>
  </div>
</template>

<style scoped>

</style>