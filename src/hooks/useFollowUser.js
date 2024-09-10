// useFollowUser.js
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import { getUserData } from "../utils/Firebase Utils Functions";
import { useToast } from "@chakra-ui/react";
import { ToastStrings } from "../constants/ToastStrings";

export default function useFollowUser(loggedInUser_Id, userToFollow_Id) {
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", loggedInUser_Id), (doc) => {
      const following = doc.data().Followings || [];
      setAlreadyFollowing(following.includes(userToFollow_Id));
    });

    return () => unsubscribe();
  }, [loggedInUser_Id, userToFollow_Id]);

  const follow = async (userToFollow_Id) => {
    const userToFollowDocRef = doc(db, "Users", userToFollow_Id);
    const loggedInUserDocRef = doc(db, "Users", loggedInUser_Id);

    await updateDoc(userToFollowDocRef, {
      Followers: arrayUnion(loggedInUser_Id),
    });

    await updateDoc(loggedInUserDocRef, {
      Followings: arrayUnion(userToFollow_Id),
    });
    toast({
      title: "User Followed",
      duration: ToastStrings.duration,
      status: "success",
      isClosable: true,
    });
  };

  return { follow, alreadyFollowing };
}
