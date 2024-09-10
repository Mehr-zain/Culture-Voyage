/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { db } from "../../firebase/Firebase";
import { AppRoutes } from '../../constants/AppRoutes'
import Comment from "../../components/CommentSection/Comment";
import { useFetchComments } from "../../hooks/useFetchComments";
import { UserContext } from "../../context/AuthContext";
import { Calendar, Heart, Location, MessageEdit, Messages2, Setting4, User } from "iconsax-react";
import { Img } from "react-image";
import { getUserData } from "../../utils/Firebase Utils Functions";
import { useTranslatePost } from "../../hooks/useTranslatePost";
import { getTimeElapsedSince } from "../../utils";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { CommentCard } from "../../components/CommentCard/CommentCard";
import Button from "../../components/Button/Button.component";
import useFollowUser from "../../hooks/useFollowUser";
import useUnfollowUser from "../../hooks/useUnfollowUser";


export const PostDetailPage = ({ communityId = null }) => {

  const { id } = useParams();

  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  //-----------------------------------------
  const navigation = useNavigate()
  //-----------------------------------------
  const { user } = useContext(UserContext)
  const [postDetail, setPostDetail] = useState(null);

  const { comments } = useFetchComments(id);
  // console.log(comments[0]['Created At'].seconds ?? '');
  const [postUser, setPostUser] = useState(null)

  const [commentUsers, setCommentUsers] = useState([]);
  // Following status
  const [Following, setFollowing] = useState(false)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: for smooth scrolling behavior
    });
  }, []);

  //fetch the following status


  useEffect(() => {
    const getData = async () => {

      const snapshot = await getDoc(doc(db, `${type == 'general' ? 'General Posts' : 'Community Posts'}`, id));
      const data = snapshot.data();
      setPostDetail(data);

    };
    getData();
  }, [id, type]);



  // fetch users details for comments
  useEffect(() => {
    const fetchUserDetails = async () => {
      const users = [];
      for (const comment of comments) {
        const userId = comment["Created By"];
        if (!users[userId]) {
          const userSnapshot = await getDoc(doc(db, "Users", userId));
          const userData = userSnapshot.data();
          users[userId] = userData;
        }
      }
      setCommentUsers(users);
    };

    fetchUserDetails();
  }, [comments]);



  useEffect(() => {
    (async () => {
      const data = await getUserData(postDetail?.['Created By'])
      setPostUser(data)
    })()
  }, [postDetail])

  const { follow, alreadyFollowing, setAlreadyFollowing } = useFollowUser(user.uid, postDetail ? postDetail["Created By"] : '');
  const { unfollow } = useUnfollowUser(user.uid, postDetail ? postDetail["Created By"] : '');

  const handleFollow = () => {
    if (alreadyFollowing) {
      unfollow(postDetail["Created By"]);
    } else {
      follow(postDetail["Created By"]);
    }
  };




  if (!postUser || !comments || !postDetail || !commentUsers)
    return <div className="h-full flex items-center justify-center">
      <div>
        <LoadingSpinner />
      </div>
    </div>
  return (
    <div className="flex just gap-2">
      <div className="md:w-[75%] w-[100%]   bg-primary dark:bg-darkCardBg rounded-lg p-4 shadow-lg">
        <div className="flex justify-start items-center gap-4">
          <div className="w-16 h-16">
            <Img
              className={"object-cover rounded-full w-full h-full"}
              src={postUser["Avatar"]}
              loader={<div className="w-full h-full skeleton"></div>}
            />
          </div>
          <div>
            <div className="flex items-center justify-between w-full">
              <Link to={`/${AppRoutes.profile.baseRoute}/${postDetail?.['Created By']}`} >
                <div className="flex items-center justify-start gap-2 my-2">
                  <User variant="Bold" size="22" className="text-gray-500" />
                  <span className="font-extrabold text-lg text-gray-500"> @{postUser['Username']}</span>
                </div>
              </Link>

            </div>
            <div className="flex gap-4 items-start justify-start max-w-[500px] lg:w-[500px]">


              <div className="md:flex hidden items-center justify-start gap-1">
                <Location variant="Bold" size="15" className="text-gray-500" />
                <span className="text-sm font-thin text-gray-500">{postUser['Country']}</span>
              </div>
              <div className="md:flex hidden items-center justify-start gap-1">
                <Calendar variant="Bold" size="15" className="text-gray-500" />
                <span className="text-sm font-thin text-gray-500">{getTimeElapsedSince(postDetail['Created At'].seconds)} ago</span>
              </div>
              {
                postDetail['Created By'] == user.uid &&
                <div className="flex items-center justify-start gap-1">
                  <MessageEdit variant="Bold" size="15" className="text-gray-500 " />
                  <a className="cursor-pointer text-gray-500 font-bold underline hover:text-[#E1306C]" onClick={() => { navigation(`/edit/post/${id}?type=${type}`) }}>
                    Edit Post
                  </a>
                </div>
              }
            </div>
          </div>
          {user.uid !== postDetail["Created By"] && (
            <div>
              <Button
                onClickHandler={handleFollow}
                outline={alreadyFollowing}

              >
                {alreadyFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          )}
        </div>
        <h1 className="dark:text-textPrimary my-2 p-2  text-secondary font-bold md:text-2xl h-content ">
          {postDetail.Title}
        </h1>
        {/* Description */}
        <h1 className="dark:text-textPrimary text-secondary md:text-md text-sm my-2 p-2">{postDetail.Description}</h1>




        <div className="carousel w-full">
          {postDetail["Media URL"] && postDetail['Media URL'].length == 1 ?
            <div
              className="carousel-item w-full h-60 m-2 rounded-xl shadow  p-2 bg-gray-200 dark:bg-gray-700 "
            >
              {!["mp4", "mkv", "avi", "mov"].some(ext => postDetail['Media URL'][0].split(".").pop().toLowerCase() === ext) ? (
                <img
                  src={postDetail['Media URL'][0]}
                  className="object-cover rounded-lg w-full h-full"
                />
              ) : (
                <video
                  src={postDetail['Media URL'][0]}
                  className="w-full h-full rounded-xl"
                  controls
                ></video>
              )}
            </div> :
            postDetail["Media URL"].map((url, index) => {
              return (
                <div
                  id={`item${index + 1}`}
                  key={index}
                  className="carousel-item w-1/2 h-60 m-2 rounded-xl shadow  p-2 bg-gray-200 dark:bg-gray-700 "
                >
                  {!["mp4", "mkv", "avi", "mov"].some(ext => url.split(".").pop().toLowerCase() === ext) ? (
                    <img
                      src={url}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  ) : (
                    <video
                      src={url}
                      className="w-full h-full rounded-xl"
                      controls
                    ></video>
                  )}
                </div>
              );
            })}
        </div>

        {/* dropdown menu */}
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="m-1">
            <Setting4 size="25" className="dark:text-primary text-secondary" />
          </div>
          <ul tabIndex={0} className=" dropdown-content z-[1] menu p-2 shadow dark:bg-secondary bg-primary rounded-box w-52">
            {
              postDetail['Created By'] == user.uid &&
              <li className="dark:hover:bg-darkerGrey rounded-lg flex hover:bg-softGrey dark:text-primary text-secondary">
                
              </li>
            }

          </ul>
        </div > */}

        {/* comment sectino */}
        <div className="  ">
          <Comment postID={id} />
          <hr className="my-2" />
          <div className="flex items-center justify-start gap-2 md:my-4 my-2">
            <Messages2 variant="Bold" size="27" color="#E1306C" />
            <h1 className="text-[#E1306C] font-bold tracking-widest text-lg">User Comments</h1>
            <h1 className="bg-[#E1306C] text-xs px-[4px] py-[1px] text-textLight rounded-lg">{comments.length}</h1>
          </div>
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentCard comment={comment} commentUsers={commentUsers} />
            </div>
          ))}

        </div >
      </div>
      <div className="md:w-[25%]  justify-start  rounded-xl shadow-xl p-4 md:flex hidden dark:bg-secondary bg-primary">
        <div className="fixed">

          <h1 className="text-[#E1306C] font-bold tracking-widest">About</h1>
          <h1 className="text-[#E1306C] font-bold tracking-widesto">Culture Voyage</h1>
        </div>
      </div>
    </div >
  );
};
