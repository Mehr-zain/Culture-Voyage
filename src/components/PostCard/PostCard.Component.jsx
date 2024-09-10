/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../../utils/Firebase Utils Functions";
import { getTimeElapsedSince, truncateText } from "../../utils";
import { Img } from "react-image";
import { useDeletePost } from "../../hooks/useDeletePost";
import { UserContext } from "../../context/AuthContext";
import { Heart, MessageProgramming } from "iconsax-react";
import { db } from "../../firebase/Firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import Button from "../Button/Button.component";
import InputField from "../Inputfield/InputField.component";
import { useTranslatePost } from "../../hooks/useTranslatePost";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { Setting4, Flag, Edit, Trash } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { useSubmitReport } from "../../hooks/useSubmitReport";
import { useToast } from "@chakra-ui/react";
import { ToastStrings } from "../../constants/ToastStrings";
import { CHARACTERS_LIMITS } from "../../constants/CharacterLimits";

const PostCardComponent = ({ postDetail, communityId = null, postType }) => {
  const toast = useToast();
  const [author, setAuthor] = useState();
  const { deletePost } = useDeletePost();
  const { user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState();
  const [isLiking, setIsLiking] = useState(false);
  const [openReport, setOpenReport] = useState();
  const [report, setReport] = useState();
  const [detail, setDetail] = useState();

  const { submitReport, isSubmitting } = useSubmitReport();
  //Report
  const handleSubmitReport = async () => {
    const trimmedDetail = detail ? detail.trim() : "";
    if (report) {
      await submitReport(trimmedDetail, postDetail.id, report);
    }
    else {
      toast({
        title: "Please Select Report Type!",
        status: "info",
        duration: ToastStrings.duration,
        isClosable: true,
      });
    }
    setDetail("");
    setReport("");
  };
  const handleReportChange = (e) => {
    setReport(e.target.value);
    console.log(e.target.value);
  };
  const handleReport = () => {
    setOpenReport(true);
  };
  const closeModal = () => {
    setOpenReport(false);
  };

  const navigation = useNavigate();

  const { translatePost, translatedtext, detectedLanguageCode } =
    useTranslatePost(postDetail.Description);

  //listening to the realtime changes to likes of the post
  useEffect(() => {
    if (postType == "general") {
      onSnapshot(doc(db, "General Posts", postDetail.id), (doc) => {
        const likesArray = doc.data()?.Likes ?? [];
        setIsLiked(likesArray.includes(user.uid));
      });
    } else {
      onSnapshot(doc(db, "Community Posts", postDetail.id), (doc) => {
        const likesArray = doc.data()?.Likes ?? [];
        setIsLiked(likesArray.includes(user.uid));
      });
    }
  }, [postDetail, postType, user.uid]);
  const likeOrDislikePost = async (id) => {
    if (isLiking) return;
    setIsLiking(true);
    let postRef = null;

    if (postType == "general") {
      console.log("in general");
      postRef = doc(db, "General Posts", id);
    } else {
      console.log("in community post");
      postRef = doc(db, "Community Posts", id);
    }

    const snapshot = await getDoc(postRef);
    const likesArray = snapshot.data()?.Likes ?? [];

    if (isLiked) {
      //dislike the post
      const updatedLikesArray = likesArray.filter((item) => item != user.uid);
      await updateDoc(postRef, { Likes: updatedLikesArray });
      setIsLiked(false);
    } else {
      //likes the post
      likesArray.push(user.uid);
      await updateDoc(postRef, { Likes: likesArray });
      setIsLiked(true);
    }
    setIsLiking(false);
  };
  useEffect(() => {
    const getPostAuthor = async () => {
      const res = await getUserData(postDetail["Created By"]);
      setAuthor(res);
    };
    getPostAuthor();
  }, [postDetail]);

  return (
    <>
      {postDetail && (
        <div className="p-4 my-4 bg-primary dark:bg-darkCardBg  rounded-lg shadow-lg">
          <div className="flex items-start justify-between  gap-4">
            <div className="flex  items-start justify-center gap-4">
              <div className=''>
                <div className="w-[50px] h-[50px]">

                  <Img
                    loader={
                      <div className="w-[50px] h-[50px] rounded-full skeleton"></div>
                    }
                    className="rounded-full w-[50px] h-[50px] "
                    src={author?.Avatar}
                  />
                </div>
              </div>
              <Link

                to={`/post/${postDetail["id"]}?type=${postType == "general" ? "general" : "community"
                  }`}
              >
                <h1 className=" font-[teko]  md:text-2xl text-md  font-semibold text-blAccent dark:text-accent ">
                  {truncateText(postDetail?.Title, 50)}
                </h1>
                <span className="text-tertiary text-[12px] md:font-md ">   {postDetail.Edited ? '    edited' : ''}</span>

                <div className="flex items-center justify-start gap-2">
                  <span className="dark:text-textPrimary md:text-md text-sm  text-textSecondary">
                    By @{author?.Username}

                  </span>
                  <span className="text-tertiary p-2 flex items-center justify-start md:text-md text-sm  gap-2 ">
                    {/* <Calendar variant="Bold" size="15" className="text-gray-500" /> */}
                    {getTimeElapsedSince(postDetail['Created At'].seconds)} ago
                  </span>
                </div>
              </Link>
            </div>

            <div className="dropdown dropdown-end ">
              <div tabIndex={0} role="button" className="m-1">
                <Setting4
                  size="25"
                  className="dark:text-primary text-secondary"
                />
              </div>
              <ul
                tabIndex={0}
                className=" dropdown-content z-[1] menu p-2 shadow dark:bg-secondary bg-primary rounded-box w-52"
              >
                {postDetail["Created By"] == user.uid && (
                  <li className="dark:hover:bg-darkerGrey rounded-lg flex hover:bg-softGrey dark:text-primary text-secondary">

                    <a
                      className=" dark:hover:bg-darkerGrey hover:bg-softGrey"
                      onClick={() => {
                        navigation(
                          `/edit/post/${postDetail["id"]}?type=${postType == "general" ? "general" : "community"
                          }`
                        );
                      }}
                    >
                      <Edit
                        size="20"
                        className="dark:text-primary text-secondary"
                      />Edit Post
                    </a>
                  </li>
                )}
                {postDetail["Created By"] == user.uid && (
                  <li className="dark:hover:bg-darkerGrey rounded-lg flex hover:bg-softGrey dark:text-primary text-secondary">
                    <a
                      className=" dark:hover:bg-darkerGrey hover:bg-softGrey"
                      onClick={() =>
                        deletePost(postDetail.id, communityId, postType)
                      }
                    >
                      <Trash
                        size="20"
                        className="dark:text-primary text-secondary"
                      /> Delete Post
                    </a>
                  </li>
                )}
                {postDetail["Created By"] !== user.uid && (
                  <li className="dark:hover:bg-darkerGrey rounded-lg flex hover:bg-softGrey  text-red-600">
                    <a
                      className=" dark:hover:bg-darkerGrey hover:bg-softGrey"
                      onClick={handleReport}
                    >
                      <Flag
                        size="20"
                        className=" text-red-600"
                      /> Report Post
                    </a>
                  </li>
                )}
              </ul>
            </div>
            {openReport && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                  <dialog id="my_modal_2" className="modal" open>
                    <div className="modal-box dark:bg-secondary dark:text-textPrimary">
                      <h3 className="font-bold text-lg mb-2">Report Post!</h3>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="I just don't like It"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">I just do not like It</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="It's Spam"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">It is a Spam</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Nudity and Sexual Activity"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">Nudity and Sexual Activity</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Hate Speech or Symbols"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">Hate Speech or Symbols</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Violence and Dangerous Content"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">
                          Violence and Dangerous Content
                        </label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Bullying and Harassment"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">Bullying and Harassment</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="False Information"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">False Information</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Suicide or Self-Injury"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">Suicide or Self-Injury</label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Sale of Illegal or Regualted Goods"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">
                          Sale of Illegal or Regualted Goods
                        </label>
                        <br />
                      </div>
                      <div className="mb-3 gap-3 flex">
                        <input
                          type="radio"
                          name="radio-2"
                          value="Intellectual Property Violation"
                          className="radio radio-primary"
                          onChange={handleReportChange}
                        />
                        <label htmlFor="Spam">
                          Intellectual Property Violation
                        </label>
                        <br />
                      </div>
                      <InputField
                        type="textarea"
                        placeholder="Please tell us more (Optional)..."
                        value={detail}
                        setValue={setDetail}
                        maxLength={CHARACTERS_LIMITS.postReportCharLength}
                        onChange={handleReport}
                      ></InputField>
                      <div className="my-2">
                        {
                          <Button
                            onClickHandler={handleSubmitReport}
                            isDisabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="w-full flex items-center justify-center">
                                <div className="w-8 h-6">
                                  <LoadingSpinner />
                                </div>
                              </div>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        }
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button onClick={closeModal}>Close</button>
                    </form>
                  </dialog>
                </div >
              </div >
            )}
          </div >

          <div className="p-2">
            <h1 className="dark:text-textPrimary text-textSecondary">
              {postDetail.Description &&
                truncateText(postDetail?.Description, 100)}
            </h1>
          </div>

          <div className="carousel w-full">
            {postDetail["Media URL"] &&
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

          {
            translatedtext && (
              <div className="p-2">
                <h1 className="dark:text-textPrimary text-textSecondary">
                  {translatedtext}
                </h1>
              </div>
            )
          }
          {
            detectedLanguageCode !== "en" && (
              <h6
                className="cursor-pointer underline Dark:text-accent text-blAccent"
                onClick={() => translatePost()}
              >
                Translate Post
              </h6>
            )
          }

          <div className="flex items-center justify-around  my-2   bg-slate-100 dark:bg-gray-800 rounded-xl p-2">
            <div className="flex items-center justify-center gap-2 cursor-pointer">
              <Heart
                aria-disabled={isLiking}
                onClick={() => likeOrDislikePost(postDetail.id)}
                size="20"
                variant={isLiked ? "Bold" : "Outline"}
                className="text-[#E1306C]"
              />
              <h1 className="text-[#E1306C]">
                {postDetail && postDetail["Likes"].length}{" "}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Link
                to={`/post/${postDetail["id"]}?type=${postType == "general" ? "general" : "community"
                  }`}
              >
                <MessageProgramming
                  variant="Bold"
                  size="20"
                  className="text-[#E1306C]"
                />
              </Link>
              <h1 className="text-[#E1306C] text-sm">
                {postDetail.Comments?.length ?? 0}
              </h1>
            </div>
          </div>

          {/* {postDetail["Created By"] == user.uid && (
            <Button
              onClickHandler={() =>
                deletePost(postDetail.id, communityId, postType)
              }
              isDisabled={deleting}
              outline={true}
            >
              <h1 className="text-warning">
                {deleting ? "Deleting..." : "Delete Post"}
              </h1>
            </Button>
          )} */}
        </div >
      )}
    </>
  );
};
export default PostCardComponent;
