import "react-phone-number-input/style.css";

import { useContext, useState, useEffect } from "react";
import InputField from "../../components/Inputfield/InputField.component";
import { User, CalendarSearch, UserSquare } from "iconsax-react";
import Button from "../../components/Button/Button.component";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Firebase.js";
import { UserContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import { useCheckUserInformation } from "../../hooks/useCheckUserInformation.js";
import { Spinner } from "@chakra-ui/react";
import { Colors } from "../../constants/Colors.js";
import { formatDate } from "../../utils/index.js";
import { docExistsOrNot } from "../../utils/Firebase Utils Functions/index.js";
import './style.css'
import { useToast } from "@chakra-ui/react";
import { ToastStrings } from "../../constants/ToastStrings.js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner.jsx";

// eslint-disable-next-line react/prop-types

const AdditionalInformationPage = () => {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDOB] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const navigation = useNavigate();
  const { user, isLoading, isGoogleLoading } = useContext(UserContext);
  const { checkIsEmailVerified, isAdditionalInformationComplete } = useCheckUserInformation()
  useEffect(() => {
    if (!isLoading && !user) {
      navigation('/login')
      return
    }
    if (!isLoading && user) {
      checkIsEmailVerified(user)
      if (user.emailVerified && !isGoogleLoading)
        isAdditionalInformationComplete(user)
    }
  }, [user, isLoading])
  if (isLoading)
    return <div className={'flex items-center justify-center h-screen w-screen'} size={'lg'}><Spinner color={Colors.accent} /></div>
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !dob || !username || !gender || !phoneNumber) {
      toast({
        title: 'Warning',
        description: 'Fill in all the fields',
        duration: ToastStrings.duration,
        status: 'error',
        isClosable: true
      });
      return;
    }
    setSaving(true)
    const DOB = formatDate(new Date(dob))
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
    const countryCode = `+${parsedPhoneNumber?.countryCallingCode || ""}`;
    const countryDialCode = parsedPhoneNumber?.country || "";
    const nationalNumber = parsedPhoneNumber?.nationalNumber || "";
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${countryDialCode}`
    );
    const country = response.data?.[0]?.name?.common || "";
    const userNameAlreadyExists = await docExistsOrNot("Users", "Username", "==", username)
    if (userNameAlreadyExists) {
      toast({
        title: 'Username Already Exists',
        duration: ToastStrings.duration,
        status: 'warning',
        isClosable: true
      })
      setSaving(false)
      return
    }
    if (age < 13) {
      toast({
        title: 'Age is less than 13',
        description: 'You must be at least 13 years old to register.',
        duration: ToastStrings.duration,
        status: 'error',
        isClosable: true
      });
      setSaving(false)
      return;
    }
    else {
      await updateDoc(doc(db, "Users", user.uid), {
        ["First Name"]: firstName,
        ["Last Name"]: lastName,
        ["Username"]: username,
        ["Country"]: country,
        ["Country Code"]: countryDialCode,
        ["Country Dial Code"]: countryCode,
        ["National Number"]: nationalNumber,
        ["Phone Number"]: phoneNumber,
        ["Gender"]: gender,
        ["Date Of Birth"]: DOB,
        ["Phone Verified"]: false,
      });
    }
    setSaving(false)
    navigation("/");
  };

  return (
    <div className="min-h-screen bg-primary dark:bg-secondary text-text flex items-center justify-center">
      <div className="p-8 border border-borderPrimary dark:border-borderSecondary rounded-xl shadow-xl ">
        <h2 className="md:text-2xl text-md font-semibold text-center my-4 dark:text-primary text-secondary">Basic Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-2 md:flex-row flex-col">
            <InputField
              type="First Name"
              value={firstName}
              setValue={setFirstName}
              placeholder="First Name"
            >
              <User color="#808998" />
            </InputField>
            <InputField
              type="Last Name"
              value={lastName}
              setValue={setLastName}
              placeholder="Last Name"
            >
              <User color="#808998" />
            </InputField>
          </div>

          <div className="mb-4">
            <InputField type="Username" value={username} placeholder="Username" setValue={setUsername}>
              <UserSquare color="#808998" />
            </InputField>
          </div>
          <div className="mb-4">
            <InputField type="date" value={dob} setValue={setDOB}>
              <CalendarSearch color="#808998" />
            </InputField>
          </div>
          <div className="mb-4">
            <div className="w-full py-2 px-4 text-lg border-2 border-borderPrimary dark:border-borderSecondary rounded-lg focus-within:border-accent">
              <PhoneInput
                className="dark:text-textPrimary text-secondary PhoneInputInput"

                international
                placeholder="Enter phone number (9230000000000)"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </div>
          </div>
          <div className="mb-4">
            <select
              className="w-full py-2 px-4 text-lg border-2 border-borderPrimary dark:border-borderSecondary rounded-lg focus-within:border-accent dark:bg-secondary dark:text-textPrimary outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button onClickHandler={() => null} isDisabled={saving} >
            {saving ? <LoadingSpinner /> : 'Save'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdditionalInformationPage;
