import { useContext, useRef, useState } from "react";
import { UserContext } from "../../context/AuthContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import UserLight from "../../assets/userWhite.png";
import UserDark from "../../assets/userBlack.png";
import Button from "../../components/Button/Button.component.jsx";
import { useFetchJoinedCommunities } from "../../hooks/useFetchJoinedCommunities.js";
import { useGetUserProfileData } from "../../hooks/useGetUserProfileData.js";
import { CommunityListing } from "../../components/CommunityListing/CommunityListing.jsx";
import { auth } from "../../firebase/Firebase.js";
import { useUpdateImage } from "../../hooks/useUpdateImage.js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import { AppRoutes } from "../../constants/AppRoutes.js";
import NavigateLink from "../../components/NavigateLink/NavigateLink.component.jsx";
import { signOut } from "firebase/auth";
import { Edit } from "iconsax-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Corrected here
  const { joinedCommunities, isFetchingJoinedCommunities } = useFetchJoinedCommunities(id);
  const { userData, isFetching } = useGetUserProfileData(id);
  const {
    isImageChanged,
    setIsImageChanged,
    uploadImageAssetAndUpdateDoc,
    imageAsset,
    handleImageChange,
    isImageUpdating,
    setImageAsset
  } = useUpdateImage();
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("myprofile");
  const active_nav = useRef(null);

  const handleAnimClick = (e) => {
    const state = Flip.getState(active_nav.current);
    e.target.appendChild(active_nav.current);
    Flip.from(state, { duration: 0.2, absolute: true, ease: "none" });
  };

  if (isFetching)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-20 h-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  if (!isFetching && !userData) return <h1>Error occurred</h1>;

  return (
    <div className="p-4 ">
      <div className="flex gap-8 md:gap-16 items-center justify-center flex-col md:flex-row">
        {/* profile card */}
        <div className="bg-primary dark:border-borderSecondary dark:border dark:bg-transparent md:w-96 w-full p-8 shadow flex-col flex items-center justify-center rounded-xl">
          <div className="w-24 h-24 rounded-full relative">
            <div className="dark:hidden block w-[100px] h-[100px]">
              <img
                src={(imageAsset && URL.createObjectURL(imageAsset)) || userData?.Avatar || UserLight}
                className="w-full h-full object-cover group rounded-full"
              />
            </div>
            <div className="hidden dark:block w-[100px] h-[100px]">
              <img
                src={(imageAsset && URL.createObjectURL(imageAsset)) || userData?.Avatar || UserDark}
                className="w-full h-full object-cover group rounded-full"
              />
            </div>
            {id === user.uid && (
              <input
                type="file"
                accept="image/*"
                onChange={() => handleImageChange(event, "sm")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>
          {isImageChanged && (
            <div className="my-4">
              <div className="flex my-4">
                <div className="">
                  <Button
                    isDisabled={isImageUpdating}
                    onClickHandler={() => uploadImageAssetAndUpdateDoc("Users", user.uid)}
                  >
                    {isImageUpdating ? "Updating..." : "save image"}
                  </Button>
                </div>
                <div className="ml-2">
                  <Button
                    isDisabled={false}
                    onClickHandler={() => {
                      setImageAsset(null);
                      setIsImageChanged(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-md mt-4 text-textSecondary dark:text-textPrimary">
            {userData?.Email}
          </h1>
          {/* <h1 className="font-bold text-xl  text-textSecondary dark:text-textPrimary"> {`${userData?.["First Name"]} ${userData?.["Last Name"]}`}</h1> */}
          <h1 className="font-bold text-xl text-textSecondary dark:text-textPrimary">
            {`${userData?.["Username"]}`}
          </h1>
          {user.uid === id && (
            <div className="mt-4">
              <NavigateLink
                toURL={`${AppRoutes.editProfile.baseRoute}/${id}`}
                data={{
                  id: user.uid,
                  user_name: userData["Username"],
                  first_name: userData["First Name"],
                  last_name: userData["Last Name"],
                  aboutt: userData["About"],
                  exp: userData["Experiences"]
                }}
              >
                Edit Profile Information
              </NavigateLink>
              <div className="mt-4">
                <Button onClickHandler={() => navigate(`/userchat/${id}`)}>
                  {user.uid === id && (
                    <div className="flex justify-center items-center gap-2">
                      <Edit size="25" className="text-primary " />
                      <h1>Inbox</h1>
                    </div>
                  )}
                </Button>
              </div>
              <div className="mt-4">
                <Button onClickHandler={() => signOut(auth)} isDisabled={false} outline={false}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="max-w-[500px]">
          {/* right side content */}
          {/* top button group */}
          <div className="lg:w-[450px] w-full bg-primary w-content dark:bg-transparent md:gap-4 gap-2 flex justify-between items-center rounded py-2 h-12 shadow px-8 dark:border border-borderSecondary">
            <div
              onClick={() => {
                setActiveTab("myprofile");
                handleAnimClick(event);
              }}
              className={`links font-semibold cursor-pointer relative ${
                activeTab == "myprofile" ? "text-blAccent dark:text-accent" : "dark:text-textPrimary"
              }`}
            >
              My profile
              <div
                ref={active_nav}
                className="active-nav aboslute w-full h-[2px] rounded top-3 dark:bg-accent bg-blAccent"
              ></div>
            </div>
            <div
              onClick={() => {
                setActiveTab("posts");
                handleAnimClick(event);
              }}
              className={`links font-semibold cursor-pointer relative ${
                activeTab == "posts" ? "text-blAccent dark:text-accent" : "dark:text-textPrimary"
              }`}
            >
              Posts
            </div>
            <div
              onClick={() => {
                setActiveTab("notifications");
                handleAnimClick(event);
              }}
              className={`links font-semibold cursor-pointer relative ${
                activeTab == "notification" ? "text-blAccent dark:text-accent " : "dark:text-textPrimary"
              }`}
            >
              Notifications
            </div>
          </div>
          {/* top button group end */}

          {/* content section */}
          <div className="p-2 my-2">
            {activeTab == "myprofile" && (
              <div>
                <div className="flex justify-start items-center gap-16">
                  <div>
                    <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">First Name</h1>
                    <h1 className="text-textSecondary dark:text-textPrimary">{userData?.["First Name"]}</h1>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">Last Name</h1>
                    <h1 className="text-textSecondary dark:text-textPrimary">{userData?.["Last Name"]}</h1>
                  </div>
                </div>
                <div className="my-4">
                  <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">About Me</h1>
                  <h1 className="text-textSecondary dark:text-textPrimary">
                    {userData?.About || "Not about defiend yet text-textSecondary dark:text-textPrimary"}
                  </h1>
                </div>

                <hr />
                <div className="flex gap-4">
                  <div className="dark:text-textPrimary text-textSecondary my-4">
                    Total Posts: {userData?.["Community Posts"]?.length ?? 0 + userData?.["General Posts"]?.length ?? 0}
                  </div>
                  <div className="dark:text-textPrimary text-textSecondary my-4">
                    Following: {userData?.["Followings"]?.length}
                  </div>
                  <div className="dark:text-textPrimary text-textSecondary my-4">
                    Followers: {userData?.["Followers"]?.length ?? "0"}
                  </div>
                </div>
              </div>
            )}
            {activeTab == "posts" && (
              <div>
                <div className="flex justify-start items-center gap-16">
                  <div>
                    <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">First Name</h1>
                    <h1 className="text-textSecondary dark:text-textPrimary">{userData?.["First Name"]}</h1>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">Last Name</h1>
                    <h1 className="text-textSecondary dark:text-textPrimary">{userData?.["Last Name"]}</h1>
                  </div>
                </div>
                <div className="my-4">
                  <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">About Me</h1>
                  <h1 className="text-textSecondary dark:text-textPrimary">
                    {userData?.About || "Not about defiend yet text-textSecondary dark:text-textPrimary"}
                  </h1>
                </div>

                <hr />
                <div className="flex gap-4">
                  <div className="dark:text-textPrimary text-textSecondary my-4">
                    General Posts: {userData?.["General Posts"]?.length ?? 0}
                  </div>

                  <div className="dark:text-textPrimary text-textSecondary my-4">
                    Community Posts: {userData?.["Community Posts"]?.length ?? 0}
                  </div>
                </div>
              </div>
            )}
            {activeTab == "notifications" && (
              <div>
                <div className="flex justify-start items-center gap-16">
                  <div>
                    <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">First Name</h1>
                    <h1 className="text-textSecondary dark:text-textPrimary">{userData?.["First Name"]}</h1>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">Last Name</h1>
                    <h1 className="text-textSecondary dark:text-textPrimary">{userData?.["Last Name"]}</h1>
                  </div>
                </div>
                <div className="my-4">
                  <h1 className="font-bold text-lg my-2 text-textSecondary dark:text-textPrimary">About Me</h1>
                  <h1 className="text-textSecondary dark:text-textPrimary">
                    {userData?.About || "Not about defiend yet text-textSecondary dark:text-textPrimary"}
                  </h1>
                </div>

                <hr />
                <div className="dark:text-textPrimary text-textSecondary my-4">
                  Total Posts: {userData?.["Community Posts"]?.length}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* right side content end */}
      </div>

      {user.uid === id && (
        <div>
          <p className="font-bold text-lg dark:text-primary">Joined Communities</p>
          <CommunityListing communities={joinedCommunities} isFetching={isFetchingJoinedCommunities} />
        </div>
      )}
    </div>
  );
};
