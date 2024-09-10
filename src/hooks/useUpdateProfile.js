import { useState } from "react"
import { db } from '../firebase/Firebase'
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore'
import { useToast } from "@chakra-ui/react"
import { ToastStrings } from '../constants/ToastStrings'
import { docExistsOrNot } from "../utils/Firebase Utils Functions"
export const useUpdateProfile = () => {

    const [isUpdating, setIsUpdating] = useState(false)
    const toast = useToast()
    const update = async (id, data) => {

        const { firstname, lastname, username, about } = data
        if (!firstname.trim() || !lastname.trim() || !username.trim()) {
            toast({
                title: 'Username, first and last cannot be empty',
                duration: ToastStrings.duration,
                status: 'warning',
                isClosable: true
            })
            return
        }
        setIsUpdating(true)
        const dataToUpdate = {}
        dataToUpdate['First Name'] = firstname.trim()
        dataToUpdate['Last Name'] = lastname.trim()
        dataToUpdate['Username'] = username.trim()
        dataToUpdate['About'] = about.trim()

        try {

            const querySnapshot = await getDocs(collection(db, 'Users'));
            const existingUserDocs = querySnapshot.docs.filter(doc => doc.id !== id)
            const existingUsernames = existingUserDocs.map(doc => doc.data().Username);
            if (existingUsernames.includes(username)) {
                toast({
                    title: 'Username Already Exists! Try a new one...',
                    duration: ToastStrings.duration,
                    status: 'warning',
                    isClosable: true
                })
                setIsUpdating(false)
                return
            }

            await updateDoc(doc(db, 'Users', id), { ...dataToUpdate })
            setIsUpdating(false)
            toast({
                title: 'Update successful',
                duration: ToastStrings.duration,
                status: 'success',
                isClosable: true
            })
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'An error occurred while updating profile',
                duration: ToastStrings.duration,
                status: 'error',
                isClosable: true
            })
            setIsUpdating(false)
        }
    }
    return { isUpdating, update }

}
