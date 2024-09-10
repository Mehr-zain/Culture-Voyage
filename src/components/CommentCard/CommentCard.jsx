/* eslint-disable react/prop-types */
import { arrayRemove, arrayUnion, doc, updateDoc, getDocs, addDoc, collection, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getTimeElapsedSince } from '../../utils';
import { Calendar, Like1, Location } from 'iconsax-react';
import { useContext, useEffect, useState } from 'react';
import { Img } from 'react-image';
import { db } from '../../firebase/Firebase';
import { UserContext } from '../../context/AuthContext';
import InputField from '../Inputfield/InputField.component';
import Button from '../Button/Button.component';
import axios from 'axios';

export function CommentCard({ comment, commentUsers }) {

    const [isLiked, setIsLiked] = useState(false);
    const { user } = useContext(UserContext);
    const [openReplyForm, setOpenReplyForm] = useState(false);
    const [likeProcessing, setLikeProcessing] = useState(false);
    const [replyDescription, setReplyDescription] = useState('');
    const [isToxic, setIsToxic] = useState(false);
    const [error, setError] = useState(null);
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        fetchReplies();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToReplies();
        return () => unsubscribe();
    }, []);

    const fetchReplies = async () => {
        try {
            const repliesQuery = query(collection(db, 'Comments', comment.id, 'Comments Reply'), orderBy('Created At'));
            const snapshot = await getDocs(repliesQuery);
            const fetchedReplies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReplies(fetchedReplies);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const subscribeToReplies = () => {
        const repliesQuery = query(collection(db, 'Comments', comment.id, 'Comments Reply'), orderBy('Created At'));
        const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
            const fetchedReplies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReplies(fetchedReplies);
        });
        return unsubscribe;
    };

    const addOrRemoveLike = async (commentId) => {
        if (likeProcessing) return;
        setLikeProcessing(true);

        try {
            const ref = doc(db, 'Comments', commentId);
            if (!isLiked) {
                await updateDoc(ref, {
                    Likes: arrayUnion(user.uid)
                });
                setIsLiked(true);
            } else {
                await updateDoc(ref, {
                    Likes: arrayRemove(user.uid)
                });
                setIsLiked(false);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLikeProcessing(false);
        }
    };

    const handleAddCommentReply = async () => {
        if (replyDescription.trim() === '') return;

        try {
            const response = await axios.post(
                "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyCZHzklAcaamZlXVAvJAx2bkcvrG3ZwWUc",
                {
                    comment: {
                        text: replyDescription,
                    },
                    languages: ["en"],
                    requestedAttributes: {
                        TOXICITY: {},
                    },
                }
            );

            const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
            if (toxicityScore < 0.6) {
                await addDoc(collection(db, 'Comments', comment.id, 'Comments Reply'), {
                    'Created At': serverTimestamp(),
                    'Created By': user.uid,
                    Description: replyDescription,
                    'Post ID': comment.id,
                });
                setReplyDescription('');
                setIsToxic(false);
                setOpenReplyForm(false);
            } else {
                setIsToxic(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="p-2 w-full border-b-[1px] dark:border-darkGrey my-3 py-3">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10">
                    <Img
                        className="w-10 h-10 rounded-full"
                        src={commentUsers[comment["Created By"]]?.Avatar}
                        alt="Profile Pic"
                    />
                </div>
                <div>
                    <h1 className="font-bold dark:text-textPrimary text-textSecondary">
                        {commentUsers[comment["Created By"]]?.Username}
                    </h1>
                    <div className="flex gap-4 items-center justify-center">
                        <div className="flex items-center justify-start gap-1">
                            <Location variant="Bold" size="15" className="text-gray-500" />
                            <span className="text-sm font-thin text-gray-500">
                                {commentUsers[comment["Created By"]]?.Country}
                            </span>
                        </div>
                        <div className="flex items-center justify-start gap-1">
                            <Calendar variant="Bold" size="15" className="text-gray-500" />
                            <span className="text-sm font-thin text-gray-500">
                                {comment['Created At'] ? getTimeElapsedSince(comment['Created At'].seconds) : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="dark:text-textPrimary text-textSecondary my-3">{comment.Description}</p>
            </div>
            <div className='flex items-center text-tertiary justify-between gap-4'>
                <div onClick={() => setOpenReplyForm(!openReplyForm)} className='hover:underline underline-offset-2 cursor-pointer'>
                    {!openReplyForm ? 'Reply' : 'Cancel'}
                </div>
                <div onClick={() => addOrRemoveLike(comment.id)} className='flex items-center cursor-pointer justify-center gap-1'>
                    <Like1 size="20" variant={`${isLiked ? 'Bold' : 'Outline'}`} />
                    <h1 className='mt-1 w-4 text-center'>{comment.Likes?.length ?? 0}</h1>
                </div>
            </div>
            {openReplyForm && (
                <div className='my-2'>
                    <InputField
                        type='textarea'
                        maxLength={1000}
                        value={replyDescription}
                        setValue={setReplyDescription}
                        placeholder='Write your reply...'
                    />
                    {isToxic && <p className="text-red-500">Your comment is considered toxic. Please revise it.</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    <div className='my-2 w-28'>
                        <Button onClickHandler={handleAddCommentReply}>Reply</Button>
                    </div>
                </div>
            )}

            {/* Display Replies */}
            {replies.length > 0 && (
                <div className="ml-6 border-l-2 pl-4 mt-4">
                    {replies.map(reply => (
                        <div key={reply.id} className="mt-2">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8">
                                    <Img
                                        className="w-8 h-8 rounded-full"
                                        src={commentUsers[reply["Created By"]]?.Avatar}
                                        alt="Profile Pic"
                                    />
                                </div>
                                <div>
                                    <h1 className="font-bold dark:text-textPrimary text-textSecondary">
                                        {commentUsers[reply["Created By"]]?.Username}
                                    </h1>
                                    <div className="flex gap-4 items-center justify-center">
                                        <div className="flex items-center justify-start gap-1">
                                            <Location variant="Bold" size="12" className="text-gray-500" />
                                            <span className="text-xs font-thin text-gray-500">
                                                {commentUsers[reply["Created By"]]?.Country}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-start gap-1">
                                            <Calendar variant="Bold" size="12" className="text-gray-500" />
                                            <span className="text-xs font-thin text-gray-500">
                                                {reply['Created At'] ? getTimeElapsedSince(reply['Created At'].seconds) : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="dark:text-textPrimary text-textSecondary my-2">{reply.Description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
