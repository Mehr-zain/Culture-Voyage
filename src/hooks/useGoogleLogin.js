import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase/Firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserModel } from "../Models/UserModel.js";
import { FireBaseErrorHandler } from "../utils/index.js";
import { ToastStrings } from "../constants/ToastStrings.js";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";


export const useGoogleLogin = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const toast = useToast()

    const handleGoogleLogin = async (e) => {
        setIsGoogleLoading(true)
        e.preventDefault()
        const provider = new GoogleAuthProvider();
        try {
            const { user } = await signInWithPopup(auth, provider)
            //check if user is already present or not
            const alreadyPresentUser = await getDoc(doc(db, 'Users', user.uid))
            if (!alreadyPresentUser.exists()) {
                //saving user data in firestore
                const newUser = new UserModel(user.email)
                await setDoc(doc(db, 'Users', user.uid), { ...newUser })
            }
            setIsGoogleLoading(false)
        } catch (error) {
            setIsGoogleLoading(false)
            const errorMessage = FireBaseErrorHandler(error.code)
            //TODO show toast
            toast({
                title: errorMessage,
                status: 'error',
                duration: ToastStrings.duration,
                isClosable: true
            })
        }
    };

    return { handleGoogleLogin, isGoogleLoading }
}