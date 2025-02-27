<script setup>
import {collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, where} from "firebase/firestore";
import {createNewChatRoom, firestoreDb} from "@/firebase.js";
import {useCurrentUser} from "vuefire";
import {onMounted, ref} from "vue";
import ChatBox from "@/components/ChatBox.vue";

const user = useCurrentUser();

const props = defineProps({
  addedDocOnThisClientInPreviousStep: Boolean,
});

console.log(props.addedDocOnThisClientInPreviousStep);

const matchesRef = collection(firestoreDb, 'matches');

let queryLogic;
let queryRes;
let unsubscribe = null;

let finished = false;

const roomNumber = ref(-1);
const readyToShowRoom = ref(false);

if (props.addedDocOnThisClientInPreviousStep.valueOf() === true) {
  queryLogic = query(matchesRef, where('user1', '==', user.value.uid),
      orderBy('time_started_searching', 'desc'), limit(1));

  queryRes = await getDocs(queryLogic);

} else {
  queryLogic = query(matchesRef, where('user2', '==', user.value.uid),
      orderBy('time_started_searching', 'desc'), limit(1));

  queryRes = await getDocs(queryLogic);
}

onMounted(async () => {
    const targetDocFromMatchesCollection = queryRes.docs[0];

    if (props.addedDocOnThisClientInPreviousStep.valueOf() === true) {
      console.log('In \'leader\' branch')

      unsubscribe = onSnapshot(targetDocFromMatchesCollection.ref, async (docSnapshot) => {
        const data = docSnapshot.data();

        if (data.user2 !== '' && !finished) {
          const ctr = await createNewChatRoom(data.user1, data.user2);

          console.log('ctr value: ' + ctr);
          const newRoomRef = doc(firestoreDb, 'rooms', 'room' + ctr);

          console.log('newRoomRef value:' + newRoomRef);
          const newRoomData = await getDoc(newRoomRef);

          console.log('newRoomData value:' + newRoomData)

          roomNumber.value = newRoomData.data().roomNumber;

          const newData = {
            'user1': data.user1,
            'user2': data.user2,
            'time_started_searching': data.time_started_searching,
            'roomNumber': roomNumber.value
          }

          await setDoc(targetDocFromMatchesCollection.ref, newData);

          readyToShowRoom.value = true;
          finished = true;
        }
      });



      console.log(readyToShowRoom)
    } else {
      unsubscribe = onSnapshot(targetDocFromMatchesCollection.ref, (docSnapshot => {
          const currentData = docSnapshot.data();

          console.log(currentData);

          if ('roomNumber' in currentData && !finished) {
            readyToShowRoom.value = true;
            finished = true;
            roomNumber.value = currentData['roomNumber'];
            console.log(readyToShowRoom);
          }
          else {
            console.log('huh');
          }
      }))
    }


})



</script>

<template>
  <Suspense>
    <div v-if="!readyToShowRoom" class="flex justify-center items-center min-h-screen bg-gray-900">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-300 mt-4 text-lg">Finding match, please wait...</p>
      </div>
    </div>

    <div v-else>
      <ChatBox :room-number="roomNumber"/>
    </div>
  </Suspense>

</template>

<style scoped>

</style>