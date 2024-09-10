import strings from "../../constants/Strings";
import { useState, useEffect } from "react";
import { Lock, SmsTracking } from "iconsax-react";
import WelcomeLight from '../../assets/Welocome2Light.json.json'
import WelcomeDark from '../../assets/Welcome2Dark.json.json'
import GoogleLogo from "../../assets/GoogleLogo.png";
import InputField from "../../components/Inputfield/InputField.component";
import Button from "../../components/Button/Button.component";
import NavigateLink from "../../components/NavigateLink/NavigateLink.component.jsx";
import SocialMediaButton from "../../components/SocialMediaButton/SocialMediaButton.component";
import { useContext } from "react";
import { UserContext } from "../../context/AuthContext";
import { Spinner } from "@chakra-ui/react";
import { Colors } from "../../constants/Colors.js";
import { useLogin } from "../../hooks/useLogin.js";
import { useGoogleLogin } from "../../hooks/useGoogleLogin.js";
import { useCheckUserInformation } from "../../hooks/useCheckUserInformation.js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../constants/AppRoutes.js";
import Lottie from "lottie-react";
export default function LoginPage() {
  // const toast = useToast()
  const navigate = useNavigate()
  const { user, isLoading } = useContext(UserContext);
  const { HandleLogin, isLogging } = useLogin();
  const { handleGoogleLogin, isGoogleLoading } = useGoogleLogin()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigation = useNavigate();
  const { isAdditionalInformationComplete, checkIsEmailVerified } = useCheckUserInformation()
  useEffect(() => {
    if (!isLoading && user) {
      checkIsEmailVerified(user)
      if (user.emailVerified && !isGoogleLoading)
        isAdditionalInformationComplete(user)
    }
  }, [user, isLoading, isGoogleLoading, checkIsEmailVerified, isAdditionalInformationComplete]);
  return (
    <>
      {(
        <>
          <div className="min-h-screen flex justify-center md:flex-row flex-col">
            <div className="md:w-[50%]  dark:bg-secondary  md:min-h-screen  p-2 md:p-0 md:flex hidden flex-col items-center justify-center ">

              <div className="md:w-[300px]  md:h-[300px] w-[200px] h-[200px]">
                <Lottie animationData={WelcomeLight} loop={true} className="dark:hidden block" />
                <Lottie animationData={WelcomeDark} loop={true} className="dark:block hidden" />
              </div>

              {/* <img src={Logo} className="md:w-[300px] md:h-[300px] w-[150px] h-[150px]" /> */}
              {/* <div className="w-[300px] h-[300px]  rounded-full">
                <Lottie animationData={hello} loop={true} />
              </div> */}
              <h3 className="dark:text-primary text-textSecondary font-bold md:text-4xl font-[teko]">{strings.loginHeading1} ,</h3>
              <h3 className="dark:text-primary text-textSecondary text-lg text-center mt-2">
                {strings.loginHeading2}
              </h3>
              <h3 className="dark:text-primary text-textSecondary text-lg text-center ">
                {strings.loginHeading3}
              </h3>
            </div>

            <div className=" md:h-auto h-screen gap-2 p-8  dark:bg-secondary  md:w-[50%] flex flex-col justify-center items-start ">
              <h3 className="dark:text-primary md:hidden block text-2xl text-center ">
                Login
              </h3>

              <form className="dark:border-none border px-4 py-10 rounded-xl shadow-lg dark:shadow-none md:w-96 lg:w-[400px] w-full">
                <div className="mb-4">
                  <InputField type="email" value={email} placeholder="Email" setValue={setEmail}>
                    <SmsTracking className={'dark:text-primary text-darkGrey'} />
                  </InputField>
                </div>
                <div className="mb-4">
                  <InputField
                    type="password"
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                  >
                    <Lock className={'dark:text-primary text-darkGrey'} />
                  </InputField>
                </div>

                <div className="text-right my-4">
                  <NavigateLink toURL={"/forgetpassword"}>
                    Forgot Password?
                  </NavigateLink>
                </div>
                <div className="my-4">
                  {
                    <Button
                      onClickHandler={() => HandleLogin(event, email, password)}
                      isDisabled={isLogging}
                    >
                      {isLogging ? (
                        <LoadingSpinner />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  }
                </div>

                <div className="mt-4 text-center">
                  {/* <NavigateLink toURL={"/register"}>
                    Dont have an account? Register
                  </NavigateLink> */}
                  <Button outline={true} onClickHandler={() => { navigate(AppRoutes.register.route) }} isDisabled={false}>
                    {AppRoutes.register.name}
                  </Button>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-16 h-[1px] border border-gray-300"></div>
                  <h1 className="text-center my-4 dark:text-primary">Or Sign-In With</h1>
                  <div className="w-16 h-[1px] border border-gray-300"></div>
                </div>

                <SocialMediaButton onClickHandler={handleGoogleLogin}>
                  {isGoogleLoading ? (
                    <div style={{ width: 30, height: 30 }}>
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <img src={GoogleLogo} alt="" width={30} height={30} />
                  )}
                </SocialMediaButton>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
