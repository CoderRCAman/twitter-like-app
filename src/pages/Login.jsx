import React, { useEffect, useContext } from "react";
import twitterGif from "../assets/icons8-twitter-gif.gif";
import googleIcon from "../assets/google-icon.png";
import { auth } from "../firebase.config";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../state/UserProvider";
import { TwitterOutlined } from "@ant-design/icons";
import {
  collection,
  addDoc,
  getDocs,
  where,
} from "firebase/firestore/lite";
import { db } from "../firebase.config";
import slugify from "slugify";
import shortid from "shortid";
export default function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();
  const user_ctx = useContext(UserContext);
  const userCollectionRef = collection(db, "user");
  const updateUserName = async () => {
    const uid = user.user.uid;
    //check if user already exist?
    try {
      const endResult = await getDocs(
        userCollectionRef,
        where("uid", "==", uid)
      );
      if (endResult.size === 0) {
        //no user_name exist
        const newUserName = slugify(user.user.displayName) + shortid.generate();
        await addDoc(userCollectionRef, {
          uid: uid,
          user_name: newUserName,
        });
      }
      navigate("/home");
    } catch (error) {}
  };

  useEffect(() => {
    if (user && user_ctx.user) {
      updateUserName();
    }
  }, [user_ctx?.user.user]);
  return (
    <div className="min-h-screen  grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <TwitterOutlined className="text-white absolute text-[300px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] " />

        <img
          alt=""
          draggable="false"
          src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png"
          className=" w-full object-cover   h-screen"
        />
      </div>
      <div className="bg-black">
        <div className=" ml-10  mt-10 space-y-10 flex flex-col justify-evenly">
          <div>
            <TwitterOutlined className="text-white text-4xl" />
          </div>
          <h1 className="md:text-6xl text-4xl  text-white font-bold">
            Happening Now!
          </h1>
          <div>
            <h1 className="text-cyan-200 font-familiy-[Roboto] text-2xl ">
              Login in to your account!
            </h1>
            <button
              disabled={loading}
              onClick={() => signInWithGoogle()}
              className={`opacity-${
                loading ? "50" : "100"
              } flex items-center px-5 py-2 space-x-2 bg-gray-200 rounded-full mt-4 hover:bg-gray-300`}
            >
              <img src={googleIcon} alt="googleicon" className="h-8 w-8" />
              <p className="text-gray-500 font-bold">GOOGLE</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
