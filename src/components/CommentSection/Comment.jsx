/* eslint-disable react/prop-types */
import { useState } from "react";
import InputField from "../Inputfield/InputField.component";
import Button from "../Button/Button.component";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { useAddComment } from "../../hooks/useAddComment";
import axios from "axios";


const PERSPECTIVE_API_URL = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyCZHzklAcaamZlXVAvJAx2bkcvrG3ZwWUc";
const Comment = ({ postID }) => {
  const [description, setDescription] = useState("");
  const { addComment, isAddingComment } = useAddComment();
  const [isToxic, setIsToxic] = useState(false)
  const handleAddComment = async () => {
    if (description.trim() !== "") {
      axios
        .post(PERSPECTIVE_API_URL, {
          comment: {
            text: description
          },
          languages: ["en"],
          requestedAttributes: {
            TOXICITY: {},
            // INSULT: {},
            // FLIRTATION: {},
            // THREAT: {}
          }
        })
        .then(async (res) => {
          const toxicityScore = res.data.attributeScores.TOXICITY.summaryScore.value;
          if (toxicityScore < 0.6) {
            await addComment(description, postID);
            setDescription("");
            setIsToxic(false)
          }
          else {
            setIsToxic(true)
          }
        })
        .catch((error) => {
          // The perspective request failed, put some defensive logic here!
          alert(error.message)
          setDescription("");
        })
    }
  };

  return (
    <div className="mt-4 w-full">
      <InputField
        type="textarea"
        value={description}
        setValue={setDescription}
        maxLength={1000}
        placeholder="Write Your Comment"
      ></InputField>
      <div className="flex justify-end  my-4 cursor-pointer">
        <div>
          <Button
            onClickHandler={handleAddComment}
            isDisabled={isAddingComment}
          >
            {isAddingComment ? (
              <div className="w-full flex items-center justify-center">
                <div className="w-16 h-6">
                  <LoadingSpinner size={30} />
                </div>
              </div>
            ) : (
              "Comment"
            )}
          </Button>
        </div>

      </div>
      <div>
        {
          isToxic && <h1>Your Comments is toxic in nature.</h1>
        }
      </div>
    </div>
  );
};

export default Comment;
