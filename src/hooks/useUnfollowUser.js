// useUnfollowUser.js
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import { useToast } from "@chakra-ui/react";
import { ToastStrings } from "../constants/ToastStrings";

export default function useUnfollowUser(loggedInUser_Id, userToUnfollow_Id) {
  const [alreadyUnfollowing, setAlreadyUnfollowing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", loggedInUser_Id), (doc) => {
      const followings = doc.data().Followings || [];
      setAlreadyUnfollowing(!followings.includes(userToUnfollow_Id));
    });

    return () => unsubscribe();
  }, [loggedInUser_Id, userToUnfollow_Id]);

  const unfollow = async (userToUnfollow_Id) => {
    const userToUnfollowDocRef = doc(db, "Users", userToUnfollow_Id);
    const loggedInUserDocRef = doc(db, "Users", loggedInUser_Id);

    await updateDoc(userToUnfollowDocRef, {
      Followers: arrayRemove(loggedInUser_Id),
    });

    await updateDoc(loggedInUserDocRef, {
      Followings: arrayRemove(userToUnfollow_Id),
    });
    toast({
      title: "User Unfollowed",
      duration: ToastStrings.duration,
      status: "success",
      isClosable: true,
    });
  };

  return { unfollow, alreadyUnfollowing };
}
