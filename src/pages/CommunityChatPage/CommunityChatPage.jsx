import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Message from "../../components/Message/Message.component";
import SendMessage from "../../components/Message/SendMessage.component";
import { db } from "../../firebase/Firebase";
import {
  query,
  collection,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";

export const CommunityChatPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  // console.log(id)

  useEffect(() => {
    const q = query(
      collection(db, "Community Chat"),
      where("Community ID", "==", id),
      orderBy("Time")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <div className="h-full  flex flex-col justify-between pt-4 m-2 bg-primary dark:bg-secondary rounded-lg shadow-xl">
      <div className="w-full p-4  dark:bg-secondary">
        <div className="flex flex-col ">
          {messages &&
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
        </div>
      </div>
      <div className="rounded-xl">
        <div className="w-full ">
          <SendMessage />
        </div>
      </div>
    </div>
  );
};
