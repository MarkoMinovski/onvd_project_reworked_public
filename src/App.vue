<script setup>
import Navbar from "@/components/Navbar.vue";
import SignedOutMenu from "@/components/SignedOutMenu.vue";
import {useCurrentUser} from "vuefire";
import SignedInMenu from "@/components/SignedInMenu.vue";


const user = useCurrentUser()


</script>

<template>
  <header>
    <Navbar></Navbar>
  </header>

  <main>
    <div v-if="!user">
      <SignedOutMenu></SignedOutMenu>
    </div>

    <div v-else>
      <Suspense>
        <SignedInMenu></SignedInMenu>
      </Suspense>
    </div>
  </main>
</template>

<style scoped>

</style>
