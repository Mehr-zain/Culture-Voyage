/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/AuthContext";
import { getUserData } from "../../utils/Firebase Utils Functions";

export default function Message({ message }) {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (message?.["Sender ID"]) {
          const data = await getUserData(message?.["Sender ID"]);
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, [message?.["Sender ID"]]);

  const isSentByUser = message?.["Sender ID"] === user.uid;

  return (
    <div className={`chat ${isSentByUser ? "chat-end" : "chat-start"} `}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User Avatar" src={userData?.Avatar} />
        </div>
      </div>
      <div className="chat-bubble md:text-md text-sm">{message.Message}</div>
    </div>
  );
}
