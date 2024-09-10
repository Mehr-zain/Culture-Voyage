import React, { useContext, useState, useEffect, useRef } from "react";
import { getUserData } from "../../utils/Firebase Utils Functions";
import { UserContext } from "../../context/AuthContext";
import { SearchNormal, Send } from "iconsax-react";
import { db } from "../../firebase/Firebase";
import {
  addDoc,
  serverTimestamp,
  updateDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import InputField from "../../components/Inputfield/InputField.component";
import {
  collection,
  getDocs,
  query,
  setDoc,
  where,
  doc,
  getDoc,
  orderBy as firebaseOrderBy,
} from "firebase/firestore";
import { UserChatModel } from "../../Models/UserChatModel";
import {
  Configure,
  Highlight,
  Hits,
  Index,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { Img } from "react-image";
import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(
  "8FN5XIJFZE",
  "9a3598ba0ccf3cecbe427c8821ac7204"
);

function CustomSearchBox({ value, setValue }) {
  const { refine } = useSearchBox();
  const { status } = useInstantSearch();
  const isSearchStalled = status === "stalled";

  function handleInputChange(event) {
    const newQuery = event.currentTarget.value;
    setValue(newQuery);
    refine(newQuery);
  }

  return (
    <div className="border-2 focus-within:border-blAccent dark:focus-within:border-accent w-full h-full flex items-center justify-start gap-2 text-textSecondary dark:text-textPrimary border-borderPrimary dark:border-borderSecondary p-2 rounded-2xl">
      <SearchNormal
        size="25"
        className="dark:text-textPrimary text-textSecondary"
      />
      <input
        className="bg-transparent border-none outline-none w-full h-full"
        ref={null}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Search user"
        spellCheck={false}
        maxLength={512}
        type="search"
        value={value}
        onChange={handleInputChange}
        autoFocus
      />
      {isSearchStalled && <span>Searching…</span>}
    </div>
  );
}

export const UserChatPage = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState();
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [searchUser, setSearchUser] = useState();
  const [userId, setUserId] = useState();
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    fetchRecentChats(user.uid);
  }, [user.uid]);

  const fetchRecentChats = async (userId) => {
    try {
      const chatsRef = collection(db, "User Chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", userId),
        orderBy("Time", "desc")
      );
      const querySnapshot = await getDocs(q);

      let recentChatsData = [];
      for (const chatDoc of querySnapshot.docs) {
        const chatData = chatDoc.data();
        const otherUserId = chatData.participants.find((id) => id !== userId);
        const otherUserData = await getUserData(otherUserId);
        recentChatsData.push({
          ...chatData,
          otherUserData,
          otherUserId,
          combinedId: chatDoc.id,
        });
      }

      setRecentChats(recentChatsData);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };

  const sendMessage = async (id, userId, text) => {
    if (!text.trim()) {
      console.log("Empty Message");
      return;
    }
    try {
      const combinedId = id > userId ? id + userId : userId + id;
      const chatRef = doc(db, "User Chats", combinedId);

      await updateDoc(chatRef, {
        lastMessage: text,
        Time: serverTimestamp(),
      });

      const messagesRef = collection(chatRef, "Messages");
      const userChatModel = new UserChatModel(id, text, userId);
      await addDoc(messagesRef, { ...userChatModel });

      console.log("Message sent successfully");
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSelect = async (id, userId) => {
    try {
      const data = await getUserData(userId);
      setUserData(data);
      const combinedId = id > userId ? id + userId : userId + id;
      const chatRef = doc(db, "User Chats", combinedId);
      const chatSnapshot = await getDoc(chatRef);
      if (!chatSnapshot.exists()) {
        await setDoc(chatRef, {
          lastMessage: null,
          participants: [id, userId],
          Time: serverTimestamp(),
        });
      }
      const unsubscribe = await fetchMessages(combinedId);
      return () => unsubscribe();
    } catch (error) {
      console.error("Error handling selection:", error);
    }
  };

  const fetchMessages = async (combinedId) => {
    try {
      const chatRef = doc(db, "User Chats", combinedId);
      const messagesQuery = query(
        collection(chatRef, "Messages"),
        orderBy("Time")
      );
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return isToday
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString();
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="posts" insights>
      <Configure hitsPerPage={5} />
      <div className="flex justify-between">
        <div className="w-[68%] h-auto p-1 bg-primary rounded-xl shadow-xl dark:bg-secondary dark:border">
          <div className="flex justify-start items-center gap-2 bg-blAccent dark:bg-accent rounded-xl ">
            <div className="w-16 h-16 p-1">
              {userData && (
                <img
                  className="object-cover rounded-full w-full h-full"
                  src={userData?.Avatar}
                  alt="User Avatar"
                />
              )}
            </div>
            {userData && (
              <h1 className="font-[teko] font-medium text-xl text-textSecondary">
                {userData.Username}
              </h1>
            )}
          </div>
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat ${message?.["Sender ID"] === user.uid
                  ? "chat-end"
                  : "chat-start"
                  }`}
              >
                <div
                  className={`chat-bubble ${message?.["Sender ID"] === user.uid
                    ? "chat-bubble-primary"
                    : "chat-bubble"
                    }`}
                >
                  {message.Message}
                  <span className="text-xs text-white ml-1">{formatTime(message.Time)}</span>
                </div>
              </div>
            ))}
            <div>
              {userData && (
                <div
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(user.uid, userId, text);
                    }
                  }}
                  className=" w-auto dark:bg-secondary bg-primary rounded-xl "
                >
                  <InputField
                    placeholder="Enter Message..."
                    type="text"
                    value={text}
                    setValue={setText}
                  >
                    <Send
                      className="dark:text-primary text-darkGrey cursor-pointer "
                      onClick={() => sendMessage(user.uid, userId, text)}
                    />
                  </InputField>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:w-[30%] relative p-3 rounded-xl shadow-x dark:bg-secondary bg-primary dark:border">
          <div className="w-[270px] flex h-10 items-center gap-1">
            <CustomSearchBox value={search} setValue={setSearch} />
          </div>
          <div className="absolute top-22 bg-white left-0 w-full h-22 overflow-auto">
            <Index indexName="users">
              {search.length > 0 && (
                <div className="overflow-scroll h-22">
                  <Hits
                    hitComponent={({ hit }) => {
                      return (
                        <article className="p-2 m-2 border cursor-pointer">
                          <div
                            className="flex justify-start items-center gap-2"
                            onClick={() => {
                              setUserId(hit.objectID);
                              handleSelect(user.uid, hit.objectID);
                            }}
                          >
                            <div className="w-12 h-12">
                              <Img
                                loader={
                                  <div className="w-full h-full rounded-full skeleton"></div>
                                }
                                className="w-full h-full rounded-full object-cover"
                                src={hit.Avatar}
                              />
                            </div>
                            <Highlight attribute="Username" hit={hit} />
                          </div>
                        </article>
                      );
                    }}
                  />
                </div>
              )}
            </Index>
            <div>
              <h2 className="text-lg font-semibold text-center p-3">
                Recent Chats
              </h2>
              {recentChats.map((chat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setUserId(chat?.otherUserId);
                    handleSelect(user.uid, chat?.otherUserId);
                  }}
                >
                  <div className="w-12 h-12">
                    <Img
                      loader={
                        <div className="w-full h-full rounded-full skeleton"></div>
                      }
                      className="w-full h-full rounded-full object-cover"
                      src={chat.otherUserData?.Avatar}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-md font-medium">
                      {chat.otherUserData?.Username}
                    </h3>
                    <p className="text-sm text-gray-500">{chat?.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-500">
                      {formatTime(chat.Time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
};
