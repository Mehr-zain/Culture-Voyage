import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from "../../context/AuthContext.jsx";
import { useContext, useEffect } from "react";
import { useCheckUserInformation } from '../../hooks/useCheckUserInformation.js';

export const PrivateRoutes = () => {
    const { user, isLoading, isGoogleLoading } = useContext(UserContext)
    console.log(user);
    const { checkIsEmailVerified, isAdditionalInformationComplete } = useCheckUserInformation()
    // useEffect(() => {
    //     if (!isLoading && user) {
    //         checkIsEmailVerified(user)
    //         if (user.emailVerified && !isGoogleLoading)
    //             isAdditionalInformationComplete(user)
    //     }
    // }, [])
    //fetch user state
    return (!isLoading && user) ? <Outlet /> : <Navigate to={'/login'} />
}