
import { Divider } from "@chakra-ui/react"
export default function CommunityCardSkelton() {
    return (
        <div
            className={
                "cursor-pointer   py-2 rounded-lg"
            }
        >
            <div className="flex flex-wrap  items-center gap-4">
                <div className="w-20 h-20 rounded-full skeleton  dark:bg-darkerGrey dark:border-borderSecondary"></div>
                <p className="skeleton dark:bg-darkerGrey dark:border-borderSecondary w-[70%] h-4">
                </p>
            </div>
            <div className="flex justify-between my-4 flex-wrap gap-6">
                <p className="skeleton dark:bg-darkerGrey dark:border-borderSecondary w-[45%] h-4 ">
                </p>
                <p className={"skeleton dark:bg-darkerGrey dark:border-borderSecondary w-[45%]  h-4"}>

                </p>
            </div>
            <Divider className="my-8" />
            <div className={"flex  justify-between items-center gap-4"}>
                <p className={"w-[40%] h-4 skeleton dark:bg-darkerGrey dark:border-borderSecondary"}>
                </p>
                <p className={"w-[40%] h-4 skeleton dark:bg-darkerGrey dark:border-borderSecondary"}>
                </p>
            </div>
        </div>
    )
}
