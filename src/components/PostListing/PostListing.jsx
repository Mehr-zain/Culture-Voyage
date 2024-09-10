/* eslint-disable react/prop-types */

import Masonry from 'react-masonry-css'
import PostCardComponent from '../PostCard/PostCard.Component'
import './style.css'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
export default function PostListing({ posts, isFetching, communityId = null, postType }) {

    if (isFetching)
        return <div className='flex items-center justify-center h-full m-2 p-2' >
            <div className='w-20 h-20'>
                <LoadingSpinner />
            </div>
        </div>
    if (!isFetching && posts.length == 0)
        return <h1>no data found</h1>
    //delete experience post 

    return (
        <Masonry breakpointCols={{
            default: communityId ? 2 : 1,
            1100: communityId ? 2 : 1,
            700: 1,
            500: 1
        }}
            className="my-masonry-grid "
            columnClassName="my-masonry-grid_column">
            {posts && posts.map((postDetail, index) => <div key={index} className=""><PostCardComponent communityId={communityId} postType={postType} key={index} postDetail={postDetail} /></div>)}
        </Masonry >
    )
}
