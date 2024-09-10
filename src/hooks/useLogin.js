import { ZodLoginSchema } from "../utils/index.js";
import { ToastStrings } from "../constants/ToastStrings.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase.js";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import { FireBaseErrorHandler } from "../utils/index.js";


export const useLogin = () => {
    const toast = useToast()
    const navigation = useNavigate()
    const [isLogging, setIsLogging] = useState(false)
    const HandleLogin = async (e, email, password) => {

        e.preventDefault()
        //perform the zod validation
        try {
            ZodLoginSchema.parse({ email, password });

        } catch (errors) {
            let LoginErrors = JSON.parse(errors);
            LoginErrors.forEach(error => {
                toast({
                    title: 'Invalid Email or Password.',
                    description: error.message,
                    status: 'error',
                    duration: ToastStrings.duration,
                    isClosable: true,
                })
            })
            return;
        }
        //if user inputs passed the validation then login
        setIsLogging(true)
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password)
            // if (user)
            //     navigation("/home")

        } catch (error) {

            const errorMessage = FireBaseErrorHandler(error.code)
            toast({
                title: errorMessage,
                duration: ToastStrings.duration,
                status: 'error',
                isClosable: true
            })
        } finally {
            setIsLogging(false)
        }

    };

    return { HandleLogin, isLogging, setIsLogging }
}
