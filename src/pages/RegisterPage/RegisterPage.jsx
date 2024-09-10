import { Lock, SmsTracking } from "iconsax-react";
import PasswordChecklist from "react-password-checklist";
import GoogleLogo from "../../assets/GoogleLogo.png";
// import Logo from "../../assets/Logo.png"; 
import WelcomeLight from '../../assets/Welocome2Light.json'
import WelcomeDark from '../../assets/Welcome2Dark.json.json'
import Button from "../../components/Button/Button.component";
import InputField from "../../components/Inputfield/InputField.component";
import NavigateLink from "../../components/NavigateLink/NavigateLink.component.jsx";
import SocialMediaButton from "../../components/SocialMediaButton/SocialMediaButton.component";
import strings from "../../constants/Strings";
import { Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import useSignup from "../../hooks/useSignup.js";
import { useGoogleLogin } from "../../hooks/useGoogleLogin.js";
import { UserContext } from "../../context/AuthContext.jsx";
import { useCheckUserInformation } from "../../hooks/useCheckUserInformation.js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import Lottie from "lottie-react";


export default function RegisterPage() {
  // const toast = useToast()
  // const { user } = useContext(UserContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleSignup, isSigningUp } = useSignup();
  const { handleGoogleLogin, isGoogleLoading } = useGoogleLogin();
  const { user, isLoading } = useContext(UserContext)
  const { isAdditionalInformationComplete, checkIsEmailVerified } = useCheckUserInformation()
  useEffect(() => {
    if (!isLoading && user) {
      checkIsEmailVerified(user)
      if (user.emailVerified && !isGoogleLoading)
        isAdditionalInformationComplete(user)
    }
  }, [checkIsEmailVerified, isAdditionalInformationComplete, isGoogleLoading, isLoading, user])
  return (
    <>
      <div className="min-h-screen flex justify-center md:flex-row flex-col">
        <div className="md:w-[50%]  dark:bg-secondary  md:min-h-screen  p-2 md:p-0 md:flex hidden flex-col items-center justify-center ">
          <div className="md:w-[300px] md:h-[300px] w-[200px] h-[200px]">
            <Lottie animationData={WelcomeLight} loop={true} className="dark:hidden block" />
            <Lottie animationData={WelcomeDark} loop={true} className="dark:block hidden" />
          </div>
          {/* <img src={Logo} className="md:w-[300px] md:h-[300px] w-[150px] h-[150px]" /> */}
          <h3 className="dark:text-textPrimary text-secondary  text-3xl font-[teko] font-bold">{strings.signUpHeading}</h3>
          <h3 className="dark:text-primary text-textSecondary text-lg text-center ">
                {strings.signUpHeading2}
              </h3>
        </div>
        <div className="md:h-auto h-screen gap-2 p-8  dark:bg-secondary  md:w-[50%] flex flex-col justify-center items-start ">
          <h3 className="dark:text-primary md:hidden block text-2xl text-center ">
            Register
          </h3>
          <form className="md:w-96 w-full border  px-4 p-8 rounded-xl dark:border-none dark:shadow-none lg:w-[400px] shadow-lg ">
            <div className="mb-4">
              <InputField type="email" value={email} placeholder="E-Mail" setValue={setEmail}>
                <SmsTracking className={'dark:text-primary text-darkGrey'} />
              </InputField>
            </div>
            <div className="mb-4">
              <InputField
                placeholder="Password"
                type="password"
                value={password}
                setValue={setPassword}
              >
                <Lock className={'dark:text-primary text-darkGrey'} />
              </InputField>
            </div>
            <div className="">
              <InputField
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
              >
                <Lock className={'dark:text-primary text-darkGrey'} />
              </InputField>
              {password.length > 0 && <div className="mt-4 ">
                <PasswordChecklist
                  className={'dark:text-primary'}
                  rules={[
                    "minLength",
                    "specialChar",
                    "number",
                    "capital",
                    "match",
                    'lowercase'
                  ]}
                  messages={{
                    minLength: "At Least 8 characters",
                    specialChar: "1 Special character",
                    number: "1 Numeric Character",
                    capital: "1 Uppercase Character",
                    match: "Password Confirmed",
                    lowercase: '1 Lowercase Character'
                  }}
                  minLength={8}
                  value={password}
                  valueAgain={confirmPassword}
                />
              </div>}
            </div>

            <div className="my-4">
              {
                <Button
                  onClickHandler={() => handleSignup(event, email, password, confirmPassword)}
                  isDisabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <Spinner className={'dark:text-primary text-darkGrey'} size={"sm"} />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              }
            </div>

            <div className="mt-4 text-center">
              <NavigateLink toURL={"/login"}>
                Already have an account? Login
              </NavigateLink>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="w-16 h-[1px] border border-gray-300"></div>
              <h1 className="text-center my-4 dark:text-primary">Or Sign-Up With</h1>
              <div className="w-16 h-[1px] border border-gray-300"></div>
            </div>

            <SocialMediaButton onClickHandler={handleGoogleLogin}>
              {isGoogleLoading ? (
                <LoadingSpinner size={'sm'} />
              ) : (
                <img src={GoogleLogo} alt="" width={30} height={30} />
              )}
            </SocialMediaButton>
          </form>
        </div>
      </div>
    </>
  );
}
