import { useEffect, useState } from 'react'
import InputField from '../../components/Inputfield/InputField.component'
import { useParams, useSearchParams } from 'react-router-dom'
import { db } from '../../firebase/Firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Button from '../../components/Button/Button.component'
import { useToast } from '@chakra-ui/react'
import { ToastStrings } from '../../constants/ToastStrings'
import Lottie from "lottie-react";
import edit from '../../assets/Edit Post.json'


export const EditPost = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const toast = useToast()
    const [isFetching, setIsFetching] = useState(true)
    useEffect(() => {
        const getData = async () => {
            const snapshot = await getDoc(doc(db, `${type == 'general' ? 'General Posts' : 'Community Posts'}`, id));
            const data = snapshot.data();
            setTitle(data.Title)
            setDescription(data.Description)
            setIsFetching(false)
        };
        getData();
    }, [id, type]);
    const handleEditPost = async () => {
        if (title.trim().length == 0 || description.trim().length == 0) {
            toast({
                title: 'Error',
                description: 'Title and Description cannot be empty',
                status: 'error',
                duration: ToastStrings.duration,
                isClosable: true,
            })
            return
        }
        //update the doc
        const docRef = doc(db, `${type == 'general' ? 'General Posts' : 'Community Posts'}`, id)
        await updateDoc(docRef, { Title: title, Description: description, Edited: true })
        toast({
            title: 'Success',
            description: 'Title and Description has been updated',
            status: 'success',
            duration: ToastStrings.duration,
            isClosable: true,
        })
    }
    if (isFetching)
        return <h1>loading...</h1>
    return (
        <>
        <div className='flex justify-center items-center '>
        <div className='flex flex-col gap-2 w-96 bg-primary dark:bg-secondary p-2 m-4 rounded-lg shadow px-4 py-4 dark:border'>
            <p className='font-semibold text-blAccent text-3xl text-center font-[teko]'>Edit Your Post</p>
            <label className='font-semibold dark:text-textPrimary'>Title</label>
            <InputField placeholder='Enter new title' value={title} setValue={setTitle} />
            <label className='font-semibold dark:text-textPrimary'>Description</label>
            <InputField placeholder='Enter new description' value={description} setValue={setDescription} maxLength={5000} type={'textarea'} />
            <Button isDisabled={false} outline={false} onClickHandler={() => handleEditPost()}>
                Edit Post
            </Button>
            
        </div>
        <div className="text-center md:flex hidden items-center justify-center">
                <div className='w-72 h-auto'>
                    <Lottie animationData={edit} loop={true} />
                </div>
            </div>
        </div>
        </>
    )
}
