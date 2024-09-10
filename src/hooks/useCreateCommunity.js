import { CommunityModel } from "../Models/CommunityModel.js";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { ToastStrings } from "../constants/ToastStrings.js";
import { UserContext } from "../context/AuthContext.jsx";
import { docExistsOrNot, getUserData } from "../utils/Firebase Utils Functions/index.js";
import { uploadImageAssetToCloudinary } from "../cloudinary/Cloudinary.js";

export const useCreateCommunity = () => {
  const toast = useToast();
  const { user } = useContext(UserContext);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null)

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState('Select the community type')
  const [imageAsset, setImageAsset] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState('')
  const handleCreateCommunity = async () => {
    setError(null)
    if (!imageAsset || !title || !description) {
      setError("Logo image, name and  description cannot be empty!!!")
      setTimeout(() => setError(null), 3000)
      return;
    }
    try {
      setIsCreating(true);
      const userData = await getUserData(user?.uid)//this can be replaced with local storage for better efficientcy
      const userCreatedCommunities = userData['User Created Communities'] ?? []
      const communityNameAlreadyExists = await docExistsOrNot("Communities", "Community Name", "==", title)
      if (userCreatedCommunities.length === 1) {
        setError("You have already created a community.You cannot create more than one community")
        setIsCreating(false);
        setTimeout(() => setError(null), 3000);
      }
      else if (communityNameAlreadyExists) {
        setError("Community name already exists")
        setIsCreating(false);
        setTimeout(() => setError(null), 3000)
      }
      else {
        const { secure_url, public_id } = await uploadImageAssetToCloudinary(imageAsset)
        const createdBy = user?.uid;
        const userCountry = userData.Country
        const communityModel = new CommunityModel(secure_url, title, description, createdBy, public_id, type, tags, userCountry);
        const { id } = await addDoc(collection(db, "Communities"), { ...communityModel });
        //update the communities field inside users collection
        userCreatedCommunities.push(id)
        const toBeUpdated = {
          ["User Created Communities"]: userCreatedCommunities
        }
        await updateDoc(doc(db, 'Users', user.uid), toBeUpdated)
        toast({
          title: "Community created successfully!",
          status: "success",
          duration: ToastStrings.duration,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating community:", error);
      setError("An error occurred. Please try again later")
    } finally {
      setImageAsset(null)
      setTitle("")
      setDescription("")
      setType("Select the community type");
      setTags([])
      setIsCreating(false);
    }
  };

  return { handleCreateCommunity, type, setType, tags, setTags, tagInputValue, setTagInputValue, error, isCreating, setIsCreating, title, setTitle, description, setDescription, imageAsset, setImageAsset };
};
