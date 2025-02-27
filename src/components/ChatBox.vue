<script setup>
import {onMounted, ref, watchEffect} from 'vue';
import Message from './Message.vue';
import {collection, addDoc, doc, serverTimestamp, query, getDocs, onSnapshot} from "firebase/firestore";
import {firestoreDb} from "@/firebase.js";
import {useCurrentUser} from "vuefire";

const props = defineProps({
  roomNumber: Number
});

const user = useCurrentUser();
const currentUserID = ref(null);
const messages = ref([]);

while (user.value == null) {
  // do nothing
}


watchEffect(() => {
  if (user.value) {
    currentUserID.value = user.value.uid;
  }
});

let unsubscribe = null;

const newMessage = ref('');

const roomMessagesRef = collection(firestoreDb, 'rooms', 'room'+props.roomNumber, 'messages');
const queryLogicForAllMessages = query(roomMessagesRef);


const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {

    const localMsgData = {
      text: newMessage.value,
      uid: user.value.uid,
      photoURL: user.value.photoURL,
      createdOn: serverTimestamp()
    }

    await addDoc(roomMessagesRef, localMsgData)

    newMessage.value = '';
  }
};

onMounted(async () => {
  unsubscribe = onSnapshot(queryLogicForAllMessages, (collSnapshot) => {
    messages.value = collSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});
</script>



<template>
  <div class="w-full max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow">
    <div class="h-96 overflow-y-auto p-2 space-y-2 bg-white rounded-md">
      <Message v-for="(msg) in messages" :key="msg.id" :text="msg.text"
               :is-sent-by-this-client="msg.uid === currentUserID" :img-u-r-l="msg.photoURL" :time-sent="new Date(msg.createdOn.toDate())"/>
    </div>
    <div class="mt-4 flex">
      <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none"
          placeholder="Type a message..."
      />
      <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
        Send
      </button>
    </div>
  </div>
</template>

