import { collection, onSnapshot } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { db } from "../../firebase/Firebase"
import PostListing from "../../components/PostListing/PostListing"
import { UserContext } from "../../context/AuthContext"
import Button from "../../components/Button/Button.component"
import { getUserData } from "../../utils/Firebase Utils Functions"
import { useFetchAllCommunities } from "../../hooks/useFetchAllCommunities"
import { Link } from "react-router-dom"
import { AppRoutes } from "../../constants/AppRoutes"
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner"


export const PostPage = () => {

    //fetch all the posts here  
    const { user } = useContext(UserContext)
    const [posts, setPosts] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [activeTab, setActiveTab] = useState('posts')
    useEffect(() => {
        setIsFetching(true)
        const unsub = onSnapshot(collection(db, 'General Posts'), async (snapshots) => {
            const FollowingList = await getUserData(user.uid, 'Followings')
            let data = []
            snapshots.forEach(snapshot => {
                const postData = snapshot.data();
                // if (user.uid != postData['Created By'])
                data.push({ id: snapshot.id, ...postData });
            })
            if (activeTab == 'posts')
                setPosts(data);
            else {
                const filteredPosts = data.filter(post => {
                    return FollowingList.includes(post['Created By'])
                })
                setPosts(filteredPosts)
                console.log(filteredPosts);
            }
            setIsFetching(false)
        })
        return () => unsub()
    }, [activeTab, user.uid])

    //fetch trending communities
    const { communities, isFetchingCommunities } = useFetchAllCommunities()
    return <div className="flex ">
        <div className="lg:w-[75%] w-full ">
            <div className="flex gap-4 my-2">
                <Button onClickHandler={() => setActiveTab('posts')} outline={!(activeTab == 'posts')}>
                    All posts
                </Button>
                <Button onClickHandler={() => setActiveTab('following')} outline={!(activeTab == 'following')}>
                    Following
                </Button>
            </div>
            <div>
                <PostListing posts={posts} isFetching={isFetching} postType={'general'} />
            </div>
        </div>
        <div className="w-[25%] rounded m-2 text-secondary dark:text-primary  lg:block hidden dark:bg-transparent bg-gray-100">
            <div className="fixed overflow-auto  p-2 h-screen text-blAccent dark:text-primary border-r-4 dark:bg-darkCardBg bg-primary   md:block hidden border-blAccent dark:border-accent">
                Trending Communities
                <div className="h-[1px] dark:bg-borderSecondary bg-borderPrimary mb-4  mt-2"></div>
                {
                    isFetchingCommunities ?
                        <LoadingSpinner />
                        : communities.map((community, index) => {
                            return community.members.length >= 2 && <Link key={index} to={`${AppRoutes.communityDetailPage.baseRoute}/${community.id}`}>
                                <div className="border dark:border-borderSecondary mb-3 flex items-center justify-start p-3 rounded-lg shadow gap-2  text-secondary">
                                    <img src={community.communityLogoUrl} className="w-12 h-12 object-cover rounded-full border" />
                                    <h1 className="text-secondary   dark:text-primary"> {community.communityName}</h1>
                                </div>
                            </Link>
                        })
                }
            </div>
        </div>

    </div>

}