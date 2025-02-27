<script setup>
import {useCurrentUser, useFirebaseAuth} from 'vuefire'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { firestoreDb } from "@/firebase.js";
import { doc, setDoc } from 'firebase/firestore'


const user = useCurrentUser()
const auth = useFirebaseAuth()
const googleAuthProvider = new GoogleAuthProvider()


function signInWithGoogle() {


  signInWithPopup(auth, googleAuthProvider).then(async (res) => {
    const docRef = doc(firestoreDb, 'users', res.user.uid)

    try {
      const data = {
        user_id: res.user.uid,
        logged_in: true
      }

      await setDoc(docRef, data)
    } catch (error) {
      console.error(error)
    }

  })
}

function signOut() {
    const current_user_id = user.value.uid

    auth.signOut().then(async () => {
      const docRef = doc(firestoreDb, 'users', current_user_id)

      try {
        const data = {
          user_id: current_user_id,
          logged_in: false
        }

        await setDoc(docRef, data)
      } catch (error) {
        console.error(error)
      }
    })
}

</script>

<template>
  <div class="bg-primary-100 shadow-md p-4 mb--2">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-2xl font-bold text-blue-600">Chat-Twist</div>
      <button v-if="!user" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none
      focus:ring-4 focus:ring-blue-300 font-medium rounded-full
      text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600
      dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer" @click="signInWithGoogle">Sign in</button>

      <button v-else type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none
      focus:ring-4 focus:ring-blue-300 font-medium rounded-full
      text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600
      dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer" @click="signOut">Sign out</button>

    </div>
  </div>
</template>

<style scoped>

</style>