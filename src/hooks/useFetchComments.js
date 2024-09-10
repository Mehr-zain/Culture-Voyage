import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from "../firebase/Firebase.js";

export const useFetchComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    setIsLoading(true);
    setError(null);

    const commentsQuery = query(
      collection(db, 'Comments'),
      where('Post ID', '==', postId),
    );
    const unsub = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      commentsData.sort((a, b) => b['Created At'] - a[['Created At']]);
      setComments(commentsData);
      setIsLoading(false);
      setIsLoading(false);

    });
    return () => unsub()

  }, [postId]);

  return { comments, isLoading, error };
};
