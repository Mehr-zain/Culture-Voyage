import { uploadImageAssetToCloudinary } from "../cloudinary/Cloudinary.js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/Firebase.js'
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { ToastStrings } from "../constants/ToastStrings.js";
import imageCompression from 'browser-image-compression';
export const useUpdateImage = () => {
    const [imageAsset, setImageAsset] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState(false)
    const [isImageUpdating, setIsImageUpdating] = useState(false)
    const toast = useToast()
    const uploadImageAssetAndUpdateDoc = async (collectionNameToUpdate, docId, type = null) => {
        setIsImageUpdating(true)
        const { secure_url, public_id } = await uploadImageAssetToCloudinary(imageAsset)
        if (collectionNameToUpdate === 'Communities') {
            if (type == 'banner') {
                await updateDoc(doc(db, "Communities", docId), {
                    ['Banner URL']: secure_url,
                    ['Banner Public ID']: public_id,
                });
            }
            else {
                await updateDoc(doc(db, "Communities", docId), {
                    ['Community Logo URL']: secure_url,
                    ['Logo Public Id']: public_id,
                });
            }
        } else if (collectionNameToUpdate === 'Users') {
            await updateDoc(doc(db, "Users", docId), {
                Avatar: secure_url,
            });
        }
        toast({
            title: "Image updated Successfully",
            status: "success",
            duration: ToastStrings.duration,
            isClosable: true,
        });
        setIsImageChanged(false)
        setIsImageUpdating(false)
    }
    const handleImageChange = async (e, type) => {
        const file = e.target.files[0];
        if (file.size / 1000000 >= 3)
            return alert('Image file must be less than 3mb')
        setIsImageChanged(true)
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: type === 'sm' ? 200 : 10000,
            useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options);

        if (file) {
            setImageAsset(compressedFile);
        } else {
            setImageAsset(null);
        }
    };

    return { imageAsset, uploadImageAssetAndUpdateDoc, handleImageChange, isImageChanged, isImageUpdating, setImageAsset, setIsImageChanged }
}