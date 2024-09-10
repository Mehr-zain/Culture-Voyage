import { useState, useContext } from 'react';
import { db } from "../firebase/Firebase.js";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { UserContext } from "../context/AuthContext.jsx";
import { ToastStrings } from "../constants/ToastStrings.js";
import { CommentModel } from '../Models/CommentModel.js';
import { useSearchParams } from 'react-router-dom';

export const useAddComment = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const { user } = useContext(UserContext);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [error, setError] = useState(null);

  const addComment = async (description, postID) => {

    try {
      setIsAddingComment(true);
      const commentModel = new CommentModel(user?.uid, description, postID);
      const { id } = await addDoc(collection(db, "Comments"), { ...commentModel });
      //place the id inside the post collection comments array.

      if (type == 'general') {
        const generalPostReference = doc(db, 'General Posts', postID)
        const generalPostSnapshot = await getDoc(generalPostReference)
        const generalPostDetails = generalPostSnapshot.data()
        const generalPostComments = generalPostDetails['Comments'] ?? []
        generalPostComments.push(id)
        const dataToUpdate = {}
        dataToUpdate['Comments'] = generalPostComments
        await updateDoc(generalPostReference, dataToUpdate)

      } else {
        const communityPostReference = doc(db, 'Community Posts', postID)
        const communityPostSnapshot = await getDoc(communityPostReference)
        const communityPostDetails = communityPostSnapshot.data()
        const communityPostComments = communityPostDetails['Comments'] ?? []
        communityPostComments.push(id)
        const dataToUpdate = {}
        dataToUpdate['Comments'] = communityPostComments
        await updateDoc(communityPostReference, dataToUpdate)

      }
      // const alreadyPresentComments = postDetail['Comments'] ?? []
      // console.log(alreadyPresentComments);

      toast({
        title: 'Comment added successfully!',
        status: 'success',
        duration: ToastStrings.duration,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('An error occurred while adding the comment. Please try again later.');
    } finally {
      setIsAddingComment(false);
    }
  };

  return { addComment, isAddingComment, error };
};
