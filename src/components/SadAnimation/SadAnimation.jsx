
// import { Spinner } from "@chakra-ui/react";
import Lottie from "lottie-react";
import animation from '../../assets/sad.json'
// eslint-disable-next-line react/prop-types
export const SadAnimation = ({ size }) => {
    return (
        // <Spinner className={'dark:text-textPrimary text-textSecondary'} size={size} />
        <div className="w-12 h-12 ">
            <Lottie animationData={animation} loop={true} size={size} />
        </div>
    )
}