import { collection, query, where, documentId, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { getUserData } from "../utils/Firebase Utils Functions/index.js";
import { useEffect, useState } from 'react';
import { CommunityDto } from "../dto/CommunityDto.js";

export const useFetchJoinedCommunities = (userId) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [isFetchingJoinedCommunities, setIsFetchingJoinedCommunities] = useState(true);

  useEffect(() => {

    (async () => {
      const joinedCommunitiesIds = await getUserData(userId, 'Joined Communities') ?? [];
      if (joinedCommunitiesIds.length > 0) {
        onSnapshot(query(collection(db, 'Communities'), where(documentId(), 'in', joinedCommunitiesIds)), snapshots => {
          let data = []
          snapshots.forEach(snapshot => {
            const communityData = snapshot.data();
            const community_dto = new CommunityDto(communityData)
            data.push({ id: snapshot.id, ...community_dto });
          })
          setJoinedCommunities(data);
          setIsFetchingJoinedCommunities(false)
        })
      }
      else {
        setIsFetchingJoinedCommunities(false)
      }

    })()

  }, [userId])

  return { joinedCommunities, isFetchingJoinedCommunities, setJoinedCommunities };
};
