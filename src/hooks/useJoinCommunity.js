import { doc, runTransaction } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/AuthContext.jsx";
import { getUserData } from "../utils/Firebase Utils Functions/index.js";
import { db } from "../firebase/Firebase.js";
import { useToast } from "@chakra-ui/react";
import { ToastStrings } from "../constants/ToastStrings.js";

const useJoinCommunity = (communityId) => {
  const toast = useToast();
  const { user } = useContext(UserContext);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);


  const checkJoinedStatus = useCallback(async (communityId) => {
    try {
      const joinedCommunities = await getUserData(user?.uid, 'Joined Communities');
      setIsJoined(joinedCommunities.includes(communityId));
    } catch (error) {
      console.error("Error checking joined status:", error);
    }
  }, [user?.uid])
  useEffect(() => {
    checkJoinedStatus(communityId)
  }, [communityId])

  const joinCommunity = async (communityId) => {
    if (isJoining)
      return;
    try {
      setIsJoining(true);
      setIsJoined(true);
      const userDocRef = doc(db, "Users", user.uid);
      const communityDocRef = doc(db, "Communities", communityId);

      await runTransaction(db, async (transaction) => {
        //read the existing joined communitites of user
        const snapshot = await transaction.get(userDocRef)
        const userData = snapshot.data()
        const joinedCommunitiesOfUser = userData['Joined Communities'] ?? []
        const updatedJoinedCommunities = [...joinedCommunitiesOfUser, communityId]
        const communitySnapshot = await transaction.get(communityDocRef)
        const communityData = communitySnapshot.data()
        const communityMembers = communityData['Members'] ?? []
        const updatedMembers = [...communityMembers, user.uid]
        transaction.update(userDocRef, {
          ["Joined Communities"]: [...updatedJoinedCommunities],
        })

        transaction.update(communityDocRef, {
          ["Members"]: [...updatedMembers],
        })
      })
      toast({
        title: "Community Joined Successfully!",
        status: "success",
        duration: ToastStrings.duration,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Joining Community",
        description: "An error occurred while joining the community.",
        status: "error",
        duration: ToastStrings.duration,
        isClosable: true,
      });
    } finally {
      setIsJoining(false)
    }
  };

  return { joinCommunity, isJoined, checkJoinedStatus, setIsJoined, isJoining };
};

export default useJoinCommunity;
