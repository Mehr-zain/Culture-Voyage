import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase.js";
import { useNavigate } from "react-router-dom";


export const useCheckUserInformation = () => {
    const navigate = useNavigate();

    const isAdditionalInformationComplete = async (user) => {
        const response = await getDoc(doc(db, 'Users', user?.uid));

        if (response.exists()) {

            const userData = response.data();
            if (userData['First Name'] && userData['Last Name'] && userData['Username'] && userData['Country'] && userData['Country Code'] && userData['Country Dial Code'] && userData['National Number'] && userData['Phone Number'] && userData['Gender'] && userData['Date Of Birth']) {
                navigate('/')
            } else {
                console.log('in information if not exists')
                navigate('/additionalinformation')
            }
        } else {
            navigate('/additionalinformation')
        }
    }
    const checkIsEmailVerified = (user) => {
        if (!user?.emailVerified) {
            navigate('/emailverification')
        }
    }
    return { isAdditionalInformationComplete, checkIsEmailVerified }
}
