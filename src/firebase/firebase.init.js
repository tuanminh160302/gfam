// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, collection, getDocs, where, query, deleteField } from "firebase/firestore";
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

  fileList.map(async (file, index) => {
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
                [url]: [url, index]
              }
            },
          }, { merge: true })
          .then(() => {
            getDoc(postRef).then((snapshot) => {
              return Object.keys(snapshot.data()).length - 1
            }).then((postCount) => {
              setDoc(userRef, {postCount: postCount}, {merge: true})
            })
            console.log("Successfully uploaded")
          }).catch(err => console.log(err))
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

export const fetchUserPost = async (uid) => {
  if (!uid) {
    return
  }

  let data = null

  const postRef = doc(db, 'posts', uid)
  await getDoc(postRef).then((snapshot) => {
    if (!snapshot.exists()) {
      // console.log("this user has no post yet")
    } else if (snapshot.exists()) {
      data = snapshot.data()
      // console.log("this user has", Object.keys(data).length - 1, "post")
      // console.log('data =>', data)
    }
  }).catch((err) => {console.log(err)})

  return data
}

export const uploadUserComment = async (uidFrom, uidTo, post, [commentTimestamp, comment]) => {
  if (!uidFrom || !uidTo) {
    return
  }

  const postRef = doc(db, 'posts', uidTo)
  try {
    await setDoc(postRef, 
      {
        [post]: {
          comment: {
            [commentTimestamp]: [comment, uidFrom]
          }
        }
      }, {merge: true})
      console.log('Comment added')
  } catch (err) {
    console.log(err)
  }
}

export const followAction = async (uidFrom, uidTo, isFollow) => {
  if (!uidFrom || !uidTo) {
    return
  }

  const createdAt = new Date().getTime()

  const userFromRef = doc(db, 'users', uidFrom)
  const userToRef = doc(db, 'users', uidTo)
  
  let fromUser = null
  let toUser = null

  await getDoc(userFromRef).then((snapshot) => {
    fromUser = snapshot.data().userName
  })

  await getDoc(userToRef).then((snapshot) => {
    toUser = snapshot.data().userName
  })

  try {
    if (!isFollow) {
      await setDoc(userFromRef, 
        {
          socialStatus: {
            following: {
              [uidTo]: [toUser, createdAt]
            },
          }
        }, {merge: true})

      await setDoc(userToRef, 
        {
          socialStatus: {
            follower: {
              [uidFrom]: [fromUser, createdAt]
            }
          }
        }, {merge: true})

      console.log('follow action pushed')
    } else if(isFollow) {
      await setDoc(userFromRef, 
        {
          socialStatus: {
            following: {
              [uidTo]: deleteField()
            }
          }
        }, {merge: true})

      await setDoc(userToRef, 
        {
          socialStatus: {
            follower: {
              [uidFrom]: deleteField() 
            }
          }
        }, {merge: true})
      console.log('unfollow action pushed')
    }
  } catch (err) {
    console.log(err)
  }
}

export default firebaseApp;

