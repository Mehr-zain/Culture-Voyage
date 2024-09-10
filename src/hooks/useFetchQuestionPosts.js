import { collection, query, where, documentId, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { getCommunityData } from "../utils/Firebase Utils Functions/index.js";
import { useEffect, useState } from 'react';


export const useFetchQuestionsPosts = (communityId) => {
  const [questionPosts, setQuestionPosts] = useState([]);
  const [isFetchingQuestionPosts, setIsFetchingQuestionPosts] = useState(true);


  useEffect(() => {

    (async () => {
      const questionPostsIds = await getCommunityData(communityId, 'Question Posts') ?? [];
      if (questionPostsIds.length > 0) {
        onSnapshot(query(collection(db, 'Community Posts'), where(documentId(), 'in', questionPostsIds)), snapshots => {
          let data = []
          snapshots.forEach(snapshot => {
            const postData = snapshot.data();
            data.push({ id: snapshot.id, ...postData });
          })
          setQuestionPosts(data);
          setIsFetchingQuestionPosts(false)
        })
      }
      else {
        setIsFetchingQuestionPosts(false)
      }

    })()

  }, [communityId])

  return { questionPosts, isFetchingQuestionPosts, setQuestionPosts };
};
