
import { Route, Routes } from "react-router-dom";
import LoginPage from "../LoginPage/Login.page.jsx";
import RegisterPage from "../RegisterPage/RegisterPage.jsx";
import EmailVerificationPage from "../EmailVerificatioinPage/EmailVerificationPage.jsx";
import AdditionalInformationPage from "../AdditionalInformationPage/AdditionalInformationPage.jsx";
import ForgetPasswordPage from "../ForgetPassword/ForgetPasswordPage.jsx";
import HomePage from "../HomePage/HomePage.jsx";
export default function RoutesContainer() {

    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} exact />
            <Route path='/register' element={<RegisterPage />} exact />
            <Route path='/forgetpassword' element={<ForgetPasswordPage />} exact />
            <Route path='/emailverification' element={<EmailVerificationPage />} exact />
            <Route path='/additionalinformation' element={<AdditionalInformationPage />} exact />
            <Route path='/*' element={<HomePage />} />
        </Routes>
    )
}
