/* eslint-disable react/prop-types */
import { useContext } from "react";
import Button from "../Button/Button.component.jsx";

import { UserContext } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import useJoinCommunity from "../../hooks/useJoinCommunity.js";
import { AppRoutes } from "../../constants/AppRoutes.js";
import { Img } from "react-image";
// import { truncateText } from "../../utils/index.js";
import AnimatedNumbers from "react-animated-numbers";

// eslint-disable-next-line react/prop-types
export const CommunityCard = ({ community }) => {
  const { user } = useContext(UserContext);
  const { joinCommunity, isJoined, setIsJoined, isJoining } = useJoinCommunity(
    community.id
  );

  const handleJoinLeave = () => {
    if (!isJoined) {
      joinCommunity(community.id);
      setIsJoined(true);
    }
  };

  return (
    <div
      className={
        " h-content  dark:bg-darkCardBg shadow-lg  bg-primary cursor-pointer  p-2 md:p-4 rounded-xl hover:scale-105 transition-all hover:-translate-y-2"
      }
    >
      <div className="flex flex-wrap  items-center gap-4">
        <div className="w-12 h-12 rounded-full">
          <Img
            loader={<div className="w-full h-full rounded-full skeleton"></div>}
            className="w-full h-full rounded-full object-cover"
            src={community.communityLogoUrl}
          />
        </div>

        <Link
          to={`${AppRoutes.communityDetailPage.baseRoute}/${community.id}`}
        >
          <p className=" font-[teko]  md:text-2xl text-md  font-semibold dark:text-accent text-blAccent hover:underline">
            {community.communityName}
          </p>
        </Link>

      </div>
      <div className="flex justify-between my-2 flex-wrap gap-2">
        <p className="text-md dark:text-textPrimary text-textSecondary  overflow-hidden">
          {community.smallDescription}
        </p>
        <p className={"text-tertiary text-sm font-bold"}>
          Create At:{" "}
          <span className={"dark:text-accent text-blAccent"}>{community.createdAt}</span>
        </p>
      </div>

      <hr className="my-4  w-[95%] mx-auto" />

      <div className={"flex justify-between  items-center w-full text-sm"}>
        <div className="flex gap-2">
          <p className="dark:text-textPrimary text-textSecondary">Members: </p>
          <p className={"dark:text-textPrimary text-textSecondary"}>
            <AnimatedNumbers
              includeComma
              transitions={(index) => ({
                type: "spring",
                duration: index + 0.1,
              })}
              animateToNumber={community.members.length}
            />
          </p>
          <p className="dark:text-textPrimary text-textSecondary">
            Posts:{" "}
            {community.experiencePosts.length + community.questionPosts.length}
          </p>
        </div>
        <div className={"text-sm"}>
          {community.createdBy !== user.uid && (
            <Button
              outline={isJoined}
              isDisabled={isJoining}
              py={1}
              onClickHandler={handleJoinLeave}
            >
              {isJoined ? (
                <h1
                  className={isJoined ? "cursor-not-allowed" : "cursor-pointer"}
                >
                  Joined
                </h1>
              ) : (
                "Join"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
