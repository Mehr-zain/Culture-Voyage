import { useLocation } from "react-router-dom";
import InputField from "../Inputfield/InputField.component";
import { useState } from "react";
import { User, AttachCircle } from 'iconsax-react'
import { Colors } from '../../constants/Colors'
import edit from '../../assets/edit.json'
import Lottie from 'lottie-react'
import { TagsInput } from "../TagsInput/TagsInput";
import Button from '../Button/Button.component'
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { CHARACTERS_LIMITS } from "../../constants/CharacterLimits";
export function EditProfileForm() {
    const { state } = useLocation()
    const { id, aboutt, first_name, last_name, user_name, exp } = state
    const [username, setusername] = useState(user_name)
    const [firstname, setFirstname] = useState(first_name)
    const [lastname, setLastName] = useState(last_name)
    const [about, setAbout] = useState(aboutt || '')
    const [type] = useState(exp || 'Add Experiences')
    const [tags, setTags] = useState([]);
    const [tagInputValue, setTagInputValue] = useState('')
    //function to update profile
    const { isUpdating, update } = useUpdateProfile()
    return (
        <div className="w-full flex justify-around">

            <div className="w-auto bg-primary dark:bg-transparent p-4 rounded-xl shadow-lg" >
                <div className="mb-4 flex gap-4 ">
                    <div>
                        <h1 className="dark:text-textPrimary text-textSecondary my-2">First Name</h1>
                        <InputField value={firstname} setValue={setFirstname} >
                            <User size="25" color={Colors.accent} />
                        </InputField>
                    </div>
                    <div>
                        <h1 className="dark:text-textPrimary text-textSecondary my-2">Last Name</h1>
                        <InputField value={lastname} setValue={setLastName} >
                            <User size="25" color={Colors.accent} />
                        </InputField>
                    </div>

                </div>
                <div className="my-4">
                    <h1 className="dark:text-textPrimary text-textSecondary my-2">User Name</h1>
                    <InputField value={username} setValue={setusername} >
                        <AttachCircle size="25" color={Colors.accent} />
                    </InputField>
                </div>
                <div className="my-4">
                    <h1 className="dark:text-textPrimary text-textSecondary my-2">About</h1>
                    <InputField maxLength={CHARACTERS_LIMITS.userAbout} type='textarea' placeholder='Write something about yourself...' value={about} setValue={setAbout} >
                        {/* <User size="25" color={Colors.accent} /> */}

                    </InputField>
                </div>
                <h1 className="dark:text-textPrimary text-textSecondary my-2">Add Experiences</h1>
                <div className={'my-4 flex items-center justify-center w-full'}>
                    <TagsInput placeholder={'Add Tags'} tags={tags} type={type} setTags={setTags} tagInputValue={tagInputValue} setTagInputValue={setTagInputValue} />
                </div>
                <div className=''>

                    <Button isDisabled={isUpdating} onClickHandler={() => update(id, { lastname, firstname, username, about })}>
                        {isUpdating ? 'Updating...' : 'Update '}
                    </Button>

                </div>
            </div>
            <div className="text-center md:flex hidden items-center justify-center">
                <div className='w-72 h-auto'>
                    <Lottie animationData={edit} loop={true} />
                </div>
            </div>
        </div>
    )
}
