// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, collection, getDocs, where, query } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNEBjLpzuhJECE7QQdY1Qw0ZOOPwQeKqY",
  authDomain: "gfam-3a921.firebaseapp.com",
  projectId: "gfam-3a921",
  storageBucket: "gfam-3a921.appspot.com",
  messagingSenderId: "334367044311",
  appId: "1:334367044311:web:cd178aec26bb6e1ff2f692",
  measurementId: "G-KR6MXBE8TJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
// ...

export const db = getFirestore();
export const storage = getStorage();

export const createUserCredentials = async (userCredentials, additionalData) => {
  const { uid } = userCredentials
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const createdAt = new Date();

    try {
      await setDoc(doc(db, "users", uid), {
        createdAt,
        uid,
        ...additionalData
      })

    } catch (err) {
      console.log('error creating user', err.message)
    }
  }
}

export const uploadUserAvatar = async (user, file) => {
  if (!user) {
    return
  }
  // Set up file collection
  const fileCollection = 'avatars'

  // Get user data
  const { uid } = user
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  // Get user username
  const userName = userSnap.data().userName
  const fileName = file.name

  // Set up
  const pathToFile = `users/${userName}/${fileCollection}/${fileName}`
  const fileRef = ref(storage, pathToFile)

  // Upload the file
  await uploadBytes(fileRef, file).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  })
  // Update the avatar url in the database
  getDownloadURL(ref(storage, pathToFile))
    .then((url) => {
      updateProfile(user, {
        photoURL: url
      }).then(() => {
        console.log("Profile updated")
        setDoc(userRef, { avatarURL: url }, { merge: true })
          .then(() => {
            console.log("Successfully uploaded")
            window.location.reload()
          }).catch(err => console.log(err))
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const uploadUserPost = async (user, fileList, caption) => {
  if (!user) {
    return
  }

  if (fileList.length === 0) {
    return
  }

  // Set up file collection
  const fileCollection = 'posts'
  // Get the time of upload
  const createdAt = new Date().getTime()

  // Get user data
  const { uid } = user
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  // Get user username
  const userName = userSnap.data().userName

  // Get posts document of user
  const postRef = doc(db, 'posts', uid)
  const postSnap = await getDoc(postRef)

  console.log(postSnap.exists)

  if (!postSnap.exists()) {
    await setDoc(postRef, { exist: true })
  }

  fileList.forEach(async (file) => {
    // Set up
    const fileName = file.name
    const pathToFile = `users/${userName}/${fileCollection}/${createdAt}/${fileName}`
    const fileRef = ref(storage, pathToFile)

    // Upload the file
    await uploadBytes(fileRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    })
    // Update the avatar url in the database
    getDownloadURL(ref(storage, pathToFile))
      .then((url) => {
        setDoc(postRef,
          {
            [createdAt]: {
              caption,
              archive: false,
              URLS: {
                [url]: url
              }
            },
          }, { merge: true })
          .then(() => {
            console.log("Successfully uploaded")
          }).catch(err => console.log(err))
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

export default firebaseApp;

