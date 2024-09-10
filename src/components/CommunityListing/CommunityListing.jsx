/* eslint-disable react/prop-types */
import { CommunityCard } from "../CommunityCard/CommunityCard.jsx"
import { SadAnimation } from "../SadAnimation/SadAnimation.jsx";
import CommunityCardSkelton from "../CommunityCard/CommunityCardSkelton.jsx";
import Masonry from "react-masonry-css";
import './style.css'
// eslint-disable-next-line react/prop-types
export const CommunityListing = ({ communities, isFetching = false }) => {

    if (isFetching)
        return <Masonry
            breakpointCols={{
                default: 2,
                1100: 1,
                700: 1,
                500: 1
            }}
            className="my-masonry-grid "
            columnClassName="my-masonry-grid_column">
            <div className="my-2" >
                <CommunityCardSkelton />
            </div>
            <div className="my-2">
                <CommunityCardSkelton />
            </div>
            <div className="my-2">
                <CommunityCardSkelton />
            </div>
            <div className="my-2">
                <CommunityCardSkelton />
            </div>
            <div className="my-2">
                <CommunityCardSkelton />
            </div>
        </Masonry >
    if (!isFetching && communities.length === 0)
        return <div className={'flex items-center justify-center w-full'}><SadAnimation size={'16'} /></div>

    else
        return <Masonry breakpointCols={{
            default: 2,
            1100: 2,
            700: 1,
            500: 1
        }}
            className="my-masonry-grid "
            columnClassName="my-masonry-grid_column ">
            {communities.map((communityData, index) => <div key={index} className="my-4 "><CommunityCard key={index} community={communityData} /></div>)}
        </Masonry >
}