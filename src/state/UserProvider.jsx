import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection, query, where } from "firebase/firestore/lite";
import { db } from "../firebase.config";
const UserContext = createContext();
//REFRENCE
//Access user_info -> user_ctx.user.user_info
//        ->[uid, user_name ,feeds]
export default function UserProvider({ children }) {
  const userCollectonRef = collection(db, "user");
  const [user, loading, error] = useAuthState(auth);
  const [tweetModal, setTWeetModal] = useState(false);
  const [refresh,setRefresh] = useState(0) ;
  const [navClicks, setNavClicks] = useState({
    home: false,
    notification: false,
    profile: false,
    logout: false,
  });
  const [User, setUser] = useState({
    user: user, //authenticated user
    user_loading: loading,
    error: error,
    user_info: null, //it will hold the generated user_name,tweets,feeds
  });
  const updateUser = async () => {
    var endResult = null;
    if (user) {
      console.log(user);
      const uid = user.uid;
      const q = query(userCollectonRef, where("uid", "==", uid));
      try {
        endResult = await getDocs(q);
      } catch (error) {
        console.log(error);
      }
    }
    let userInfo = null;
    if (endResult?.size > 0)
      userInfo = {
        user_name: endResult.docs[0].data().user_name,
        uid: endResult.docs[0].data().uid,
        id: endResult.docs[0].id,
        tweets : endResult.docs[0].data()?.tweets?endResult.docs[0].data()?.tweets:[] 
      };
    setUser({
      user: user,
      user_loading: loading,
      error: error,
      user_info:userInfo
    });
    console.log(userInfo) ;
  };
  useEffect(() => {
    updateUser();
  }, [user, loading, error,refresh]);
  const state = {
    user: User,
    navClicks: navClicks,
    tweetModal: tweetModal,
    setUser: setUser,
    setNavClicks: setNavClicks,
    setTWeetModal: setTWeetModal,
    setRefresh : setRefresh //icrrement its value by 1 to refresh the useeffect to get lastest information hack
  };

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}
export { UserContext };
