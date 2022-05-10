import React, { useRef, useState, useContext, useEffect } from "react";

import Navbar from "../components/Navbar";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import TextareaAutosize from "react-textarea-autosize";

import {
  PictureOutlined,
  CloseCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { UserContext } from "../state/UserProvider";
import SearchUser from "../components/SearchUser";
import shortid from "shortid";
import "./customcss.css";
import { collection, addDoc ,updateDoc,getDoc,doc} from "firebase/firestore/lite";
import { ref, getDownloadURL } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { db, storage } from "../firebase.config";
import toast, { Toaster } from "react-hot-toast";
export default function Home() {
  const [showFull, setShowFull] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [tweets,setTweets] = useState([]) ;
  const [uploadPost, setUploadPost] = useState({
    content: "",
    picture: null,
  });
  const [uploadFile, uploading, snapshot, up_error] = useUploadFile();
  const fileRef = useRef(null);
  const user_ctx = useContext(UserContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!uploadPost.content && !uploadPost.picture) return;
    let downloadURL = "";
    if (uploadPost.picture) {
      const randKey = shortid.generate();
      const storageRef = ref(
        storage,
        `Images/${uploadPost.picture.name + randKey}`
      );
      try {
        const result = await uploadFile(storageRef, uploadPost.picture, {
          contentType: "image/jpeg",
        });
        if (result) {
           downloadURL = await getDownloadURL(storageRef);
          console.log(downloadURL);
        }
      } catch (error) {
        console.log(error);
        toast.error("Unable to post tweet right now!");
      }
    }
    try {
      const tweetRef = collection(db, "tweet");
      const tweetRes = await addDoc(tweetRef, {
        picture: downloadURL,
        content: uploadPost.content,
      }); 
      const postedTweets = user_ctx.user.user_info?.tweets ? user_ctx.user.user_info.tweets : [] ; 
      postedTweets.push(tweetRes.id) ;
      const userDoc = doc(db,'user',user_ctx.user.user_info.id) ;  
      await updateDoc(userDoc , {
          tweets: postedTweets
      })
      toast.success('TWEETED!'); 
      user_ctx.setRefresh(refresh => refresh+1) ;
    } catch (error) {
      console.log(error);
      toast.error("Unable to post tweet right now!");
    }
    console.log(uploadPost);
  };

  const fetchAllPost = async (tweets) => {
    const allTweets = [];
    if (tweets.length === 0) return allTweets;
    for (let i = 0; i < tweets.length; ++i) {
      const docRef = doc(db, "tweet", tweets[i]);
      const tweet = await getDoc(docRef);
      if (tweet.exists()) allTweets.push(tweet.data());
    }  
    setTweets(allTweets) ;
  };
  useEffect(() => {
    if (user_ctx.user.user_info) {
      fetchAllPost(user_ctx.user.user_info.tweets);
    }
  }, [user_ctx.user.user_info]);

  const FormComponent = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="flex  space-x-3  ">
          <img
            src={user_ctx.user.user?.photoURL}
            alt=""
            className="h-12 w-12 rounded-full "
          />

          <div
            className={`w-full border-b-${
              showFull ? "[1px]" : "none"
            } border-b-gray-700 pb-5`}
          >
            <TextareaAutosize
              onClick={() => setShowFull(true)}
              onChange={(e) =>
                setUploadPost({ ...uploadPost, content: e.target.value })
              }
              className="bg-black text-white resize-none font-[Roboto] text-xl md:w-[70%] outline-none mt-2"
              placeholder="What's happening?"
            />
            {uploadPost.picture && (
              <div className="relative">
                <CloseCircleFilled
                  className="absolute text-2xl left-2 text-slate-800 hover:text-slate-700 cursor-pointer"
                  onClick={() =>
                    setUploadPost({ ...uploadPost, picture: null })
                  }
                />
                <img
                  src={URL.createObjectURL(uploadPost.picture)}
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`ml-16 ${
            showFull ? "mt-3" : "-mt-3"
          } flex items-center justify-between`}
        >
          <div
            className="hover:bg-sky-600 hover:bg-opacity-25 h-9 w-9 rounded-full text-center cursor-pointer"
            onClick={() => fileRef.current.click()}
          >
            <PictureOutlined className="text-sky-600 text-xl" />
          </div>
          <button
            disabled={!uploadPost.content && !uploadPost.picture}
            className={`bg-[#1D9BF0] ${
              !uploadPost.content && !uploadPost.picture
                ? "opacity-50"
                : "opacity-100"
            } px-6 py-2 text-md font-bold text-white rounded-full`}
          >
            Tweet
          </button>
        </div>

        <input
          onChange={(e) =>
            setUploadPost({ ...uploadPost, picture: e.target.files[0] })
          }
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          ref={fileRef}
        />
      </form>
    );
  };

  return (
    <div className="bg-black min-h-screen flex w-full">
      <Toaster />
      
      <Navbar />
      <div className="md:border-x-[1px] md:border-x-gray-700  max-h-screen overflow-scroll  w-full  ">
        <div className=" -mt-4 space-y-4 p-5 pb-3 border-b-[1px] border-b-gray-700  ">
          <h1 className="text-white font-bold text-xl">Home</h1>
          {FormComponent()}
        </div>
        <div>
        {tweets.length === 0 ? (
          <div className="px-5 flex items-start py-3 space-x-3 border-t-[1px] border-t-gray-800">
            <img
              src={user_ctx.user.user?.photoURL}
              alt=""
              className="h-12 w-12 rounded-full"
            />
            <div className="text-white font-[Roboto]">
              <h1 className="font-bold text-lg">
                {" "}
                {user_ctx.user.user?.displayName}
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
                asperiores sit, facilis iure iusto perferendis repellat nulla
                ipsum excepturi eos rem, accusamus earum quia ab odit inventore
                adipisci id cupiditate? Aspernatur reiciendis repudiandae
                voluptatum harum veniam, cupiditate temporibus illum perferendis
                consectetur quae voluptates ea vitae, hic error! Laudantium,
                necessitatibus error! Repellendus officiis ex consequuntur
                voluptas maxime. In distinctio labore expedita? Inventore,
                recusandae reiciendis! Nostrum beatae, laborum rem sint id vel
                culpa ab cumque laboriosam! Aut illum sapiente eos alias nemo
                omnis provident nesciunt numquam consectetur natus quis autem,
                unde quasi? Quam eius ipsum nesciunt, explicabo reiciendis
                voluptate optio obcaecati consectetur labore excepturi in
                repudiandae possimus perspiciatis minus, perferendis accusamus
                est nisi consequatur itaque autem cumque tempora ipsam facilis?
                Perspiciatis, eum. Velit non commodi odit, saepe quas enim
                laborum itaque eos, porro temporibus ab consequuntur fugit!
                Fugit explicabo assumenda qui ipsa, voluptate odit nobis hic
                optio. Placeat explicabo quam impedit consequatur? A quia
                repellendus ad et modi vitae sed quod qui placeat rem harum
                accusantium quibusdam error corrupti, laudantium blanditiis
                iusto? Expedita temporibus maiores aut mollitia quidem modi eum
                nulla! Aperiam! Aliquid corporis necessitatibus fugit,
                consequuntur itaque illum veniam, ut nesciunt eum error
                molestiae eos quisquam commodi eius esse laboriosam temporibus
                earum accusamus aperiam nulla voluptas sint. Dolore corrupti
                nihil deserunt! Ex blanditiis natus ducimus excepturi dolores
                voluptatem, facilis ea aliquid ad eos reprehenderit veritatis
                iusto, incidunt recusandae placeat voluptas assumenda saepe.
                Voluptatibus, culpa? Quia, natus! Consequatur dignissimos
                deserunt doloremque ad! Exercitationem reprehenderit possimus
                dolorum doloribus recusandae excepturi velit, delectus
                blanditiis, nihil nisi odit facere beatae non quam dolores eum
                corporis sapiente omnis totam eius et! Tempora libero
                consequatur harum ipsam. Culpa magni quaerat necessitatibus
                perspiciatis autem fugit itaque vero perferendis odio
                repudiandae recusandae aliquam, optio nobis? Esse impedit optio
                saepe dolor. Fugit at omnis doloremque iusto temporibus velit
                ducimus dolor!
              </p>
            </div>
          </div>
        ) : (
          tweets.map((tweet) => (
            <div className="px-5 flex items-start py-3 space-x-3 mt-2 border-t-[1px] border-gray-800">
              <img
                src={user_ctx.user.user?.photoURL}
                alt=""
                className="h-12 w-12 rounded-full"
              />
              <div className="text-white font-[Roboto]">
                <h1 className="font-bold text-lg">
                  {" "}
                  {user_ctx.user.user?.displayName}
                </h1>
                <p>{tweet.content}</p>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
      <SearchUser />
    </div>
  );
}
