// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {doc, getDoc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore";
import {firebaseConfig} from "@/firebaseConfig.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const firebaseAppInstance = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseAppInstance);
const firestoreDb = getFirestore();


async function incrementCounter() {
    const counterRef =
        doc(firestoreDb, 'counter/Room Counter');

    const result = await getDoc(counterRef);

    let { room_count } = result.data();

    let counter = room_count;


    counter += 1;

    const updatedData = {
        room_count: counter
    }

    await setDoc(counterRef, updatedData);

    return counter;
}

async function createNewChatRoom(userid1, userid2) {
    const roomCounterVal = await incrementCounter();

    const roomData = {
        userid1: userid1,
        userid2: userid2,
        roomNumber: roomCounterVal,
        createdOn: serverTimestamp(),
    }

    await setDoc(doc(firestoreDb, 'rooms', 'room' + roomCounterVal), roomData)

    return roomCounterVal;
}


export { firebaseAppInstance, firestoreDb, analytics, createNewChatRoom }