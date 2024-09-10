import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/AuthContext";
import { db } from "../../firebase/Firebase";
import { addDoc, collection } from "firebase/firestore";
import InputField from "../Inputfield/InputField.component";
import { Send } from "iconsax-react";
import { getUserData } from "../../utils/Firebase Utils Functions";
import { useParams } from "react-router-dom";
import { CommunityChatModel } from "../../Models/CommunityChatModel";

export default function SendMessage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [input, setInput] = useState();
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      const data = await getUserData(user.uid);
      console.log("Data", data);
      setUserData(data);
    })();
  }, [user.uid]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Input Field Empty");
      return;
    }
    const communityChatModel = new CommunityChatModel(user.uid, input, id);
    await addDoc(collection(db, "Community Chat"), {
      ...communityChatModel,
    });
    setInput("");
  };
  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            sendMessage(event);
          }
        }}
        className="w-full dark:bg-secondary bg-primary rounded-lg"
      >
        <InputField
          placeholder="Type a Message..."
          type="text"
          value={input}
          setValue={setInput}
        >
          <Send className={"dark:text-primary text-darkGrey  cursor-pointer"} />
        </InputField>
      </div>
    </>
  );
}
