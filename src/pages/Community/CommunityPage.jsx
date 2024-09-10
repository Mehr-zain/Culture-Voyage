import { useContext } from "react";
// import { CreateCommunity } from "../../components/CreateCommunity.jsx";
import { UserContext } from "../../context/AuthContext.jsx";
import { useFetchUserCreatedCommunities } from "../../hooks/useFetchUserCreatedCommunities.js";
import { useFetchAllCommunities } from "../../hooks/useFetchAllCommunities.js";
import { CommunityListing } from "../../components/CommunityListing/CommunityListing.jsx";
import { CreateCommunity } from "../../components/CreateCommunity.jsx";


export const CommunityPage = () => {

  const { user } = useContext(UserContext);
  const { communities, isFetchingCommunities } = useFetchAllCommunities(user.uid);
  const { userCreatedCommunities, isFetchingUserCreatedCommunities } = useFetchUserCreatedCommunities(user.uid);
  return (
    <div className={'m-4 px-2  h-full'}>
      <div className="mb-2">
        <CreateCommunity />
      </div>
      {/* <CreateCommunity /> */}
      <p className="text-secondary font-[teko]   md:text-2xl text-md  font-semibold text-lg dark:text-primary w-full ">
        {/* <Lottie animationData={com} loop={true} className="" style={{ width: 80, height: 80 }} /> */}

        My communities
      </p>

      <CommunityListing communities={userCreatedCommunities} isFetching={isFetchingUserCreatedCommunities} />
      <p className="text-secondary font-[teko]   md:text-2xl text-md  font-semibold dark:text-primary ">Explore Communities</p>
      <CommunityListing communities={communities} isFetching={isFetchingCommunities} />
    </div>
  );
};
