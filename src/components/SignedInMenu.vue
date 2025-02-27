<script setup>
  import { firestoreDb } from "@/firebase.js";
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc
  } from "firebase/firestore";
  import { useCurrentUser } from "vuefire";
  import {ref} from "vue";
  import WaitingMenu from "@/components/WaitingMenu.vue";

  const user = useCurrentUser();


  let readyToMoveOn = ref(false);
  let addedDocOnThisClient = ref(false);

  const items = [
    {}, {}, {}, {}
  ]

  const matchFunc = async () => {

    console.log("Entering matchFunc")

    const matchesRef = collection(firestoreDb, 'matches')

    const queryLogic = query(matchesRef, where('user2', '==', ''),
        orderBy('time_started_searching', 'desc'), limit(1));

    console.log("Querying")

    const queryResult = await getDocs(queryLogic);



    console.log('results of query: ')
    console.log(queryResult);

    let doc = queryResult.docs[0];

    if (queryResult.empty) {
      console.log("adding new doc and moving on to WaitingMenu")

      const data = {
        'user1': user.value.uid,
        'user2': '',
        'time_started_searching': serverTimestamp()
      }


      doc = await addDoc(matchesRef, data);
      readyToMoveOn.value = true;
      addedDocOnThisClient.value = true;
    }

    else {
      console.log("Getting doc that already exists")

      const sub = onSnapshot(doc.ref, async (doc) => {
        const data = doc.data();

        const newData = {
          'user1': data.user1,
          'user2': user.value.uid,
          'time_started_searching': data.time_started_searching,
        }

        await updateDoc(doc.ref, newData);
        readyToMoveOn.value = true;
        addedDocOnThisClient.value = false;
      })

    }

    console.log("Moving on to the next bit with readyToMoveOnValue:" + readyToMoveOn.value.toString())
  }




</script>



<template>
  <div v-if="!readyToMoveOn" class="p-4 flex flex-row justify-evenly items-stretch h-screen">

    <div class="basis-1/3 flex flex-col justify-center p-4 bg-gray-100 rounded-lg m-4">
      <p class="text-gray-700">
        Welcome to Chat-Twist. Press the button below to get started and find your match.
      </p>
      <button class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer w-50"
      @click="matchFunc">Let's go</button>
    </div>


    <div class="basis-1/3 flex flex-col overflow-y-auto rounded-lg bg-gray-200 rounded-md justify-center m-4">
      <h1 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 text-center">Previous Chat Rooms</h1>
      <div v-for="(index) in items" :key="index" class="bg-white shadow p-4 rounded-lg mb-2 flex justify-between items-center">
        <div>
          <p class="text-gray-800">Item {{ index + 1 }}</p>
          <p class="text-gray-500 text-sm">Timestamp: {{ new Date().toLocaleString('en-GB') }}</p>
        </div>
        <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 cursor-pointer">Check it out</button>
      </div>
    </div>


    <div class="basis-1/3 bg-yellow-100 text-center flex flex-col justify-center p-4 rounded-lg m-4">
      <div class="font-bold text-lg border-b-2">What is this place?</div>
      <div class="text-gray-700">
        This is a rework of my very first project, ChatTwist, which was made with React
        and Firebase. Since the code for it is nightmarishly poor, I decided to rework it (this time with Vue)!
        Special thanks to the team at <a href="https://vuefire.vuejs.org/" target="_blank" class="text-blue-600 underline">VueFire</a>.
      </div>
    </div>
  </div>

  <div v-else>
    <WaitingMenu :added-doc-on-this-client-in-previous-step="addedDocOnThisClient"/>
  </div>

</template>

<style scoped>

</style>