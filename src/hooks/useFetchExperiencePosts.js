import { collection, query, where, documentId, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { getCommunityData } from "../utils/Firebase Utils Functions/index.js";
import { useEffect, useState } from 'react';


export const useFetchExperiencePosts = (communityId) => {
  const [experiencePosts, setExperiencePosts] = useState([]);
  const [isFetchingExperiencePosts, setIsFetchingExperiencePosts] = useState(true);

  useEffect(() => {

    (async () => {
      const experiencePostsIds = await getCommunityData(communityId, 'Experience Posts') ?? [];
      if (experiencePostsIds.length > 0) {
        onSnapshot(query(collection(db, 'Community Posts'), where(documentId(), 'in', experiencePostsIds)), snapshots => {
          let data = []
          snapshots.forEach(snapshot => {
            const postData = snapshot.data();
            data.push({ id: snapshot.id, ...postData });
          })
          setExperiencePosts(data);
          setIsFetchingExperiencePosts(false)
        })
      }
      else {
        setIsFetchingExperiencePosts(false)
      }
    })()

  }, [communityId])

  return { experiencePosts, isFetchingExperiencePosts, setExperiencePosts };
};
